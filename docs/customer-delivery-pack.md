# Customer Delivery Pack
**BOS | Business Opportunity Systems — Funding Intelligence Vault**

---

## What This Document Is

This is your internal checklist for delivering the Funding Intelligence Vault to every paying customer. Use it to ensure every buyer receives a consistent, high-quality experience from payment confirmation to workspace access.

---

## Delivery Checklist

### Immediately after payment (automated via thank-you.html)
- [ ] Customer lands on `thank-you.html` with transaction reference
- [ ] Customer can navigate directly to `customer-start.html`
- [ ] Google Sheets workspace link is accessible via `customer-start.html`
- [ ] CSV download is accessible via `customer-start.html`
- [ ] Free guide is accessible via `guide-full.html`

### Within 2–4 hours of payment (manual or automated email)
- [ ] Welcome email sent to customer's address
- [ ] Email includes: workspace link, onboarding instructions, support contact
- [ ] Email includes: free guide link
- [ ] Email BCC'd to your records for tracking

### Within 24 hours (follow-up check)
- [ ] Verify customer opened the workspace (check Google Sheets sharing analytics if available)
- [ ] Flag any bounced emails or undelivered messages
- [ ] Respond to any support requests from the customer

---

## Welcome Email Template

**Subject:** Your Funding Intelligence Vault is ready — here's how to access it

---

Hi [First Name],

Your early access to the **Funding Intelligence Vault** is confirmed. Here's everything you need to get started.

**Your workspace link:**
[INSERT GOOGLE SHEETS LINK]

To save the workspace to your own Google Drive:
1. Open the link above
2. Click **File → Make a copy**
3. Save it to your Drive — it's now fully yours

**Your CSV backup:**
[INSERT CSV DOWNLOAD LINK]

**Free guide — The Canadian Funding Landscape: Where to Start:**
[INSERT GUIDE LINK]

**If you prefer Airtable:** reply to this email with "Airtable setup" and we'll configure your base directly.

---

If you have any questions or run into any issues, reply to this email or write to subscribe@itsdigitally.com.

Welcome to the Vault.

— The BOS Team
BOS | Business Opportunity Systems

---

## Delivery Assets

| Asset | Location | Notes |
|---|---|---|
| Google Sheets workspace | [Add link in config.js] | Shared as "anyone with link can view" |
| CSV file | `funding-intelligence-vault-template.csv` | Available at root of site |
| Free guide | `guide-full.html` | Publicly accessible |
| Customer onboarding | `customer-start.html` | Protected by obscurity (no login in v1) |

---

## Airtable White-Glove Requests

When a customer requests Airtable setup:

1. Reply acknowledging their request within 24 hours
2. Ask for their Airtable account email address
3. Import the CSV into a new Airtable base using the spec in `airtable-base-spec.md`
4. Set up recommended views (see spec)
5. Share the base with the customer's email (Editor access)
6. Send confirmation email with setup notes

Typical turnaround: 2–3 business days.

---

## Quality Standards

Every customer should feel:
- **Confident** — they know exactly what they received and how to use it
- **Supported** — they have a clear path to help if needed
- **Valued** — the experience matches the premium positioning of the product

If anything in the delivery feels rough or unclear, flag it for improvement before the next customer.
