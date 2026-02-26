import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET /api/pipeline?workspace_id=<uuid>
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const workspaceId = searchParams.get('workspace_id')
  if (!workspaceId) return NextResponse.json({ error: 'workspace_id required' }, { status: 400 })

  try {
    const items = await sql`
      SELECT p.id, p.workspace_id, p.contact_id, p.stage, p.last_touch, p.next_action,
        c.name AS contact_name, c.credibility_score
      FROM pipeline_items p
      JOIN contacts c ON c.id = p.contact_id
      WHERE p.workspace_id = ${workspaceId}
      ORDER BY p.created_at DESC
    `
    return NextResponse.json({ items })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pipeline' }, { status: 500 })
  }
}

// POST /api/pipeline - add contact to pipeline
export async function POST(request: NextRequest) {
  try {
    const { workspace_id, contact_id, stage, next_action } = await request.json()
    if (!workspace_id || !contact_id) return NextResponse.json({ error: 'workspace_id, contact_id required' }, { status: 400 })
    // Check if already in pipeline
    const existing = await sql`SELECT id FROM pipeline_items WHERE contact_id = ${contact_id}`
    if (existing.length > 0) {
      return NextResponse.json({ item: existing[0] })
    }
    const today = new Date().toISOString().split('T')[0]
    const result = await sql`
      INSERT INTO pipeline_items (workspace_id, contact_id, stage, last_touch, next_action)
      VALUES (${workspace_id}, ${contact_id}, ${stage || 'new'}, ${today}, ${next_action || 'Follow up'})
      RETURNING *
    `
    return NextResponse.json({ item: result[0] })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add to pipeline' }, { status: 500 })
  }
}

// PATCH /api/pipeline?id=<uuid> - move stage
export async function PATCH(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  try {
    const { stage } = await request.json()
    const today = new Date().toISOString().split('T')[0]
    await sql`UPDATE pipeline_items SET stage = ${stage}, last_touch = ${today}, updated_at = NOW() WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update stage' }, { status: 500 })
  }
}

// DELETE /api/pipeline?id=<uuid>
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  try {
    await sql`DELETE FROM pipeline_items WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove from pipeline' }, { status: 500 })
  }
}
