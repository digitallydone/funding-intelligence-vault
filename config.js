/**
 * BOSs | Business Opportunity Systems
 * Funding Intelligence Vault — Site Configuration
 *
 * Fill in your values below. Buttons linked to empty values
 * will be automatically hidden or shown as "Coming Soon."
 */
const SITE_CONFIG = {
  // Branding
  brandName: "BOSs | Business Opportunity Systems",
  productName: "Funding Intelligence Vault",
  tagline: "Find more grant opportunities without spending hours searching.",

  // Pricing
  priceLabel: "$49 USD",
  earlyAccessLabel: "Early Access — $49",

  // Paystack Payment
  paystackPublicKey: "pk_live_9f246a1b01ecb07adc6f28865484fb76d6161b5d",
  paystackCurrency: "USD",
  paystackAmount: 4900, // in subunits (cents) — 4900 = $49.00
  paystackFallbackMessage:
    "Online payment is temporarily unavailable. Please email us at subscribe@itsdigitally.com to complete your purchase manually.",

  // Form submission (Formspree)
  formspreeEndpoint: "https://formspree.io/f/xaqagedq",

  // Product delivery links
  softrAppUrl: "",          // Softr web app URL — PRIMARY delivery (e.g. "https://vault.itsdigitally.com")
  sheetsTemplateUrl: "",    // Google Sheets copy-template link — backup option
  airtableTemplateUrl: "",  // Airtable template link — white-glove option
  csvDownloadUrl: "funding-intelligence-vault-template.csv",

  // Support
  supportEmail: "subscribe@itsdigitally.com",

  // Social / brand
  siteUrl: "", // e.g. "https://vault.itsdigitally.com"
};

// Freeze to prevent accidental mutation
Object.freeze(SITE_CONFIG);
