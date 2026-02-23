import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// GET /api/contacts?workspace_id=<uuid>
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const workspaceId = searchParams.get('workspace_id')

  if (!workspaceId) {
    return NextResponse.json({ error: 'workspace_id is required' }, { status: 400 })
  }

  try {
    const contacts = await sql`
      SELECT
        c.id,
        c.workspace_id,
        c.name,
        c.email,
        c.phone,
        c.tags,
        c.status,
        c.source,
        c.trust_signals,
        c.next_action,
        c.next_action_date,
        c.last_activity,
        c.credibility_score,
        COALESCE(
          json_agg(
            json_build_object(
              'id', a.id,
              'type', a.type,
              'description', a.description,
              'date', a.date
            ) ORDER BY a.date DESC
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
    return NextResponse.json(
      { error: 'Failed to fetch contacts', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// DELETE /api/contacts?id=<uuid>
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 })
  }

  try {
    await sql`DELETE FROM contacts WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json(
      { error: 'Failed to delete contact', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
