# boxfordCRM Integration Guide

How to integrate reviewSNIPER, Gravitas Index, and boxfordpartners.com with boxfordCRM.

---

## Authentication

All API requests require an API key in the header:

```
Authorization: Bearer YOUR_API_KEY
```

For now, API is unauthenticated for internal services. Add authentication middleware before public launch.

---

## 1. reviewSNIPER Integration

### When to Send Leads

After a user submits the lead form on reviewSNIPER, POST the lead to boxfordCRM.

### Implementation

**In reviewSNIPER `/api/submit-lead/route.ts`:**

```typescript
// After saving to Supabase, send to boxfordCRM
const boxfordCrmResponse = await fetch('https://crm.boxfordpartners.com/api/leads', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    source: 'reviewsniper',
    workspace_id: getWorkspaceId('Real Estate'), // Or get from user config
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    market: formData.market,
    pain_points: formData.painPoints,
    role: formData.role,
  }),
})

const result = await boxfordCrmResponse.json()
console.log('Created contact in boxfordCRM:', result.contact.id)
```

### Workspace Mapping

You'll need to determine which boxfordCRM workspace to add leads to. Options:

**Option 1: Hard-code for Patrick**
```typescript
const BOXFORD_CRM_WORKSPACE_ID = 'uuid-of-real-estate-workspace'
```

**Option 2: User configuration**
```typescript
// Let users configure their boxfordCRM workspace ID in settings
const workspaceId = user.settings.boxford_crm_workspace_id
```

---

## 2. Gravitas Index Integration

### When to Send Inquiries

After Gravitas classifies an inquiry, POST it to boxfordCRM inbox.

### Implementation

**In Gravitas Index classification endpoint:**

```typescript
// After classification is complete
const classification = await classifyInquiry(inquiry)

// Send to boxfordCRM
await fetch('https://crm.boxfordpartners.com/api/inbox', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    workspace_id: inquiry.workspace_id, // From Gravitas user config
    from: inquiry.from_email,
    subject: inquiry.subject,
    preview: inquiry.body.substring(0, 200),
    classification: classification.type, // 'opportunity', 'risk', 'noise', or 'reputation'
    recommended_action: classification.recommended_action,
    contact_info: classification.type === 'opportunity' ? {
      name: inquiry.from_name,
      email: inquiry.from_email,
      phone: inquiry.phone,
      trust_signals: classification.trust_signals,
    } : undefined,
  }),
})
```

### Auto-Contact Creation

If `classification === 'opportunity'` and `contact_info` is provided, boxfordCRM will:
1. Create/update the contact
2. Add activity to timeline
3. Create pipeline item in "new" stage
4. Set next action with due date

---

## 3. boxfordpartners.com Integration

### When to Send Leads

After someone submits the contact form on boxfordpartners.com.

### Implementation

**In boxfordpartners.com contact form handler:**

```typescript
// After form submission
await fetch('https://crm.boxfordpartners.com/api/leads', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    source: 'boxford',
    workspace_id: 'uuid-of-consulting-workspace', // Consulting workspace
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    pain_points: formData.message,
    industry: formData.industry,
  }),
})
```

---

## 4. Getting Workspace IDs

### Option 1: Hard-code Patrick's Workspaces

After deployment, get workspace IDs from Neon database:

```sql
SELECT id, name, type FROM workspaces WHERE owner_id = 'patrick-clerk-user-id';
```

Then hard-code in each service:

```typescript
const WORKSPACE_IDS = {
  REAL_ESTATE: 'uuid-here',
  CONSULTING: 'uuid-here',
  PRODUCT: 'uuid-here',
}
```

### Option 2: API Lookup

```typescript
const response = await fetch('https://crm.boxfordpartners.com/api/workspaces?user_id=clerk-user-id')
const { workspaces } = await response.json()

const realEstateWorkspace = workspaces.find(w => w.type === 'Real Estate')
```

---

## API Reference

### POST /api/leads

Create a new contact from lead form.

**Request:**
```json
{
  "source": "reviewsniper",
  "workspace_id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1 (555) 123-4567",
  "market": "Austin, TX",
  "pain_points": "Need better review management",
  "role": "Real Estate Agent"
}
```

**Response:**
```json
{
  "success": true,
  "contact": {
    "id": "uuid",
    "name": "John Doe",
    "credibility_score": 70,
    ...
  },
  "message": "Lead created successfully"
}
```

**Credibility Scoring:**
- Base: 50
- reviewSNIPER source: +10
- Boxford source: +20
- Gravitas opportunity: +25
- Phone provided: +5
- Market provided: +5
- Pain points provided: +5
- Each trust signal: +5

High credibility leads (≥70) auto-create pipeline items.

---

### POST /api/inbox

Create inbox item from Gravitas classification.

**Request:**
```json
{
  "workspace_id": "uuid",
  "from": "prospect@example.com",
  "subject": "Interested in your services",
  "preview": "I saw your website and...",
  "classification": "opportunity",
  "recommended_action": "Reach out within 24 hours",
  "contact_info": {
    "name": "Jane Smith",
    "email": "prospect@example.com",
    "phone": "+1 (555) 987-6543",
    "trust_signals": ["Verified email", "LinkedIn profile found"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "inbox_item": { ... },
  "contact_created": true,
  "contact_id": "uuid",
  "message": "Inbox item created with new contact and pipeline item"
}
```

---

### GET /api/inbox

Retrieve inbox items.

**Query params:**
- `workspace_id` (required): UUID of workspace
- `handled` (optional): `true`, `false`, or omit for all

**Example:**
```
GET /api/inbox?workspace_id=uuid&handled=false
```

---

### PATCH /api/inbox

Mark inbox item as handled.

**Request:**
```json
{
  "id": "uuid",
  "handled": true
}
```

---

## Testing

### Test Lead Creation

```bash
curl -X POST https://crm.boxfordpartners.com/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "source": "reviewsniper",
    "workspace_id": "your-workspace-id",
    "name": "Test Lead",
    "email": "test@example.com",
    "phone": "+1 (555) 123-4567",
    "market": "Austin, TX"
  }'
```

### Test Inbox Creation

```bash
curl -X POST https://crm.boxfordpartners.com/api/inbox \
  -H "Content-Type: application/json" \
  -d '{
    "workspace_id": "your-workspace-id",
    "from": "prospect@example.com",
    "subject": "Test Inquiry",
    "classification": "opportunity",
    "contact_info": {
      "name": "Test Prospect",
      "email": "prospect@example.com"
    }
  }'
```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Description of error",
  "details": "Additional context"
}
```

**Common HTTP status codes:**
- `200`: Success
- `400`: Bad request (missing/invalid fields)
- `404`: Resource not found
- `500`: Server error

---

## Next Steps

1. **Get workspace IDs** from Neon after deployment
2. **Update reviewSNIPER** to POST leads to boxfordCRM
3. **Update Gravitas** to POST classified inquiries to boxfordCRM
4. **Update boxfordpartners.com** contact form to POST to boxfordCRM
5. **Test end-to-end** with real lead submissions
6. **Monitor** Neon database to see leads flowing in

---

## Webhook Alternative (Future)

For better decoupling, consider webhooks:
- Each service registers a webhook URL
- boxfordCRM POSTs events to registered webhooks
- Services can react to events (contact created, deal closed, etc.)

For now, direct API calls are simpler.
