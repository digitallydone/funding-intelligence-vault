/**
 * BOS | Business Opportunity Systems
 * Funding Intelligence Vault — Site Configuration
 *
 * Fill in your values below. Buttons linked to empty values
 * will be automatically hidden or shown as "Coming Soon."
 */
const SITE_CONFIG = {
  // Branding
  brandName: "BOS | Business Opportunity Systems",
  productName: "Funding Intelligence Vault",
  tagline: "Find more grant opportunities without spending hours searching.",

  // Pricing
  priceLabel: "$49 USD",
  earlyAccessLabel: "Early Access — $49",

  // Lemon Squeezy checkout
  lemonSqueezyCheckoutUrl: "https://digitallydone.lemonsqueezy.com/checkout/buy/7c476d98-20c2-472f-ac70-229aa1222764",
  lemonSqueezyFallbackMessage:
    "Checkout is temporarily unavailable. Please email us at subscribe@itsdigitally.com to complete your purchase manually.",

  // Form submission (Formspree)
  formspreeEndpoint: "https://formspree.io/f/xaqagedq",

  // Product delivery links
  softrAppUrl: "https://funding-vault.softr.app",          // Softr web app URL — PRIMARY delivery
  sheetsTemplateUrl: "https://docs.google.com/spreadsheets/d/18Jhi4D0HyMQpcVPc84KzbGtNx2rpFx2FFnY999Ui7z4/copy",    // Google Sheets copy-template link — backup option
  airtableTemplateUrl: "https://airtable.com/appAQQXCDQaXUEsJZ/tblh8VpJvJVRvCImn/viwAck01mBc65LxH8",
  csvDownloadUrl: "funding-intelligence-vault-template.csv",

  // Support
  supportEmail: "subscribe@itsdigitally.com",

  // Social / brand
  siteUrl: "", // e.g. "https://vault.itsdigitally.com"
};

// Freeze to prevent accidental mutation
Object.freeze(SITE_CONFIG);
