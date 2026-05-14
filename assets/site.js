/**
 * BOS | Funding Intelligence Vault — Site JavaScript
 * Handles: config injection, Lemon Squeezy checkout, Formspree, redirects, UI state
 */

(function () {
  "use strict";

  // ── Wait for DOM ──────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", init);

  function init() {
    applyConfig();
    bindExternalLinks();
    bindLemonCheckoutButton();
    bindRequestForm();
    bindCheckoutRedirectPage();
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

  // ── Lemon Squeezy checkout ────────────────────────────────────
  function bindLemonCheckoutButton() {
    const btn = document.getElementById("lemon-checkout-btn");
    if (!btn) return;

    btn.addEventListener("click", function () {
      const email = getStoredEmail() || promptForEmail();
      if (!email) return;
      redirectToCheckoutPage({ email: email });
    });
  }

  function launchLemonCheckout(customer) {
    if (typeof SITE_CONFIG === "undefined") {
      showPaymentFallback("Configuration not loaded. Please refresh and try again.");
      return false;
    }

    const checkoutUrl = buildLemonCheckoutUrl(customer);

    if (!checkoutUrl) {
      showPaymentFallback(SITE_CONFIG.lemonSqueezyFallbackMessage);
      return false;
    }

    submitLemonCheckoutForm(customer);

    // Fallback in case the native form handoff is blocked or interrupted.
    window.setTimeout(function () {
      if (window.location.href.indexOf("lemonsqueezy.com") === -1) {
        window.location.replace(checkoutUrl);
      }
    }, 250);

    return true;
  }

  function redirectToCheckoutPage(customer) {
    const checkoutUrl = buildLemonCheckoutUrl(customer);
    if (!checkoutUrl) {
      showPaymentFallback(SITE_CONFIG?.lemonSqueezyFallbackMessage || "Checkout is unavailable right now.");
      return false;
    }

    try {
      sessionStorage.setItem("fiv_checkout_url", checkoutUrl);
    } catch (_) {}

    window.location.href = "checkout-redirect";
    return true;
  }

  function buildLemonCheckoutUrl(customer) {
    const baseUrl = SITE_CONFIG?.lemonSqueezyCheckoutUrl;
    if (!baseUrl) return null;

    try {
      const url = new URL(baseUrl);
      if (customer?.email) {
        url.searchParams.set("checkout[email]", customer.email);
      }
      if (customer?.name) {
        url.searchParams.set("checkout[name]", customer.name);
      }
      if (customer?.organization) {
        url.searchParams.set("checkout[custom][organization]", customer.organization);
      }
      if (customer?.role) {
        url.searchParams.set("checkout[custom][role]", customer.role);
      }
      return url.toString();
    } catch (err) {
      console.warn("[site.js] Invalid Lemon Squeezy URL:", err.message);
      return null;
    }
  }

  function submitLemonCheckoutForm(customer) {
    const baseUrl = SITE_CONFIG?.lemonSqueezyCheckoutUrl;
    if (!baseUrl) return;

    try {
      const url = new URL(baseUrl);
      const form = document.createElement("form");
      form.method = "GET";
      form.action = url.origin + url.pathname;
      form.style.display = "none";

      // Preserve any query params already present on the shared checkout URL.
      url.searchParams.forEach((value, key) => {
        appendHiddenInput(form, key, value);
      });

      if (customer?.email) {
        appendHiddenInput(form, "checkout[email]", customer.email);
      }
      if (customer?.name) {
        appendHiddenInput(form, "checkout[name]", customer.name);
      }
      if (customer?.organization) {
        appendHiddenInput(form, "checkout[custom][organization]", customer.organization);
      }
      if (customer?.role) {
        appendHiddenInput(form, "checkout[custom][role]", customer.role);
      }

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.warn("[site.js] Checkout form submission error:", err.message);
    }
  }

  function appendHiddenInput(form, name, value) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  function bindCheckoutRedirectPage() {
    const manualLink = document.getElementById("manual-checkout-link");
    if (!manualLink) return;

    const checkoutUrl = getStoredCheckoutUrl();
    if (!checkoutUrl) {
      const errorEl = document.getElementById("checkout-error");
      if (errorEl) {
        errorEl.textContent = "We couldn't prepare your checkout automatically. Please go back and try again, or contact support if the issue continues.";
        errorEl.classList.remove("hidden");
      }
      manualLink.textContent = "Return to Access Form";
      manualLink.href = "request-access";
      return;
    }

    manualLink.href = checkoutUrl;

    window.setTimeout(function () {
      manualLink.click();
    }, 150);
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

  // ── Request-access form (Formspree + Lemon Squeezy) ───────────
  function bindRequestForm() {
    const form = document.getElementById("request-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const submitBtn = form.querySelector('[type="submit"]');
      const data = getFormData(form);

      if (!validateForm(data)) return;

      setButtonLoading(submitBtn, true);

      // Store lead details before redirect so the thank-you page can reuse them.
      storeEmail(data.email);
      storeLead(data);

      // Fire the lead capture in the background. Checkout should never wait on this.
      submitToFormspreeInBackground(data);

      showFormSuccess("Details saved. Redirecting to secure checkout…");
      redirectToCheckoutPage(data);
    });
  }

  function submitToFormspreeInBackground(data) {
    const endpoint = SITE_CONFIG?.formspreeEndpoint;
    if (!endpoint) {
      console.info("[site.js] Formspree endpoint not configured — skipping form submission.");
      return;
    }

    const payload = JSON.stringify({
      name: data.name,
      email: data.email,
      organization: data.organization,
      role: data.role,
      challenge: data.challenge,
      product: SITE_CONFIG.productName,
      source: window.location.href,
    });

    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon(endpoint, blob);
        return;
      }
    } catch (err) {
      console.warn("[site.js] Formspree sendBeacon error:", err.message);
    }

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: payload,
      keepalive: true,
    }).catch((err) => {
      console.warn("[site.js] Formspree background error:", err.message);
    });
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
  function getStoredCheckoutUrl() {
    try { return sessionStorage.getItem("fiv_checkout_url"); } catch (_) { return null; }
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
