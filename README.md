# Funding Intelligence Vault

Static marketing and delivery site for **BOS | Business Opportunity Systems**.

---

## Configuration

Edit `config.js` with your live values:

```js
const SITE_CONFIG = {
  brandName: "BOS | Business Opportunity Systems",
  productName: "Funding Intelligence Vault",
  priceLabel: "$49 USD",
  earlyAccessLabel: "Early Access — $49",
  lemonSqueezyCheckoutUrl: "https://your-store.lemonsqueezy.com/checkout/buy/your-variant-id",
  lemonSqueezyFallbackMessage:
    "Checkout is temporarily unavailable. Please email us at subscribe@itsdigitally.com to complete your purchase manually.",
  formspreeEndpoint: "https://formspree.io/f/your-form-id",
  softrAppUrl: "https://funding-vault.softr.app",
  sheetsTemplateUrl: "https://docs.google.com/spreadsheets/d/.../copy",
  airtableTemplateUrl: "https://airtable.com/...",
  csvDownloadUrl: "funding-intelligence-vault-template.csv",
  supportEmail: "subscribe@itsdigitally.com",
  siteUrl: "https://funding-intelligence-vault.vercel.app"
};
```

Use the original Lemon Squeezy share URL that contains `/checkout/buy/`. Do not use the cart URL generated after someone opens checkout.

---

## Structure

```text
.
├── index.html                          Landing page
├── guide.html                          Free guide landing page
├── guide-full.html                     Full guide article page
├── request-access.html                 Buyer form + Lemon Squeezy handoff
├── thank-you.html                      Post-payment confirmation
├── customer-start.html                 Delivery / access page
├── config.js                           Site-wide configuration
├── assets/
│   ├── style.css                       Shared styling
│   ├── site.js                         Checkout, form, and UI logic
│   └── logos/                          Brand assets
├── docs/                               Internal operating notes
├── funding-intelligence-vault-template.csv
├── vercel.json
└── README.md
```

---

## Payment Flow

1. Customer fills in `request-access.html` form.
2. Form data submits to **Formspree** for lead capture.
3. Site redirects the buyer to the configured **Lemon Squeezy** checkout URL with name and email prefilled.
4. After payment, Lemon Squeezy should send the customer to `thank-you.html` from your product confirmation button or receipt email.
5. Customer navigates to `customer-start.html` for workspace access.

**Checkout fallback:** If `lemonSqueezyCheckoutUrl` is empty or invalid, the site shows the fallback message from `config.js` instead of sending buyers to a broken checkout.

---

## Integrations

| Service | Purpose | Setup |
|---|---|---|
| **Lemon Squeezy** | Payment processing | Add your shareable checkout URL to `config.js` |
| **Formspree** | Lead capture / form submission | Create form at formspree.io, add endpoint to `config.js` |
| **Softr** | Primary web app delivery | Build app per `docs/softr-app-spec.md`, add URL to `config.js` |
| **Airtable** | Softr data source + white-glove option | Build base per `docs/airtable-base-spec.md` |
| **Google Sheets** | Backup delivery format | Create template, set sharing to "anyone with link," add URL to `config.js` |
| **Vercel** | Hosting | Connect repo or run `vercel` |

---

## Launch Checklist

### Data & App
- [ ] Build Airtable base (see `docs/airtable-base-spec.md`)
- [ ] Build Softr web app connected to Airtable (see `docs/softr-app-spec.md`)
- [ ] Set Softr access control to magic-link login
- [ ] Test Softr app — search, filters, detail pages, pipeline updates
- [ ] Add `softrAppUrl` to `config.js`
- [ ] Create Google Sheets backup template (see `docs/sheets-template-setup.md`)
- [ ] Add `sheetsTemplateUrl` to `config.js`

### Payments & Forms
- [ ] Set up Formspree form and add endpoint to `config.js`
- [ ] Create Lemon Squeezy product / variant and copy the shareable `/checkout/buy/` URL
- [ ] Add `lemonSqueezyCheckoutUrl` to `config.js`
- [ ] In Lemon Squeezy, set the product confirmation button to `https://funding-intelligence-vault.vercel.app/thank-you.html?status=paid`
- [ ] In Lemon Squeezy, update the receipt button to your delivery or thank-you page
- [ ] Test the checkout and verify the thank-you flow

### Site
- [ ] Verify `customer-start.html` shows Softr app link correctly
- [ ] Test CSV download
- [ ] Check all internal links across all pages
- [ ] Deploy to Vercel
- [ ] Test on mobile

### Buyer experience
- [ ] Set up welcome email with Softr magic link (see `docs/customer-delivery-pack.md`)
- [ ] Test full buyer flow: form → checkout → thank-you → workspace → Softr login

---

## Support

subscribe@itsdigitally.com

---

## License

Private — not for redistribution.
