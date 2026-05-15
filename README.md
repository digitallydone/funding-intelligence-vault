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
4. Lemon Squeezy sends an `order_created` webhook to `/api/lemonsqueezy-webhook`.
5. The webhook provisions the buyer in **Softr** and can optionally send a custom post-purchase email.
6. After payment, Lemon Squeezy should send the customer to `thank-you.html` from your product confirmation button or receipt email.
7. Customer navigates to `customer-start.html` for workspace access.

**Checkout fallback:** If `lemonSqueezyCheckoutUrl` is empty or invalid, the site shows the fallback message from `config.js` instead of sending buyers to a broken checkout.

---

## Integrations

| Service | Purpose | Setup |
|---|---|---|
| **Lemon Squeezy** | Payment processing | Add your shareable checkout URL to `config.js` |
| **Formspree** | Lead capture / form submission | Create form at formspree.io, add endpoint to `config.js` |
| **Vercel Functions** | Paid-order webhook | Deploy `/api/lemonsqueezy-webhook` and add env vars |
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
- [ ] Add Vercel env vars: `LEMON_SQUEEZY_WEBHOOK_SECRET`, `SOFTR_API_KEY`, `SOFTR_DOMAIN`
- [ ] Optional email env vars: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `SITE_URL`, `SOFTR_LOGIN_URL`
- [ ] In Lemon Squeezy, create a webhook for `order_created` pointing to `https://funding-intelligence-vault.vercel.app/api/lemonsqueezy-webhook`
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
- [ ] Verify that the webhook creates the Softr user and that the buyer can request a Softr login code with the same email used at checkout
- [ ] If using Resend, verify the custom post-purchase email arrives
- [ ] Test full buyer flow: form → checkout → thank-you → workspace → Softr login

---

## Webhook Setup

The repo includes a Vercel function at `api/lemonsqueezy-webhook.js`.

It does three things when Lemon Squeezy sends an `order_created` event:

1. Verifies the `X-Signature` header using `LEMON_SQUEEZY_WEBHOOK_SECRET`
2. Creates the buyer in Softr using `SOFTR_API_KEY` and `SOFTR_DOMAIN`
3. Optionally sends a custom buyer email through Resend if `RESEND_API_KEY` and `RESEND_FROM_EMAIL` are configured

### Required env vars

- `LEMON_SQUEEZY_WEBHOOK_SECRET`
- `SOFTR_API_KEY`
- `SOFTR_DOMAIN`

### Optional env vars

- `SOFTR_GENERATE_MAGIC_LINK=true`
- `SOFTR_SYNC_AFTER_PROVISION=false`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `POST_PURCHASE_EMAIL_SUBJECT`
- `SOFTR_LOGIN_URL`
- `SOFTR_APP_URL`
- `SITE_URL`

### Lemon Squeezy dashboard settings

- Webhook URL: `https://funding-intelligence-vault.vercel.app/api/lemonsqueezy-webhook`
- Event: `order_created`
- Receipt email button: your `thank-you` page
- Confirmation modal button: your `thank-you` page

Per Lemon Squeezy’s docs, the receipt email itself is sent by Lemon Squeezy. The webhook is what powers post-purchase provisioning in Softr.

---

## Support

subscribe@itsdigitally.com

---

## License

Private — not for redistribution.
