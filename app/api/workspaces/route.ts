import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// GET /api/workspaces - Retrieve workspaces for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')

    if (!user_id) {
      return NextResponse.json(
        { error: 'Missing user_id parameter' },
        { status: 400 }
      )
    }

    const workspaces = await sql`
      SELECT * FROM workspaces
      WHERE owner_id = ${user_id}
      ORDER BY created_at ASC
    `

    return NextResponse.json({
      success: true,
      workspaces
    })

  } catch (error) {
    console.error('Error fetching workspaces:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workspaces', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST /api/workspaces - Create a new workspace
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, name, type, color } = body

    if (!user_id || !name || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, name, type' },
        { status: 400 }
      )
    }

    // Validate type
    const validTypes = ['Real Estate', 'Consulting', 'Product', 'Other']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Default color if not provided
    const workspaceColor = color || getRandomColor()

    const workspace = await sql`
      INSERT INTO workspaces (
        owner_id,
        name,
        type,
        color
      )
      VALUES (
        ${user_id},
        ${name},
        ${type},
        ${workspaceColor}
      )
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      workspace: workspace[0],
      message: 'Workspace created successfully'
    })

  } catch (error) {
    console.error('Error creating workspace:', error)
    return NextResponse.json(
      { error: 'Failed to create workspace', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Helper function
function getRandomColor(): string {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
  return colors[Math.floor(Math.random() * colors.length)]
}
