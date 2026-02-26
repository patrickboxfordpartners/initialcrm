"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { useUser } from "@clerk/nextjs"

export type WorkspaceType = "Real Estate" | "Consulting" | "Product" | "Other"

export interface Workspace {
  id: string
  name: string
  type: WorkspaceType
  color: string
}

export interface Contact {
  id: string
  workspaceId: string
  name: string
  email: string
  phone: string
  tags: string[]
  status: "active" | "inactive" | "lead"
  source: string
  trustSignals: string[]
  nextAction: string
  nextActionDate: string
  lastActivity: string
  credibilityScore: number
  activities: Activity[]
}

export interface Activity {
  id: string
  type: "call" | "email" | "text" | "note" | "gravitas"
  description: string
  date: string
}

export interface PipelineItem {
  id: string
  workspaceId: string
  contactId: string
  contactName: string
  stage: "new" | "active" | "hot" | "under_contract" | "closed"
  lastTouch: string
  nextAction: string
  credibilityScore: number
}

export interface Task {
  id: string
  workspaceId: string
  description: string
  dueDate: string
  completed: boolean
  linkedContactId?: string
  linkedContactName?: string
}

export interface InboxItem {
  id: string
  workspaceId: string
  from: string
  subject: string
  preview: string
  classification: "noise" | "risk" | "opportunity" | "reputation"
  recommendedAction: string
  handled: boolean
  date: string
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

interface WorkspaceContextType {
  workspaces: Workspace[]
  currentWorkspace: Workspace | null
  setCurrentWorkspace: (ws: Workspace) => void
  createWorkspace: (name: string, type: WorkspaceType) => void
  deleteWorkspace: (id: string) => void
  contacts: Contact[]
  createContact: (fields: Omit<Contact, "id" | "activities">) => Promise<Contact | null>
  updateContact: (id: string, fields: Partial<Omit<Contact, "id" | "workspaceId" | "activities">>) => Promise<void>
  deleteContact: (id: string) => Promise<void>
  logActivity: (contactId: string, type: Activity["type"], description: string) => Promise<void>
  pipeline: PipelineItem[]
  addToPipeline: (contactId: string) => Promise<void>
  movePipelineItem: (id: string, stage: PipelineItem["stage"]) => Promise<void>
  removePipelineItem: (id: string) => Promise<void>
  tasks: Task[]
  toggleTask: (id: string) => void
  addTask: (task: Omit<Task, "id">) => void
  inbox: InboxItem[]
  handleInboxItem: (id: string) => void
  activePage: string
  setActivePage: (page: string) => void
  loading: boolean
}

const WorkspaceContext = createContext<WorkspaceContextType | null>(null)

function mapContact(c: any): Contact {
  return {
    id: c.id,
    workspaceId: c.workspace_id,
    name: c.name,
    email: c.email,
    phone: c.phone || '',
    tags: c.tags || [],
    status: c.status,
    source: c.source || '',
    trustSignals: c.trust_signals || [],
    nextAction: c.next_action || '',
    nextActionDate: c.next_action_date ? String(c.next_action_date).split('T')[0] : '',
    lastActivity: c.last_activity ? String(c.last_activity).split('T')[0] : '',
    credibilityScore: c.credibility_score || 0,
    activities: (c.activities || []).map((a: any) => ({
      id: a.id,
      type: a.type,
      description: a.description,
      date: a.date ? String(a.date).split('T')[0] : '',
    })),
  }
}

function mapPipelineItem(p: any): PipelineItem {
  return {
    id: p.id,
    workspaceId: p.workspace_id,
    contactId: p.contact_id,
    contactName: p.contact_name,
    stage: p.stage,
    lastTouch: p.last_touch || '',
    nextAction: p.next_action || '',
    credibilityScore: p.credibility_score || 0,
  }
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [pipeline, setPipeline] = useState<PipelineItem[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [inbox, setInbox] = useState<InboxItem[]>([])
  const [activePage, setActivePage] = useState("contacts")
  const [loading, setLoading] = useState(true)

  // Load workspaces on login
  useEffect(() => {
    if (!isLoaded) return
    if (!user) { setLoading(false); return }

    const load = async () => {
      try {
        const res = await fetch(`/api/workspaces?clerk_user_id=${user.id}`, { cache: 'no-store' })
        const { workspaces: dbWorkspaces } = await res.json()

        if (dbWorkspaces && dbWorkspaces.length > 0) {
          const mapped: Workspace[] = dbWorkspaces.map((w: any) => ({
            id: w.id, name: w.name, type: w.type as WorkspaceType, color: w.color,
          }))
          setWorkspaces(mapped)
          setCurrentWorkspace(mapped[0])
        } else {
          const createRes = await fetch('/api/workspaces', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              clerk_user_id: user.id,
              email: user.primaryEmailAddress?.emailAddress ?? '',
              name: user.fullName ?? '',
              workspace_name: 'My Workspace',
              workspace_type: 'Other',
              color: '#10b981',
            }),
          })
          const { workspace } = await createRes.json()
          if (workspace) {
            const mapped = [{ id: workspace.id, name: workspace.name, type: workspace.type as WorkspaceType, color: workspace.color }]
            setWorkspaces(mapped)
            setCurrentWorkspace(mapped[0])
          }
        }
      } catch (err) {
        console.error('Failed to load workspaces:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user, isLoaded])

  // Load contacts + pipeline when workspace changes
  const loadContacts = useCallback((workspaceId: string) => {
    fetch(`/api/contacts?workspace_id=${workspaceId}`)
      .then(r => r.json())
      .then(({ contacts: rows }) => { if (rows) setContacts(rows.map(mapContact)) })
      .catch(err => console.error('Failed to load contacts:', err))
  }, [])

  const loadPipeline = useCallback((workspaceId: string) => {
    fetch(`/api/pipeline?workspace_id=${workspaceId}`)
      .then(r => r.json())
      .then(({ items }) => { if (items) setPipeline(items.map(mapPipelineItem)) })
      .catch(err => console.error('Failed to load pipeline:', err))
  }, [])

  useEffect(() => {
    if (!currentWorkspace) return
    loadContacts(currentWorkspace.id)
    loadPipeline(currentWorkspace.id)
  }, [currentWorkspace?.id, loadContacts, loadPipeline])

  // Reload on tab focus
  useEffect(() => {
    if (!currentWorkspace) return
    const id = currentWorkspace.id
    const handle = () => {
      if (document.visibilityState === 'visible') {
        loadContacts(id)
        loadPipeline(id)
      }
    }
    document.addEventListener('visibilitychange', handle)
    return () => document.removeEventListener('visibilitychange', handle)
  }, [currentWorkspace?.id, loadContacts, loadPipeline])

  const createWorkspace = useCallback((name: string, type: WorkspaceType) => {
    if (!user) return
    const color = COLORS[workspaces.length % COLORS.length]
    fetch('/api/workspaces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clerk_user_id: user.id,
        email: user.primaryEmailAddress?.emailAddress ?? '',
        name: user.fullName ?? '',
        workspace_name: name,
        workspace_type: type,
        color,
      }),
    })
      .then(r => r.json())
      .then(({ workspace }) => {
        if (!workspace) return
        const newWs: Workspace = { id: workspace.id, name: workspace.name, type: workspace.type as WorkspaceType, color: workspace.color }
        setWorkspaces(prev => [...prev, newWs])
        setCurrentWorkspace(newWs)
      })
      .catch(console.error)
  }, [user, workspaces.length])

  const deleteWorkspace = useCallback((id: string) => {
    if (workspaces.length <= 1) return
    fetch(`/api/workspaces?id=${id}`, { method: 'DELETE' }).catch(console.error)
    setWorkspaces((prev) => {
      const remaining = prev.filter((w) => w.id !== id)
      if (currentWorkspace?.id === id) setCurrentWorkspace(remaining[0])
      return remaining
    })
    setContacts((prev) => prev.filter((c) => c.workspaceId !== id))
    setPipeline((prev) => prev.filter((p) => p.workspaceId !== id))
  }, [workspaces.length, currentWorkspace?.id])

  const createContact = useCallback(async (fields: Omit<Contact, "id" | "activities">): Promise<Contact | null> => {
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspace_id: fields.workspaceId,
          name: fields.name,
          email: fields.email,
          phone: fields.phone,
          status: fields.status,
          source: fields.source,
          next_action: fields.nextAction,
          next_action_date: fields.nextActionDate || null,
          tags: fields.tags,
        }),
      })
      const { contact } = await res.json()
      if (!contact) return null
      const mapped = mapContact(contact)
      setContacts(prev => [mapped, ...prev])
      return mapped
    } catch (err) {
      console.error('Failed to create contact:', err)
      return null
    }
  }, [])

  const updateContact = useCallback(async (id: string, fields: Partial<Omit<Contact, "id" | "workspaceId" | "activities">>) => {
    const payload: any = {}
    if (fields.name !== undefined) payload.name = fields.name
    if (fields.email !== undefined) payload.email = fields.email
    if (fields.phone !== undefined) payload.phone = fields.phone
    if (fields.status !== undefined) payload.status = fields.status
    if (fields.nextAction !== undefined) payload.next_action = fields.nextAction
    if (fields.nextActionDate !== undefined) payload.next_action_date = fields.nextActionDate || null
    if (fields.tags !== undefined) payload.tags = fields.tags

    await fetch(`/api/contacts?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...fields } : c))
  }, [])

  const deleteContact = useCallback(async (id: string) => {
    await fetch(`/api/contacts?id=${id}`, { method: 'DELETE' })
    setContacts(prev => prev.filter(c => c.id !== id))
    setPipeline(prev => prev.filter(p => p.contactId !== id))
  }, [])

  const logActivity = useCallback(async (contactId: string, type: Activity["type"], description: string) => {
    const res = await fetch('/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact_id: contactId, type, description }),
    })
    const { activity } = await res.json()
    if (!activity) return
    const today = new Date().toISOString().split('T')[0]
    setContacts(prev => prev.map(c => c.id === contactId
      ? { ...c, lastActivity: today, activities: [{ id: activity.id, type: activity.type, description: activity.description, date: activity.date }, ...c.activities] }
      : c
    ))
  }, [])

  const addToPipeline = useCallback(async (contactId: string) => {
    if (!currentWorkspace) return
    const contact = contacts.find(c => c.id === contactId)
    if (!contact) return
    const res = await fetch('/api/pipeline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workspace_id: currentWorkspace.id, contact_id: contactId, stage: 'new', next_action: contact.nextAction }),
    })
    const { item } = await res.json()
    if (!item) return
    const mapped = mapPipelineItem({ ...item, contact_name: contact.name, credibility_score: contact.credibilityScore })
    setPipeline(prev => {
      const exists = prev.find(p => p.contactId === contactId)
      return exists ? prev : [mapped, ...prev]
    })
  }, [currentWorkspace, contacts])

  const movePipelineItem = useCallback(async (id: string, stage: PipelineItem["stage"]) => {
    await fetch(`/api/pipeline?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage }),
    })
    setPipeline(prev => prev.map(p => p.id === id ? { ...p, stage } : p))
  }, [])

  const removePipelineItem = useCallback(async (id: string) => {
    await fetch(`/api/pipeline?id=${id}`, { method: 'DELETE' })
    setPipeline(prev => prev.filter(p => p.id !== id))
  }, [])

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }, [])

  const addTask = useCallback((task: Omit<Task, "id">) => {
    setTasks(prev => [...prev, { ...task, id: `t-${Date.now()}` }])
  }, [])

  const handleInboxItem = useCallback((id: string) => {
    setInbox(prev => prev.map(item => item.id === id ? { ...item, handled: true } : item))
  }, [])

  return (
    <WorkspaceContext.Provider value={{
      workspaces, currentWorkspace, setCurrentWorkspace, createWorkspace, deleteWorkspace,
      contacts, createContact, updateContact, deleteContact, logActivity,
      pipeline, addToPipeline, movePipelineItem, removePipelineItem,
      tasks, toggleTask, addTask, inbox, handleInboxItem,
      activePage, setActivePage, loading,
    }}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider")
  return ctx
}
