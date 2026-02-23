import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// POST /api/leads - Receives leads from reviewSNIPER, boxfordpartners.com, URLA form, etc.
// PATCH /api/leads - Updates existing contact with loan application details
export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key");
  if (apiKey !== process.env.INTEGRATION_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json()

    // Validate required fields
    const { source, workspace_id, name, email, phone, market, pain_points } = body

    if (!source || !workspace_id || !name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: source, workspace_id, name, email' },
        { status: 400 }
      )
    }

    // Calculate initial credibility score based on source
    const credibilityScore = calculateInitialCredibility(source, body)

    // Build trust signals based on source and data
    const trustSignals = buildTrustSignals(source, body)

    // Determine status based on source
    const status = source === 'gravitas' && body.classification === 'opportunity' ? 'lead' : 'lead'

    // Create contact
    const contact = await sql`
      INSERT INTO contacts (
        workspace_id,
        name,
        email,
        phone,
        tags,
        status,
        source,
        trust_signals,
        next_action,
        next_action_date,
        last_activity,
        credibility_score
      )
      VALUES (
        ${workspace_id},
        ${name},
        ${email},
        ${phone || ''},
        ${buildTags(source, body)},
        ${status},
        ${formatSource(source, body)},
        ${trustSignals},
        ${buildNextAction(source, body)},
        ${calculateNextActionDate()},
        ${new Date().toISOString().split('T')[0]},
        ${credibilityScore}
      )
      RETURNING *
    `

    const contactId = contact[0].id

    // Create initial activity
    await sql`
      INSERT INTO activities (
        contact_id,
        type,
        description,
        date
      )
      VALUES (
        ${contactId},
        ${source === 'gravitas' ? 'gravitas' : 'note'},
        ${buildInitialActivity(source, body)},
        ${new Date().toISOString().split('T')[0]}
      )
    `

    // If high credibility opportunity, auto-create pipeline item
    if (credibilityScore >= 70 || (body.classification === 'opportunity' && source === 'gravitas')) {
      await sql`
        INSERT INTO pipeline_items (
          workspace_id,
          contact_id,
          stage,
          last_touch,
          next_action
        )
        VALUES (
          ${workspace_id},
          ${contactId},
          'new',
          ${new Date().toISOString().split('T')[0]},
          ${buildNextAction(source, body)}
        )
      `
    }

    return NextResponse.json({
      success: true,
      contact: contact[0],
      message: 'Lead created successfully'
    })

  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      { error: 'Failed to create lead', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Helper functions

function calculateInitialCredibility(source: string, data: any): number {
  let score = 50 // Base score

  // Source-based scoring
  if (source === 'reviewsniper') {
    score += 10 // Engaged enough to request reviews
  } else if (source === 'boxford') {
    score += 20 // Direct inquiry to main site
  } else if (source === 'urla-form') {
    score += 15 // Mortgage application submission
  } else if (source === 'mailboxford') {
    score += 15 // Real email contact
  } else if (source === 'gravitas') {
    if (data.classification === 'opportunity') score += 25
    else if (data.classification === 'reputation') score += 15
    else if (data.classification === 'risk') score -= 10
  }

  // Data completeness bonus
  if (data.phone) score += 5
  if (data.market) score += 5
  if (data.pain_points) score += 5
  if (data.role) score += 5

  // Gravitas-specific signals
  if (data.trust_signals && data.trust_signals.length > 0) {
    score += data.trust_signals.length * 5
  }

  return Math.min(Math.max(score, 0), 100) // Clamp between 0-100
}

function buildTrustSignals(source: string, data: any): string[] {
  const signals: string[] = []

  if (source === 'reviewsniper') {
    signals.push('reviewSNIPER inquiry')
  } else if (source === 'urla-form') {
    signals.push('URLA loan application submitted')
    if (data.pain_points) signals.push(`Loan: ${data.pain_points}`)
  } else if (source === 'boxford') {
    signals.push('Direct website inquiry')
  } else if (source === 'gravitas') {
    signals.push('Gravitas classified inquiry')
    if (data.trust_signals) {
      signals.push(...data.trust_signals)
    }
  }

  if (data.phone) signals.push('Phone provided')
  if (data.market) signals.push(`Market: ${data.market}`)

  return signals
}

function buildTags(source: string, data: any): string[] {
  const tags: string[] = []

  if (source === 'reviewsniper') tags.push('reviewsniper-lead')
  if (source === 'urla-form') tags.push('mortgage-application')
  if (source === 'gravitas') tags.push('gravitas-lead')
  if (source === 'boxford') tags.push('website-inquiry')

  if (data.role) tags.push(data.role)
  if (data.industry) tags.push(data.industry)
  if (data.classification) tags.push(data.classification)

  return tags
}

function formatSource(source: string, data: any): string {
  if (source === 'reviewsniper') return 'reviewSNIPER Lead Form'
  if (source === 'urla-form') return 'URLA Loan Application'
  if (source === 'boxford') return 'boxfordpartners.com Contact Form'
  if (source === 'mailboxford') return 'mailBOXFORD Email'
  if (source === 'gravitas') {
    return `Gravitas Index (${data.classification || 'inquiry'})`
  }
  return 'Unknown source'
}

function buildNextAction(source: string, data: any): string {
  if (source === 'reviewsniper') {
    return 'Schedule demo of reviewSNIPER features'
  } else if (source === 'urla-form') {
    return 'Review loan application and contact borrower'
  } else if (source === 'gravitas') {
    if (data.recommended_action) return data.recommended_action
    if (data.classification === 'opportunity') return 'Reach out within 24 hours'
    if (data.classification === 'risk') return 'Review inquiry details and assess'
    if (data.classification === 'reputation') return 'Engage for testimonial/review'
  } else if (source === 'boxford') {
    return 'Initial discovery call'
  }
  return 'Follow up on inquiry'
}

function buildInitialActivity(source: string, data: any): string {
  if (source === 'reviewsniper') {
    const pain = data.pain_points ? ` - Pain points: ${data.pain_points}` : ''
    return `Lead from reviewSNIPER inquiry${pain}`
  } else if (source === 'gravitas') {
    return `Gravitas classified as ${data.classification || 'inquiry'}: ${data.subject || 'No subject'}`
  } else if (source === 'urla-form') {
    return `URLA loan application submitted${data.pain_points ? ` - ${data.pain_points}` : ''}${data.market ? ` (${data.market})` : ''}`
  } else if (source === 'boxford') {
    return `Contact form submission from boxfordpartners.com${data.pain_points ? ` - ${data.pain_points}` : ''}`
  }
  return 'New lead inquiry'
}

function calculateNextActionDate(): string {
  // Default: 2 business days from now
  const date = new Date()
  date.setDate(date.getDate() + 2)
  return date.toISOString().split('T')[0]
}

// PATCH /api/leads - Update existing contact with loan application details
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()

    const { contact_id, workspace_id } = body

    if (!contact_id || !workspace_id) {
      return NextResponse.json(
        { error: 'Missing required fields: contact_id, workspace_id' },
        { status: 400 }
      )
    }

    // Verify contact exists and belongs to workspace
    const existing = await sql`
      SELECT id FROM contacts
      WHERE id = ${contact_id} AND workspace_id = ${workspace_id}
    `

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
    }

    // Update contact fields
    await sql`
      UPDATE contacts
      SET
        last_activity = ${new Date().toISOString().split('T')[0]},
        updated_at = NOW()
      WHERE id = ${contact_id}
    `

    // Log loan details as an activity
    const details = []
    if (body.loan_amount) details.push(`Loan: $${body.loan_amount}`)
    if (body.loan_purpose) details.push(`Purpose: ${body.loan_purpose}`)
    if (body.property_address) details.push(`Property: ${body.property_address}`)
    if (body.property_value) details.push(`Value: $${body.property_value}`)
    if (body.application_status) details.push(`Status: ${body.application_status}`)

    if (details.length > 0) {
      await sql`
        INSERT INTO activities (
          contact_id,
          type,
          description,
          date
        )
        VALUES (
          ${contact_id},
          'note',
          ${`URLA application update - ${details.join(', ')}`},
          ${new Date().toISOString().split('T')[0]}
        )
      `
    }

    return NextResponse.json({
      success: true,
      message: 'Contact updated successfully'
    })

  } catch (error) {
    console.error('Error updating lead:', error)
    return NextResponse.json(
      { error: 'Failed to update lead', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
