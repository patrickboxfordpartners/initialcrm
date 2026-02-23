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
  contacts: Contact[]
  addContact: (contact: Omit<Contact, "id" | "activities">) => void
  pipeline: PipelineItem[]
  movePipelineItem: (id: string, stage: PipelineItem["stage"]) => void
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

  useEffect(() => {
    if (!isLoaded) return
    if (!user) {
      setLoading(false)
      return
    }

    const load = async () => {
      try {
        const res = await fetch(`/api/workspaces?clerk_user_id=${user.id}`)
        const { workspaces: dbWorkspaces } = await res.json()

        if (dbWorkspaces && dbWorkspaces.length > 0) {
          const mapped: Workspace[] = dbWorkspaces.map((w: any) => ({
            id: w.id,
            name: w.name,
            type: w.type as WorkspaceType,
            color: w.color,
          }))
          setWorkspaces(mapped)
          setCurrentWorkspace(mapped[0])
        } else {
          // Auto-create a default workspace on first login
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
            const mapped: Workspace[] = [{
              id: workspace.id,
              name: workspace.name,
              type: workspace.type as WorkspaceType,
              color: workspace.color,
            }]
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
        const newWs: Workspace = {
          id: workspace.id,
          name: workspace.name,
          type: workspace.type as WorkspaceType,
          color: workspace.color,
        }
        setWorkspaces(prev => [...prev, newWs])
        setCurrentWorkspace(newWs)
      })
      .catch(console.error)
  }, [user, workspaces.length])

  const loadContacts = useCallback((workspaceId: string) => {
    fetch(`/api/contacts?workspace_id=${workspaceId}`)
      .then(r => r.json())
      .then(({ contacts: rows }) => {
        if (!rows) return
        const mapped: Contact[] = rows.map((c: any) => ({
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
          nextActionDate: c.next_action_date || '',
          lastActivity: c.last_activity || '',
          credibilityScore: c.credibility_score || 0,
          activities: (c.activities || []).map((a: any) => ({
            id: a.id,
            type: a.type,
            description: a.description,
            date: a.date,
          })),
        }))
        setContacts(mapped)
      })
      .catch(err => console.error('Failed to load contacts:', err))
  }, [])

  useEffect(() => {
    if (!currentWorkspace) return
    loadContacts(currentWorkspace.id)
  }, [currentWorkspace?.id, loadContacts])

  // Reload contacts when the tab regains focus (picks up externally added contacts)
  useEffect(() => {
    if (!currentWorkspace) return
    const handleFocus = () => loadContacts(currentWorkspace.id)
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [currentWorkspace?.id, loadContacts])

  const addContact = useCallback((contact: Omit<Contact, "id" | "activities">) => {
    setContacts((prev) => [...prev, { ...contact, id: `c-${Date.now()}`, activities: [] }])
  }, [])

  const movePipelineItem = useCallback((id: string, stage: PipelineItem["stage"]) => {
    setPipeline((prev) => prev.map((item) => (item.id === id ? { ...item, stage } : item)))
  }, [])

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }, [])

  const addTask = useCallback((task: Omit<Task, "id">) => {
    setTasks((prev) => [...prev, { ...task, id: `t-${Date.now()}` }])
  }, [])

  const handleInboxItem = useCallback((id: string) => {
    setInbox((prev) => prev.map((item) => (item.id === id ? { ...item, handled: true } : item)))
  }, [])

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces, currentWorkspace, setCurrentWorkspace, createWorkspace,
        contacts, addContact, pipeline, movePipelineItem,
        tasks, toggleTask, addTask, inbox, handleInboxItem,
        activePage, setActivePage, loading,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider")
  return ctx
}
