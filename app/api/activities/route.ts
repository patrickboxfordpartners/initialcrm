import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// POST /api/activities
export async function POST(request: NextRequest) {
  try {
    const { contact_id, type, description } = await request.json()
    if (!contact_id || !type || !description) {
      return NextResponse.json({ error: 'contact_id, type, description required' }, { status: 400 })
    }
    const today = new Date().toISOString().split('T')[0]
    const result = await sql`
      INSERT INTO activities (contact_id, type, description, date)
      VALUES (${contact_id}, ${type}, ${description}, ${today})
      RETURNING *
    `
    // Update last_activity on the contact
    await sql`UPDATE contacts SET last_activity = ${today}, updated_at = NOW() WHERE id = ${contact_id}`
    return NextResponse.json({ activity: result[0] })
  } catch (error) {
    console.error('Error logging activity:', error)
    return NextResponse.json({ error: 'Failed to log activity' }, { status: 500 })
  }
}
