import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET /api/contacts?workspace_id=<uuid>
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const workspaceId = searchParams.get('workspace_id')
  const q = searchParams.get('q')
  const allWorkspaces = searchParams.get('all') === 'true'

  if (!workspaceId && !allWorkspaces) {
    return NextResponse.json({ error: 'workspace_id is required' }, { status: 400 })
  }

  try {
    const contacts = allWorkspaces && q
      ? await sql`
          SELECT c.id, c.workspace_id, c.name, c.email, c.phone, c.tags, c.status, c.source,
            c.trust_signals, c.next_action, c.next_action_date, c.last_activity, c.credibility_score,
            '[]'::json AS activities
          FROM contacts c
          WHERE (c.name ILIKE ${'%' + q + '%'} OR c.email ILIKE ${'%' + q + '%'})
          ORDER BY c.created_at DESC LIMIT 50
        `
      : await sql`
          SELECT
            c.id, c.workspace_id, c.name, c.email, c.phone, c.tags, c.status, c.source,
            c.trust_signals, c.next_action, c.next_action_date, c.last_activity, c.credibility_score,
            COALESCE(
              json_agg(
                json_build_object('id', a.id, 'type', a.type, 'description', a.description, 'date', a.date)
                ORDER BY a.date DESC
              ) FILTER (WHERE a.id IS NOT NULL),
              '[]'
            ) AS activities
          FROM contacts c
          LEFT JOIN activities a ON a.contact_id = c.id
          WHERE c.workspace_id = ${workspaceId}
          GROUP BY c.id
          ORDER BY c.created_at DESC
        `

    return NextResponse.json({ contacts })
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 })
  }
}

// POST /api/contacts
export async function POST(request: NextRequest) {
  try {
    const { workspace_id, name, email, phone, status, source, next_action, next_action_date, tags } = await request.json()
    if (!workspace_id || !name || !email) {
      return NextResponse.json({ error: 'workspace_id, name, email required' }, { status: 400 })
    }
    const today = new Date().toISOString().split('T')[0]
    const result = await sql`
      INSERT INTO contacts (workspace_id, name, email, phone, status, source, next_action, next_action_date, last_activity, tags, credibility_score)
      VALUES (
        ${workspace_id}, ${name}, ${email}, ${phone || ''}, ${status || 'lead'},
        ${source || 'Manual entry'}, ${next_action || ''}, ${next_action_date || null},
        ${today}, ${tags || []}, 50
      )
      RETURNING *
    `
    return NextResponse.json({ contact: result[0] })
  } catch (error) {
    console.error('Error creating contact:', error)
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 })
  }
}

// PATCH /api/contacts?id=<uuid>
export async function PATCH(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  try {
    const fields = await request.json()
    const { name, email, phone, status, next_action, next_action_date, tags } = fields
    await sql`
      UPDATE contacts SET
        name = COALESCE(${name ?? null}, name),
        email = COALESCE(${email ?? null}, email),
        phone = COALESCE(${phone ?? null}, phone),
        status = COALESCE(${status ?? null}, status),
        next_action = COALESCE(${next_action ?? null}, next_action),
        next_action_date = COALESCE(${next_action_date ?? null}, next_action_date),
        tags = COALESCE(${tags ?? null}, tags),
        updated_at = NOW()
      WHERE id = ${id}
    `
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 })
  }
}

// DELETE /api/contacts?id=<uuid>
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  try {
    await sql`DELETE FROM contacts WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 })
  }
}
