# boxfordCRM API Quick Reference

## Base URL
```
https://crm.boxfordpartners.com/api
```

---

## Lead Creation

**Endpoint:** `POST /api/leads`

**Use for:** reviewSNIPER leads, boxfordpartners.com contact form

```javascript
{
  source: 'reviewsniper' | 'boxford',
  workspace_id: 'uuid',        // Required
  name: 'John Doe',            // Required
  email: 'john@example.com',   // Required
  phone: '+1 (555) 123-4567',  // Optional
  market: 'Austin, TX',        // Optional
  pain_points: 'text',         // Optional
  role: 'Real Estate Agent'    // Optional
}
```

**Result:** Creates contact, calculates credibility score, auto-creates pipeline item if score ≥ 70

---

## Inbox Item Creation

**Endpoint:** `POST /api/inbox`

**Use for:** Gravitas Index classified inquiries

```javascript
{
  workspace_id: 'uuid',        // Required
  from: 'email@example.com',   // Required
  subject: 'Inquiry subject',  // Required
  classification: 'opportunity', // Required: opportunity|risk|noise|reputation
  preview: 'text preview',     // Optional
  recommended_action: 'text',  // Optional
  contact_info: {              // Optional - auto-creates contact if opportunity
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 (555) 987-6543',
    trust_signals: ['array']
  }
}
```

**Result:** Creates inbox item. If classification=opportunity + contact_info provided → auto-creates contact + pipeline item

---

## Get Inbox Items

**Endpoint:** `GET /api/inbox?workspace_id={id}&handled={true|false}`

**Returns:** Array of inbox items

---

## Update Inbox Item

**Endpoint:** `PATCH /api/inbox`

```javascript
{
  id: 'uuid',
  handled: true
}
```

---

## Get Workspaces

**Endpoint:** `GET /api/workspaces?user_id={clerk_user_id}`

**Returns:** Array of user's workspaces

---

## Create Workspace

**Endpoint:** `POST /api/workspaces`

```javascript
{
  user_id: 'clerk_user_id',
  name: 'My Workspace',
  type: 'Real Estate' | 'Consulting' | 'Product' | 'Other',
  color: '#3b82f6'  // Optional
}
```

---

## Credibility Score Calculation

| Factor | Points |
|--------|--------|
| Base score | 50 |
| reviewSNIPER source | +10 |
| Boxford source | +20 |
| Gravitas opportunity | +25 |
| Gravitas reputation | +15 |
| Gravitas risk | -10 |
| Phone provided | +5 |
| Market provided | +5 |
| Pain points provided | +5 |
| Each trust signal | +5 |

**Max score:** 100

**Auto-pipeline threshold:** ≥ 70

---

## Integration Checklist

### reviewSNIPER
- [ ] Get workspace ID for Real Estate
- [ ] Add POST to `/api/leads` in form submission handler
- [ ] Test with real lead submission

### Gravitas Index
- [ ] Get workspace IDs (multiple)
- [ ] Add POST to `/api/inbox` after classification
- [ ] Include contact_info for opportunities
- [ ] Test with classified inquiries

### boxfordpartners.com
- [ ] Get workspace ID for Consulting
- [ ] Add POST to `/api/leads` in contact form handler
- [ ] Test with contact form submission

---

## Testing Examples

### Test reviewSNIPER lead:
```bash
curl -X POST https://crm.boxfordpartners.com/api/leads \
  -H "Content-Type: application/json" \
  -d '{"source":"reviewsniper","workspace_id":"UUID","name":"Test","email":"test@example.com"}'
```

### Test Gravitas opportunity:
```bash
curl -X POST https://crm.boxfordpartners.com/api/inbox \
  -H "Content-Type: application/json" \
  -d '{"workspace_id":"UUID","from":"test@example.com","subject":"Inquiry","classification":"opportunity","contact_info":{"name":"Test","email":"test@example.com"}}'
```

---

## Where to Get Workspace IDs

After deployment, query Neon:

```sql
SELECT id, name, type FROM workspaces
WHERE owner_id = 'your-clerk-user-id';
```

Or via API:
```bash
curl https://crm.boxfordpartners.com/api/workspaces?user_id=YOUR_CLERK_USER_ID
```
