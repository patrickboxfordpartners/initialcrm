import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// GET /api/workspaces?clerk_user_id=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clerk_user_id = searchParams.get('clerk_user_id')

    if (!clerk_user_id) {
      return NextResponse.json({ error: 'Missing clerk_user_id' }, { status: 400 })
    }

    const users = await sql`SELECT id FROM users WHERE clerk_user_id = ${clerk_user_id}`
    if (users.length === 0) {
      return NextResponse.json({ success: true, workspaces: [] })
    }

    const workspaces = await sql`
      SELECT * FROM workspaces WHERE owner_id = ${users[0].id} ORDER BY created_at ASC
    `
    return NextResponse.json({ success: true, workspaces })

  } catch (error) {
    console.error('Error fetching workspaces:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workspaces', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST /api/workspaces - Create workspace, auto-creating user row if needed
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clerk_user_id, email, name, workspace_name, workspace_type, color } = body

    if (!clerk_user_id || !workspace_name || !workspace_type) {
      return NextResponse.json(
        { error: 'Missing required fields: clerk_user_id, workspace_name, workspace_type' },
        { status: 400 }
      )
    }

    const validTypes = ['Real Estate', 'Consulting', 'Product', 'Other']
    if (!validTypes.includes(workspace_type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Find or create user
    let userId: string
    const existing = await sql`SELECT id FROM users WHERE clerk_user_id = ${clerk_user_id}`
    if (existing.length > 0) {
      userId = existing[0].id
    } else {
      const newUser = await sql`
        INSERT INTO users (clerk_user_id, email, name)
        VALUES (${clerk_user_id}, ${email || ''}, ${name || ''})
        RETURNING id
      `
      userId = newUser[0].id
    }

    const workspaceColor = color || '#10b981'
    const workspace = await sql`
      INSERT INTO workspaces (owner_id, name, type, color)
      VALUES (${userId}, ${workspace_name}, ${workspace_type}, ${workspaceColor})
      RETURNING *
    `

    return NextResponse.json({ success: true, workspace: workspace[0] })

  } catch (error) {
    console.error('Error creating workspace:', error)
    return NextResponse.json(
      { error: 'Failed to create workspace', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
