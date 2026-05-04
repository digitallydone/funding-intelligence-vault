# Airtable Base Specification
**BOS | Business Opportunity Systems — Funding Intelligence Vault**
**White-Glove Setup Guide**

---

## Overview

This document specifies how to configure the Funding Intelligence Vault Airtable base for customers who request the white-glove Airtable setup. Follow this spec to deliver a consistent, high-quality Airtable experience.

---

## Base Setup

### Base name
`Funding Intelligence Vault — [Customer Org Name]`

### Table name
`Funding Opportunities`

---

## Field Configuration

Create the following fields in this order:

| # | Field Name | Field Type | Notes |
|---|---|---|---|
| 1 | Funder | Single line text | Primary field |
| 2 | Program | Single line text | |
| 3 | Country/Region | Single line text | |
| 4 | Province/State | Single select | See options below |
| 5 | Sector | Multiple select | See options below |
| 6 | Eligible Applicants | Long text | |
| 7 | Funding Type | Single select | See options below |
| 8 | Typical Amount | Single line text | Keep as text (ranges) |
| 9 | Deadline Type | Single select | See options below |
| 10 | Next Deadline | Single line text | Keep as text (approximate dates) |
| 11 | Match Required | Checkbox | |
| 12 | Website | URL | |
| 13 | Fit Score | Single select | High / Medium / Low |
| 14 | Difficulty | Single select | Low / Medium / High |
| 15 | Notes | Long text | |
| 16 | Status | Single select | See options below |
| 17 | Next Action | Long text | |
| 18 | Owner | Single line text | Customer-added; for team use |
| 19 | Last Updated | Date | For tracking data currency |

---

## Select Field Options

### Province/State
- National
- Ontario
- British Columbia
- Alberta
- Manitoba
- Quebec
- Nova Scotia
- Saskatchewan
- New Brunswick
- Newfoundland and Labrador
- Prince Edward Island
- Northwest Territories
- Nunavut
- Yukon
- Nunavik

### Sector
- Arts & Culture
- Community Development
- Environment / Climate
- Health
- Youth
- Education
- Indigenous Programming
- Social Innovation
- Women / Gender Equity
- Disability / Accessibility
- Sport / Recreation
- Seniors
- Economic Inclusion / Labour
- Poverty Reduction
- Capacity Building
- Research
- Career / Employment
- Multi-sector

### Funding Type
- Project
- Operating
- Capital
- Wage Subsidy
- Partnership
- Capacity Building
- Service Contract
- Strategic / Invitation
- Learning / Network

### Deadline Type
- Rolling
- Annual
- Bi-annual
- Invitation Only
- Letter of Inquiry (LOI)
- Negotiated

### Fit Score
- High
- Medium
- Low

**Color coding:**
- High → Green
- Medium → Yellow
- Low → Red

### Difficulty
- Low
- Medium
- High

**Color coding:**
- Low → Green
- Medium → Yellow
- High → Red

### Status
- Research
- Qualified
- Cultivating
- Applied
- Awarded
- Declined
- Not Eligible
- On Hold

**Color coding:**
- Research → Gray
- Qualified → Blue
- Cultivating → Purple
- Applied → Yellow
- Awarded → Green
- Declined → Red
- Not Eligible → Light gray
- On Hold → Orange

---

## Views to Configure

### 1. All Opportunities (Grid — default)
All records, all fields. Default sort: Fit Score (High first), then Difficulty (Low first).

### 2. High Fit Shortlist
**Filter:** Fit Score = High
**Sort:** Difficulty (Low → High), then Next Deadline
**Purpose:** Customer's starting point for active pursuit

### 3. By Sector
**Group by:** Sector
**Sort within group:** Fit Score (High first)
**Purpose:** Browse by mandate area

### 4. Active Pipeline
**Filter:** Status is one of: Qualified, Cultivating, Applied
**Sort:** Next Deadline
**Purpose:** Track in-progress opportunities

### 5. Awarded & Won
**Filter:** Status = Awarded
**Purpose:** Track funding secured

### 6. By Province
**Group by:** Province/State
**Sort within group:** Fit Score (High first)
**Purpose:** Geographic filtering

### 7. Rolling Deadlines
**Filter:** Deadline Type = Rolling
**Sort:** Fit Score (High first)
**Purpose:** Opportunities available anytime — good starting point for new orgs

---

## Data Import

1. Export `funding-intelligence-vault-template.csv` from the customer delivery pack
2. In Airtable: **+ Add or import → Import a spreadsheet → CSV**
3. Map columns to the fields configured above
4. For checkbox fields (Match Required): map "Yes" → checked, "No" → unchecked
5. Review and confirm import

After import:
- Verify all 75 records imported correctly
- Apply color coding to select fields
- Set up all views per the spec above
- Share the base with the customer's email (Editor access)

---

## Sharing the Base

1. Click **Share** in the top right of the base
2. Enter the customer's email address
3. Set permission to **Editor** (so they can add records and update status)
4. Include a note: "Here's your Funding Intelligence Vault Airtable base — set up and ready to use."
5. Send the share invitation

---

## Delivery Email (Airtable)

**Subject:** Your Funding Intelligence Vault — Airtable base is ready

Hi [Name],

Your Airtable base is configured and ready. You should have received a sharing invitation from Airtable — accept it to access your workspace.

**What's set up:**
- All 75 funding opportunities imported and organized
- Fit Score and Difficulty color-coded for quick scanning
- 7 views pre-built: All Opportunities, High Fit Shortlist, By Sector, Active Pipeline, Awarded & Won, By Province, Rolling Deadlines

**How to start:**
1. Accept the Airtable sharing invitation
2. Open the **High Fit Shortlist** view first
3. Click through the High-fit, Low-difficulty opportunities — these are your best starting points
4. Update the **Status** field as you research and apply

If you have any questions about the workspace, reply to this email.

— The BOS Team
