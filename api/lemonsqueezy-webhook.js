const crypto = require("node:crypto");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return sendJson(res, 405, { ok: false, error: "Method not allowed" });
  }

  const rawBody = await readRawBody(req);
  const signature = req.headers["x-signature"];
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

  if (!secret) {
    return sendJson(res, 500, { ok: false, error: "Missing LEMON_SQUEEZY_WEBHOOK_SECRET" });
  }

  if (!isValidSignature(rawBody, signature, secret)) {
    return sendJson(res, 401, { ok: false, error: "Invalid webhook signature" });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch (error) {
    return sendJson(res, 400, { ok: false, error: "Invalid JSON payload" });
  }

  const eventName = req.headers["x-event-name"] || payload?.meta?.event_name || "";
  if (eventName !== "order_created") {
    return sendJson(res, 200, { ok: true, ignored: eventName || "unknown" });
  }

  const order = payload?.data?.attributes || {};
  const email = normalizeEmail(order.user_email);
  const name = String(order.user_name || "").trim();

  if (!email) {
    return sendJson(res, 400, { ok: false, error: "Missing buyer email in order payload" });
  }

  const customData = payload?.meta?.custom_data || {};
  const buyer = {
    email,
    name,
    organization: String(customData.organization || "").trim(),
    role: String(customData.role || "").trim(),
  };

  const softrResult = await provisionSoftrAccess(buyer);
  const emailResult = await sendPostPurchaseEmail({
    buyer,
    order,
    softrResult,
  });

  return sendJson(res, 200, {
    ok: true,
    event: eventName,
    buyer: { email, name },
    softr: softrResult,
    emailDelivery: emailResult,
  });
};

async function provisionSoftrAccess(buyer) {
  const apiKey = process.env.SOFTR_API_KEY;
  const domain = process.env.SOFTR_DOMAIN;

  if (!apiKey || !domain) {
    return {
      ok: false,
      skipped: true,
      reason: "Missing SOFTR_API_KEY or SOFTR_DOMAIN",
    };
  }

  const createPayload = {
    full_name: buyer.name || buyer.email,
    email: buyer.email,
    generate_magic_link: envFlag("SOFTR_GENERATE_MAGIC_LINK", true),
  };

  let createResponse;
  let createJson = null;
  try {
    createResponse = await fetch("https://studio-api.softr.io/v1/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Softr-Api-Key": apiKey,
        "Softr-Domain": domain,
      },
      body: JSON.stringify(createPayload),
    });
    createJson = await safeJson(createResponse);
  } catch (error) {
    return {
      ok: false,
      stage: "create_user",
      error: error.message,
    };
  }

  const alreadyExists =
    createResponse.status === 409 ||
    /already exists/i.test(JSON.stringify(createJson || {}));

  if (!createResponse.ok && !alreadyExists) {
    return {
      ok: false,
      stage: "create_user",
      status: createResponse.status,
      body: createJson,
    };
  }

  const magicLinkResult = await generateMagicLink(buyer.email, apiKey, domain);
  const syncResult = envFlag("SOFTR_SYNC_AFTER_PROVISION", false)
    ? await syncSoftrUsers([buyer.email], apiKey, domain)
    : { ok: true, skipped: true };

  return {
    ok: createResponse.ok || alreadyExists,
    created: createResponse.ok,
    existingUser: alreadyExists,
    magicLink: magicLinkResult.magicLink || null,
    magicLinkStatus: magicLinkResult,
    syncStatus: syncResult,
  };
}

async function generateMagicLink(email, apiKey, domain) {
  try {
    const response = await fetch(
      "https://studio-api.softr.io/v1/api/users/magic-link/generate/" + encodeURIComponent(email),
      {
        method: "POST",
        headers: {
          "Softr-Api-Key": apiKey,
          "Softr-Domain": domain,
        },
      }
    );
    const json = await safeJson(response);
    return {
      ok: response.ok,
      status: response.status,
      magicLink: extractMagicLink(json),
      body: json,
    };
  } catch (error) {
    return {
      ok: false,
      stage: "generate_magic_link",
      error: error.message,
      magicLink: null,
    };
  }
}

async function syncSoftrUsers(emails, apiKey, domain) {
  try {
    const response = await fetch("https://studio-api.softr.io/v1/api/users/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Softr-Api-Key": apiKey,
        "Softr-Domain": domain,
      },
      body: JSON.stringify({ emails }),
    });
    return {
      ok: response.ok,
      status: response.status,
      body: await safeJson(response),
    };
  } catch (error) {
    return {
      ok: false,
      stage: "sync_users",
      error: error.message,
    };
  }
}

async function sendPostPurchaseEmail({ buyer, order, softrResult }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    return {
      ok: false,
      skipped: true,
      reason: "Missing RESEND_API_KEY or RESEND_FROM_EMAIL",
    };
  }

  const loginUrl =
    softrResult?.magicLink ||
    process.env.SOFTR_LOGIN_URL ||
    process.env.SOFTR_APP_URL ||
    "";

  const thankYouUrl = buildThankYouUrl(order, buyer.email);
  const subject = process.env.POST_PURCHASE_EMAIL_SUBJECT || "Your BOS access is ready";
  const html = buildBuyerEmailHtml({
    buyer,
    loginUrl,
    thankYouUrl,
  });

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [buyer.email],
        subject,
        html,
      }),
    });

    return {
      ok: response.ok,
      status: response.status,
      body: await safeJson(response),
    };
  } catch (error) {
    return {
      ok: false,
      stage: "send_email",
      error: error.message,
    };
  }
}

function buildBuyerEmailHtml({ buyer, loginUrl, thankYouUrl }) {
  const safeName = escapeHtml(buyer.name || "there");
  const safeLoginUrl = escapeHtml(loginUrl);
  const safeThankYouUrl = escapeHtml(thankYouUrl);

  return [
    "<div style=\"font-family:Inter,Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:640px\">",
    `<h2 style="margin:0 0 16px;">Welcome to BOS, ${safeName}</h2>`,
    "<p>Your payment for the Funding Intelligence Vault has been received.</p>",
    loginUrl
      ? `<p><a href="${safeLoginUrl}" style="display:inline-block;background:#f59e0b;color:#0f172a;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:700;">Open your workspace</a></p>`
      : "<p>Your Softr access is being provisioned. Use the same email address you purchased with when you log in.</p>",
    `<p>You can also revisit your onboarding page here: <a href="${safeThankYouUrl}">${safeThankYouUrl}</a></p>`,
    "<p>If you have any trouble accessing your workspace, reply to this email or contact subscribe@itsdigitally.com.</p>",
    "</div>",
  ].join("");
}

function buildThankYouUrl(order, email) {
  const siteUrl = process.env.SITE_URL || "https://funding-intelligence-vault.vercel.app";
  const url = new URL("/thank-you", siteUrl);
  url.searchParams.set("status", "paid");
  if (order?.identifier) {
    url.searchParams.set("order_id", order.identifier);
  }
  if (email) {
    url.searchParams.set("email", email);
  }
  return url.toString();
}

function isValidSignature(rawBody, signature, secret) {
  if (!signature || !secret) return false;

  const digest = Buffer.from(
    crypto.createHmac("sha256", secret).update(rawBody).digest("hex"),
    "utf8"
  );
  const sent = Buffer.from(String(signature), "utf8");

  if (digest.length !== sent.length) return false;
  return crypto.timingSafeEqual(digest, sent);
}

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function safeJson(response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (_) {
    return { raw: text };
  }
}

function extractMagicLink(value) {
  if (!value) return null;
  if (typeof value === "string") {
    if (/^https?:\/\//i.test(value) && /magic|token|login|auth/i.test(value)) {
      return value;
    }
    return null;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const match = extractMagicLink(item);
      if (match) return match;
    }
    return null;
  }
  if (typeof value === "object") {
    for (const key of Object.keys(value)) {
      const keyName = key.toLowerCase();
      const item = value[key];
      if (typeof item === "string" && /^https?:\/\//i.test(item) && /magic|token|login|auth/i.test(keyName + " " + item)) {
        return item;
      }
      const nested = extractMagicLink(item);
      if (nested) return nested;
    }
  }
  return null;
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function envFlag(name, fallbackValue) {
  const value = process.env[name];
  if (value == null || value === "") return fallbackValue;
  return String(value).toLowerCase() === "true";
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}
