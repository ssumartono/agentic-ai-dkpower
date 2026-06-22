# API Specification
# DK Power Agentic Energy Business OS

## 1. Auth

### POST /auth/login

Request:
```json
{
  "email": "sales@dkpower.id",
  "password": "secret"
}
```

Response:
```json
{
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "role": "sales"
  }
}
```

## 2. Leads

### POST /leads

Creates a new lead.

### GET /leads

Query params:

- status
- source
- assigned_to
- date_from
- date_to

### PATCH /leads/{id}

Updates lead status or details.

## 3. Solar Calculation

### POST /solar/calculate

Request:
```json
{
  "monthly_bill": 3000000,
  "tariff_per_kwh": 1444,
  "city": "Palembang",
  "system_type": "on_grid"
}
```

Response:
```json
{
  "recommended_kwp": 7.2,
  "monthly_production_kwh": 720,
  "estimated_saving": 1039680,
  "payback_year_min": 5.5,
  "payback_year_max": 7.2
}
```

## 4. Proposals

### POST /proposals/generate

Request:
```json
{
  "opportunity_id": "uuid",
  "template": "commercial_solar_v1"
}
```

Response:
```json
{
  "proposal_id": "uuid",
  "status": "draft",
  "pdf_url": "https://storage/proposal.pdf"
}
```

## 5. AI Agents

### POST /agents/sales/qualify

### POST /agents/energy/recommend

### POST /agents/estimator/costing

### POST /agents/proposal/write

### POST /agents/technical/review
