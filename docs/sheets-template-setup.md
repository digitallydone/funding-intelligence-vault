# Google Sheets Template Setup Guide
**BOS | Business Opportunity Systems — Funding Intelligence Vault**

---

## Overview

This document explains how to create, configure, and publish the Google Sheets copy-template that customers receive when they purchase the Funding Intelligence Vault. Follow this guide each time you need to update or republish the template.

---

## Creating the Master Template

### Step 1: Create a new Google Sheet

1. Open Google Drive and create a new spreadsheet
2. Name it: `Funding Intelligence Vault — Template (Master)`
3. Do not store this in a shared team folder — keep it in your personal Drive or a dedicated "Products" folder

### Step 2: Import the CSV data

1. In the new sheet, go to **File → Import**
2. Select **Upload** and choose `funding-intelligence-vault-template.csv`
3. Import settings:
   - Import location: Replace current sheet
   - Separator type: Comma
   - Convert text to numbers: No (important — keeps amounts as text)
4. Click **Import data**

### Step 3: Configure the header row

1. Select Row 1 (the header row)
2. Apply formatting:
   - Background color: `#0F172A` (dark navy)
   - Text color: White
   - Font weight: Bold
   - Font size: 10
3. Freeze Row 1: **View → Freeze → 1 row**

### Step 4: Column widths

Set approximate column widths for readability:

| Column | Suggested width |
|---|---|
| Funder | 200px |
| Program | 220px |
| Country/Region | 120px |
| Province/State | 140px |
| Sector | 160px |
| Eligible Applicants | 220px |
| Funding Type | 120px |
| Typical Amount | 130px |
| Deadline Type | 120px |
| Next Deadline | 130px |
| Match Required | 120px |
| Website | 200px |
| Fit Score | 90px |
| Difficulty | 90px |
| Notes | 280px |
| Status | 120px |
| Next Action | 220px |

### Step 5: Apply conditional formatting

**Fit Score column (Column M):**
1. Select the Fit Score column (excluding header)
2. Format → Conditional formatting
3. Add rules:
   - Text is exactly "High" → Background: `#DCFCE7`, Text: `#166534`
   - Text is exactly "Medium" → Background: `#FEF9C3`, Text: `#854D0E`
   - Text is exactly "Low" → Background: `#FEE2E2`, Text: `#991B1B`

**Difficulty column (Column N):**
1. Select the Difficulty column (excluding header)
2. Apply same conditional formatting (Low = green, Medium = yellow, High = red)

**Status column (Column P):**
1. Select the Status column (excluding header)
2. Apply rules:
   - "Awarded" → Green background
   - "Applied" → Blue background (`#DBEAFE`, `#1E40AF`)
   - "Not Eligible" → Light gray background
   - "Qualified" → Purple background (`#EDE9FE`, `#5B21B6`)

### Step 6: Add data validation for Status column

1. Select the Status column (excluding header)
2. Data → Data validation
3. Criteria: List of items
4. Items: `Research,Qualified,Cultivating,Applied,Awarded,Declined,Not Eligible,On Hold`
5. Show dropdown list in cell: Yes

### Step 7: Enable filters

1. Select Row 1
2. Data → Create a filter
3. This allows customers to filter by any column immediately after copying

### Step 8: Add a "Read Me" tab

1. At the bottom, click `+` to add a new sheet
2. Name it `📋 Read Me`
3. Move it to the left of the data tab
4. Add the following content:

```
FUNDING INTELLIGENCE VAULT
BOS | Business Opportunity Systems

Welcome to your workspace.

HOW TO USE THIS WORKSPACE
1. Use the filters in Row 1 to narrow opportunities by sector, province, fit score, or deadline type
2. Sort by Fit Score (High first) then Difficulty (Low first) to find your best starting points
3. Update the STATUS column as you research, apply, and track outcomes
4. Update NEXT ACTION with your specific task for each opportunity

COLUMNS EXPLAINED
• Funder / Program — The organization and specific grant program
• Province/State — Geographic scope (National = open to all provinces)
• Sector — Primary focus area
• Eligible Applicants — Who can apply
• Funding Type — Project, Operating, Capital, Wage Subsidy, etc.
• Typical Amount — Expected funding range
• Deadline Type — Rolling / Annual / LOI / Invitation
• Next Deadline — Approximate — always verify on funder website
• Match Required — Whether you need matching funds
• Website — Direct link to program page
• Fit Score — High/Medium/Low — our pre-assessment for a typical nonprofit
• Difficulty — Low/Medium/High — application complexity
• Notes — Key context and strategic notes
• Status — Your tracking field
• Next Action — What to do next

STATUS VALUES
Research → Qualified → Cultivating → Applied → Awarded / Declined

IMPORTANT
Funding programs change. Always verify deadlines, amounts, and eligibility
on the funder's own website before investing time in an application.

Questions? subscribe@itsdigitally.com
```

### Step 9: Protect the Read Me tab

1. Right-click the `📋 Read Me` tab
2. Select "Protect sheet"
3. Allow editing only for yourself (the template owner)
4. This prevents customers from accidentally deleting the instructions

---

## Publishing the Template

### Step 1: Set sharing permissions

1. Click **Share** in the top right
2. Under "General access," select **Anyone with the link**
3. Set role to **Viewer** (important — customers should not edit the master)
4. Click **Copy link**

### Step 2: Update config.js

Paste the copied link into `config.js`:
```javascript
sheetsTemplateUrl: "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit?usp=sharing",
```

### Step 3: Test the customer experience

1. Open the link in an incognito browser window
2. Verify it opens as a Viewer (no edit access)
3. Click File → Make a copy
4. Confirm the copy creates successfully in your Drive
5. Verify all formatting, filters, and conditional formatting copy correctly

---

## Updating the Template

When the dataset needs updating:

1. Open the master template
2. Make changes directly to the data (do not re-import unless doing a full refresh)
3. For full refresh: delete all data rows, re-import CSV, reapply formatting
4. The sharing link remains the same — no need to update config.js

Keep a changelog in a separate private document noting what was updated and when.

---

## Version History

| Version | Date | Changes |
|---|---|---|
| 1.0 | Launch | Initial 75-funder dataset |
