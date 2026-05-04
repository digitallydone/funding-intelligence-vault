/**
 * BOSs | Funding Intelligence Vault — Site JavaScript
 * Handles: config injection, Paystack checkout, Formspree, redirects, UI state
 */

(function () {
  "use strict";

  // ── Wait for DOM ──────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", init);

  function init() {
    applyConfig();
    bindExternalLinks();
    bindPaystackButton();
    bindRequestForm();
    bindThankYouPage();
    bindCustomerStartPage();
    bindStickyNav();
    bindGuideCTA();
  }

  // ── Config application ────────────────────────────────────────
  function applyConfig() {
    if (typeof SITE_CONFIG === "undefined") return;

    // Inject text values
    document.querySelectorAll("[data-config]").forEach((el) => {
      const key = el.dataset.config;
      if (SITE_CONFIG[key] !== undefined) el.textContent = SITE_CONFIG[key];
    });

    // Inject href values
    document.querySelectorAll("[data-config-href]").forEach((el) => {
      const key = el.dataset.configHref;
      const val = SITE_CONFIG[key];
      if (val) {
        el.href = val;
        el.removeAttribute("disabled");
        el.classList.remove("hidden");
        el.closest("[data-optional]")?.classList.remove("hidden");
      } else {
        // Hide the button if the value is empty
        const wrapper = el.closest("[data-optional]");
        if (wrapper) {
          wrapper.classList.add("hidden");
        } else {
          el.classList.add("hidden");
        }
      }
    });

    // CSV download — always show if file exists
    document.querySelectorAll("[data-csv-download]").forEach((el) => {
      const url = SITE_CONFIG.csvDownloadUrl;
      if (url) {
        el.href = url;
        el.setAttribute("download", "funding-intelligence-vault.csv");
        el.closest("[data-optional]")?.classList.remove("hidden");
      }
    });

    // Support email links
    document.querySelectorAll("[data-support-email]").forEach((el) => {
      const email = SITE_CONFIG.supportEmail;
      if (email) {
        el.href = "mailto:" + email;
        el.textContent = el.textContent || email;
      }
    });
  }

  // ── External links → new tab ──────────────────────────────────
  function bindExternalLinks() {
    document.querySelectorAll("a[data-external]").forEach((link) => {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });
  }

  // ── Paystack checkout ─────────────────────────────────────────
  function bindPaystackButton() {
    const btn = document.getElementById("paystack-btn");
    if (!btn) return;

    btn.addEventListener("click", function () {
      const email = getStoredEmail() || promptForEmail();
      if (!email) return;
      launchPaystack(email);
    });
  }

  function launchPaystack(email, metadata) {
    if (typeof SITE_CONFIG === "undefined") {
      showPaymentFallback("Configuration not loaded. Please refresh and try again.");
      return;
    }

    const key = SITE_CONFIG.paystackPublicKey;

    if (!key) {
      showPaymentFallback(SITE_CONFIG.paystackFallbackMessage);
      return;
    }

    if (typeof PaystackPop === "undefined") {
      showPaymentFallback(
        "Payment provider could not load. Please check your internet connection and try again."
      );
      return;
    }

    const handler = PaystackPop.setup({
      key: key,
      email: email,
      amount: SITE_CONFIG.paystackAmount,
      currency: SITE_CONFIG.paystackCurrency,
      label: SITE_CONFIG.productName + " — Early Access",
      metadata: metadata || {},
      onClose: function () {
        // User closed modal — do nothing, let them re-open
      },
      callback: function (response) {
        onPaymentSuccess(response.reference);
      },
    });

    handler.openIframe();
  }

  function onPaymentSuccess(reference) {
    storeTransactionRef(reference);
    window.location.href =
      "thank-you.html?ref=" + encodeURIComponent(reference) + "&status=paid";
  }

  function showPaymentFallback(message) {
    const container = document.getElementById("payment-fallback");
    if (container) {
      container.textContent = message;
      container.classList.remove("hidden");
      container.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      showAlert(message, "warning");
    }
  }

  // ── Request-access form (Formspree + Paystack) ────────────────
  function bindRequestForm() {
    const form = document.getElementById("request-form");
    if (!form) return;

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const submitBtn = form.querySelector('[type="submit"]');
      const data = getFormData(form);

      if (!validateForm(data)) return;

      setButtonLoading(submitBtn, true);

      // 1. Submit to Formspree
      const submitted = await submitToFormspree(data);

      // 2. Store email for Paystack
      storeEmail(data.email);

      // 3. Store lead data
      storeLead(data);

      setButtonLoading(submitBtn, false);

      if (submitted) {
        showFormSuccess("Details saved. Proceeding to payment…");
        await sleep(900);
      }

      // 4. Open Paystack regardless (even if Formspree failed)
      const metadata = {
        name: data.name,
        organization: data.organization,
        role: data.role,
      };

      launchPaystack(data.email, metadata);
    });
  }

  async function submitToFormspree(data) {
    const endpoint = SITE_CONFIG?.formspreeEndpoint;
    if (!endpoint) {
      console.info("[site.js] Formspree endpoint not configured — skipping form submission.");
      return false;
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          organization: data.organization,
          role: data.role,
          challenge: data.challenge,
          product: SITE_CONFIG.productName,
          source: window.location.href,
        }),
      });
      return res.ok;
    } catch (err) {
      console.warn("[site.js] Formspree error:", err.message);
      return false;
    }
  }

  function validateForm(data) {
    if (!data.name || data.name.length < 2) {
      showAlert("Please enter your full name.", "error");
      return false;
    }
    if (!isValidEmail(data.email)) {
      showAlert("Please enter a valid email address.", "error");
      return false;
    }
    return true;
  }

  function getFormData(form) {
    const fd = new FormData(form);
    return {
      name: (fd.get("name") || "").trim(),
      email: (fd.get("email") || "").trim().toLowerCase(),
      organization: (fd.get("organization") || "").trim(),
      role: (fd.get("role") || "").trim(),
      challenge: (fd.get("challenge") || "").trim(),
    };
  }

  // ── Thank-you page ────────────────────────────────────────────
  function bindThankYouPage() {
    const page = document.getElementById("thank-you-page");
    if (!page) return;

    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref") || getStoredTransactionRef();
    const status = params.get("status");

    const refEl = document.getElementById("transaction-ref");
    if (refEl && ref) refEl.textContent = ref;

    const lead = getStoredLead();
    const nameEl = document.getElementById("customer-name");
    if (nameEl && lead?.name) nameEl.textContent = lead.name.split(" ")[0];

    if (status === "paid" || ref) {
      page.classList.add("is-paid");
      document.querySelectorAll(".show-if-paid").forEach((el) => el.classList.remove("hidden"));
      document.querySelectorAll(".hide-if-paid").forEach((el) => el.classList.add("hidden"));
    }
  }

  // ── Customer start page ───────────────────────────────────────
  function bindCustomerStartPage() {
    const page = document.getElementById("customer-start-page");
    if (!page) return;
    // Softr, Sheets, Airtable buttons are handled inline by the page's own script
    // (customer-start.html has its own DOMContentLoaded handler for fine-grained control)
  }

  // ── Guide CTA ─────────────────────────────────────────────────
  function bindGuideCTA() {
    // Upgrade CTA at end of guide
    const upgradeBtn = document.getElementById("guide-upgrade-btn");
    if (upgradeBtn) {
      upgradeBtn.addEventListener("click", function () {
        window.location.href = "request-access.html";
      });
    }
  }

  // ── Sticky nav scroll behavior ────────────────────────────────
  function bindStickyNav() {
    const stickyCta = document.querySelector(".sticky-cta");
    if (!stickyCta) return;

    let heroBottom = 0;
    const hero = document.querySelector(".hero");
    if (hero) heroBottom = hero.offsetTop + hero.offsetHeight;

    function onScroll() {
      if (window.scrollY > heroBottom + 100) {
        stickyCta.style.display = "block";
      } else {
        stickyCta.style.display = "none";
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // ── UI helpers ────────────────────────────────────────────────
  function showAlert(msg, type = "info") {
    let container = document.getElementById("alert-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "alert-container";
      container.style.cssText = "position:fixed;top:80px;left:50%;transform:translateX(-50%);z-index:999;width:90%;max-width:460px;";
      document.body.appendChild(container);
    }

    const el = document.createElement("div");
    el.className = "alert alert-" + type;
    el.innerHTML = `<span>${escapeHtml(msg)}</span>`;

    const close = document.createElement("button");
    close.innerHTML = "&times;";
    close.style.cssText =
      "background:none;border:none;cursor:pointer;font-size:1.1rem;margin-left:auto;padding:0;opacity:.6;";
    close.onclick = () => el.remove();
    el.appendChild(close);

    container.appendChild(el);
    setTimeout(() => el.remove(), 6000);
  }

  function showFormSuccess(msg) {
    const el = document.getElementById("form-success");
    if (el) {
      el.textContent = msg;
      el.classList.remove("hidden");
    }
  }

  function setButtonLoading(btn, loading) {
    if (!btn) return;
    if (loading) {
      btn._originalText = btn.innerHTML;
      btn.innerHTML =
        '<span class="spinner"></span> Processing…';
      btn.disabled = true;
    } else {
      btn.innerHTML = btn._originalText || "Continue";
      btn.disabled = false;
    }
  }

  function promptForEmail() {
    return window.prompt("Please enter your email address to proceed:");
  }

  // ── Storage helpers ───────────────────────────────────────────
  function storeEmail(email) {
    try { sessionStorage.setItem("fiv_email", email); } catch (_) {}
  }
  function getStoredEmail() {
    try { return sessionStorage.getItem("fiv_email"); } catch (_) { return null; }
  }
  function storeLead(data) {
    try { sessionStorage.setItem("fiv_lead", JSON.stringify(data)); } catch (_) {}
  }
  function getStoredLead() {
    try { return JSON.parse(sessionStorage.getItem("fiv_lead") || "null"); } catch (_) { return null; }
  }
  function storeTransactionRef(ref) {
    try { sessionStorage.setItem("fiv_txref", ref); } catch (_) {}
  }
  function getStoredTransactionRef() {
    try { return sessionStorage.getItem("fiv_txref"); } catch (_) { return null; }
  }

  // ── Utils ─────────────────────────────────────────────────────
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }
})();
