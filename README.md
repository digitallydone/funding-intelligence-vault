# Funding Intelligence Vault
**BOSs | Business Opportunity Systems**

A premium static website for the Funding Intelligence Vault — a ready-to-use grant research workspace for Canadian nonprofits, NGOs, social enterprises, and grant writers.

---

## Quick Start

### Local development

No build step required. Open any `.html` file directly in a browser, or serve with any static server:

```bash
# Python (built-in)
python3 -m http.server 3000

# Node (npx)
npx serve .

# VS Code: use the Live Server extension
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

---

## Configuration

Before going live, fill in `config.js`:

```javascript
const SITE_CONFIG = {
  paystackPublicKey: "pk_live_xxxxxxxxxxxx",   // Your Paystack public key
  paystackCurrency: "USD",                      // USD or GHS/NGN if USD not enabled
  paystackAmount: 4900,                         // In subunits (4900 = $49.00)
  formspreeEndpoint: "https://formspree.io/f/yourformid",
  sheetsTemplateUrl: "https://docs.google.com/spreadsheets/d/...",
  airtableTemplateUrl: "",                      // Leave empty until ready
  supportEmail: "subscribe@itsdigitally.com",
};
```

**Buttons linked to empty config values are automatically hidden** — no broken links.

---

## File Structure

```
funding-intelligence-vault/
├── index.html                          Landing page
├── request-access.html                 Buyer form + Paystack checkout
├── thank-you.html                      Post-payment confirmation
├── customer-start.html                 Customer onboarding / workspace access
├── guide.html                          Free guide overview
├── guide-full.html                     Full free guide (5 chapters)
├── config.js                           Site configuration (fill in before launch)
├── assets/
│   ├── style.css                       Full design system
│   └── site.js                         Payment, form, and UI logic
├── docs/
│   ├── customer-delivery-pack.md       Delivery checklist and email templates
│   ├── customer-onboarding-playbook.md Customer-facing onboarding guide
│   ├── product-delivery-notes.md       Internal product specs and SLAs
│   ├── outreach-kickoff-pack.md        Launch messaging and email templates
│   ├── airtable-base-spec.md           Airtable white-glove setup spec
│   └── sheets-template-setup.md       Google Sheets template creation guide
├── funding-intelligence-vault-template.csv   75 funding opportunities (17 columns)
├── vercel.json                         Vercel deployment config
├── .gitignore
└── README.md
```

---

## Payment Flow

1. Customer fills in `request-access.html` form
2. Form data submits to **Formspree** (lead capture)
3. **Paystack** checkout opens in a modal
4. On success → redirect to `thank-you.html?ref=TRANSACTION_REF&status=paid`
5. Customer navigates to `customer-start.html` for workspace access

**Paystack fallback:** If `paystackPublicKey` is empty, a friendly message is shown instead of a broken checkout. Set `paystackFallbackMessage` in `config.js` to customize it.

---

## Integrations

| Service | Purpose | Setup |
|---|---|---|
| **Paystack** | Payment processing | Add public key to `config.js` |
| **Formspree** | Lead capture / form submission | Create form at formspree.io, add endpoint to `config.js` |
| **Softr** | Primary web app delivery | Build app per `docs/softr-app-spec.md`, add URL to `config.js` → `softrAppUrl` |
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
- [ ] Test Paystack checkout with a test key
- [ ] Verify redirect to `thank-you.html` after payment

### Site
- [ ] Verify `customer-start.html` shows Softr app link correctly
- [ ] Test CSV download
- [ ] Check all internal links across all pages
- [ ] Deploy to Vercel
- [ ] Test on mobile

### Buyer experience
- [ ] Set up welcome email with Softr magic link (see `docs/customer-delivery-pack.md`)
- [ ] Test full buyer flow: form → payment → thank-you → workspace → Softr login

---

## Support

subscribe@itsdigitally.com

---

## License

Private — not for redistribution.
