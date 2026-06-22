# QA Test Plan
# DK Power Agentic Energy Business OS

## 1. Test Objectives

Memastikan sistem aman, akurat, mudah dipakai, dan output AI tidak langsung menjadi keputusan final tanpa validasi.

## 2. Functional Testing

| Test ID | Scenario | Expected Result |
|---|---|---|
| QA-001 | Create lead from form | Lead appears in CRM |
| QA-002 | Change lead status | Status updated and logged |
| QA-003 | Generate solar calculation | Result includes kWp, saving, payback |
| QA-004 | Generate proposal | Draft proposal created |
| QA-005 | Engineer approves proposal | Status becomes approved |
| QA-006 | Export PDF | PDF generated correctly |

## 3. AI Testing

| Test ID | Scenario | Expected Result |
|---|---|---|
| AI-001 | Missing roof area | Agent flags missing data |
| AI-002 | Unrealistic monthly bill | Agent warns anomaly |
| AI-003 | Margin below threshold | Agent blocks approval |
| AI-004 | Customer asks final guarantee | Agent states estimate disclaimer |

## 4. Security Testing

- Sales cannot access admin settings.
- Customer cannot access internal notes.
- Proposal edits are logged.
- Deleted records are soft-deleted.

## 5. UAT Criteria

- Sales can create proposal without developer help.
- Engineer can approve/reject from dashboard.
- Owner can read pipeline dashboard.
- PDF output is acceptable for real customer trial.
