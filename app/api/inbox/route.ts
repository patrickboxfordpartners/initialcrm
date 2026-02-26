import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// POST /api/inbox - Receives Gravitas-classified inquiries
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const { workspace_id, from, subject, preview, classification, recommended_action, signals, rationale, full_text } = body

    if (!workspace_id || !from || !subject || !classification) {
      return NextResponse.json(
        { error: 'Missing required fields: workspace_id, from, subject, classification' },
        { status: 400 }
      )
    }

    // Validate classification type
    const validClassifications = ['noise', 'risk', 'opportunity', 'reputation']
    if (!validClassifications.includes(classification)) {
      return NextResponse.json(
        { error: `Invalid classification. Must be one of: ${validClassifications.join(', ')}` },
        { status: 400 }
      )
    }

    // Create inbox item
    const inboxItem = await sql`
      INSERT INTO inbox_items (
        workspace_id,
        from_address,
        subject,
        preview,
        classification,
        recommended_action,
        handled,
        date,
        signals,
        rationale,
        full_text
      )
      VALUES (
        ${workspace_id},
        ${from},
        ${subject},
        ${preview || ''},
        ${classification},
        ${recommended_action || buildDefaultRecommendedAction(classification)},
        false,
        ${new Date().toISOString().split('T')[0]},
        ${signals ? JSON.stringify(signals) : '{}'},
        ${rationale || null},
        ${full_text || null}
      )
      RETURNING *
    `

    const item = inboxItem[0]

    // If it's an opportunity and we have contact info, auto-create contact and pipeline item
    if (classification === 'opportunity' && body.contact_info) {
      const { name, email, phone, trust_signals } = body.contact_info

      if (name && email) {
        // Check if contact already exists
        const existing = await sql`
          SELECT id FROM contacts
          WHERE workspace_id = ${workspace_id}
          AND LOWER(email) = LOWER(${email})
          LIMIT 1
        `

        let contactId: string

        if (existing.length > 0) {
          // Update existing contact
          contactId = existing[0].id

          // Add activity to existing contact
          await sql`
            INSERT INTO activities (
              contact_id,
              type,
              description,
              date
            )
            VALUES (
              ${contactId},
              'gravitas',
              ${`Gravitas classified inquiry: ${subject}`},
              ${new Date().toISOString().split('T')[0]}
            )
          `
        } else {
          // Create new contact
          const newContact = await sql`
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
              ARRAY['gravitas-lead', 'opportunity']::text[],
              'lead',
              'Gravitas Index (opportunity)',
              ${trust_signals || []},
              ${recommended_action || 'Reach out within 24 hours'},
              ${calculateNextActionDate(1)},
              ${new Date().toISOString().split('T')[0]},
              ${calculateOpportunityCredibility(trust_signals)}
            )
            RETURNING *
          `

          contactId = newContact[0].id

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
              'gravitas',
              ${`Gravitas classified as opportunity: ${subject}`},
              ${new Date().toISOString().split('T')[0]}
            )
          `

          // Create pipeline item for new opportunity
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
              ${recommended_action || 'Reach out within 24 hours'}
            )
          `
        }

        return NextResponse.json({
          success: true,
          inbox_item: item,
          contact_created: existing.length === 0,
          contact_id: contactId,
          message: existing.length > 0
            ? 'Inbox item created and activity added to existing contact'
            : 'Inbox item created with new contact and pipeline item'
        })
      }
    }

    return NextResponse.json({
      success: true,
      inbox_item: item,
      message: 'Inbox item created successfully'
    })

  } catch (error) {
    console.error('Error creating inbox item:', error)
    return NextResponse.json(
      { error: 'Failed to create inbox item', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET /api/inbox - Retrieve inbox items for a workspace
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const workspace_id = searchParams.get('workspace_id')
    const handled = searchParams.get('handled')

    if (!workspace_id) {
      return NextResponse.json(
        { error: 'Missing workspace_id parameter' },
        { status: 400 }
      )
    }

    let items
    if (handled === 'true') {
      items = await sql`
        SELECT * FROM inbox_items
        WHERE workspace_id = ${workspace_id} AND handled = true
        ORDER BY date DESC, created_at DESC
      `
    } else if (handled === 'false') {
      items = await sql`
        SELECT * FROM inbox_items
        WHERE workspace_id = ${workspace_id} AND handled = false
        ORDER BY date DESC, created_at DESC
      `
    } else {
      items = await sql`
        SELECT * FROM inbox_items
        WHERE workspace_id = ${workspace_id}
        ORDER BY handled ASC, date DESC, created_at DESC
      `
    }

    return NextResponse.json({
      success: true,
      items
    })

  } catch (error) {
    console.error('Error fetching inbox items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inbox items', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// PATCH /api/inbox - Mark inbox item as handled
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, handled } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Missing id field' },
        { status: 400 }
      )
    }

    const updated = await sql`
      UPDATE inbox_items
      SET handled = ${handled !== false}
      WHERE id = ${id}
      RETURNING *
    `

    if (updated.length === 0) {
      return NextResponse.json(
        { error: 'Inbox item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      item: updated[0],
      message: 'Inbox item updated successfully'
    })

  } catch (error) {
    console.error('Error updating inbox item:', error)
    return NextResponse.json(
      { error: 'Failed to update inbox item', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Helper functions

function buildDefaultRecommendedAction(classification: string): string {
  switch (classification) {
    case 'opportunity':
      return 'Respond within 24 hours to capture lead'
    case 'risk':
      return 'Review carefully and consult with legal/compliance'
    case 'reputation':
      return 'Engage positively for testimonial or review opportunity'
    case 'noise':
      return 'Mark as spam or unsubscribe sender'
    default:
      return 'Review and take appropriate action'
  }
}

function calculateOpportunityCredibility(trustSignals?: string[]): number {
  let score = 75 // Opportunities start high

  if (trustSignals && trustSignals.length > 0) {
    score += trustSignals.length * 5 // +5 for each trust signal
  }

  return Math.min(score, 100)
}

function calculateNextActionDate(daysFromNow: number): string {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  return date.toISOString().split('T')[0]
}
