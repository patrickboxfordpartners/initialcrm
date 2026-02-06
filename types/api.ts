// API Types for boxfordCRM Integration
// Use these types when integrating reviewSNIPER, Gravitas Index, or boxfordpartners.com

/**
 * POST /api/leads
 * Create a new lead/contact from external sources
 */
export interface CreateLeadRequest {
  // Required fields
  source: 'reviewsniper' | 'gravitas' | 'boxford' | string
  workspace_id: string // UUID of the workspace to add this lead to
  name: string
  email: string

  // Optional fields
  phone?: string
  market?: string // Geographic market or location
  pain_points?: string // Customer pain points or inquiry details
  role?: string // Job title or role
  industry?: string // Industry type
  classification?: 'opportunity' | 'risk' | 'noise' | 'reputation' // From Gravitas
  trust_signals?: string[] // Trust signals from Gravitas or other source
  recommended_action?: string // Recommended next action
}

export interface CreateLeadResponse {
  success: boolean
  contact: Contact
  message: string
}

/**
 * POST /api/inbox
 * Create an inbox item from Gravitas-classified inquiries
 */
export interface CreateInboxItemRequest {
  // Required fields
  workspace_id: string // UUID of the workspace
  from: string // Email address or name of sender
  subject: string // Subject line of inquiry
  classification: 'opportunity' | 'risk' | 'noise' | 'reputation'

  // Optional fields
  preview?: string // Preview text of the inquiry
  recommended_action?: string // Recommended action to take
  contact_info?: {
    // If provided, will auto-create contact for opportunities
    name: string
    email: string
    phone?: string
    trust_signals?: string[]
  }
}

export interface CreateInboxItemResponse {
  success: boolean
  inbox_item: InboxItem
  contact_created?: boolean
  contact_id?: string
  message: string
}

/**
 * GET /api/inbox?workspace_id={id}&handled={true|false}
 * Retrieve inbox items for a workspace
 */
export interface GetInboxItemsResponse {
  success: boolean
  items: InboxItem[]
}

/**
 * PATCH /api/inbox
 * Mark an inbox item as handled/unhandled
 */
export interface UpdateInboxItemRequest {
  id: string // UUID of inbox item
  handled: boolean
}

export interface UpdateInboxItemResponse {
  success: boolean
  item: InboxItem
  message: string
}

/**
 * GET /api/workspaces?user_id={id}
 * Retrieve workspaces for a user
 */
export interface GetWorkspacesResponse {
  success: boolean
  workspaces: Workspace[]
}

/**
 * POST /api/workspaces
 * Create a new workspace
 */
export interface CreateWorkspaceRequest {
  user_id: string // Clerk user ID
  name: string
  type: 'Real Estate' | 'Consulting' | 'Product' | 'Other'
  color?: string // Hex color code
}

export interface CreateWorkspaceResponse {
  success: boolean
  workspace: Workspace
  message: string
}

// Data models

export interface Contact {
  id: string
  workspace_id: string
  name: string
  email: string
  phone: string
  tags: string[]
  status: 'active' | 'inactive' | 'lead'
  source: string
  trust_signals: string[]
  next_action: string
  next_action_date: string
  last_activity: string
  credibility_score: number
  created_at: string
  updated_at: string
}

export interface InboxItem {
  id: string
  workspace_id: string
  from_address: string
  subject: string
  preview: string
  classification: 'opportunity' | 'risk' | 'noise' | 'reputation'
  recommended_action: string
  handled: boolean
  date: string
  created_at: string
  updated_at: string
}

export interface Workspace {
  id: string
  name: string
  type: 'Real Estate' | 'Consulting' | 'Product' | 'Other'
  color: string
  owner_id: string
  created_at: string
  updated_at: string
}

// Error response
export interface ErrorResponse {
  error: string
  details?: string
}
