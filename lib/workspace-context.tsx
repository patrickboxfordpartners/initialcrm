"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

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

const DEFAULT_WORKSPACES: Workspace[] = [
  { id: "ws-1", name: "Real Estate", type: "Real Estate", color: "#3b82f6" },
  { id: "ws-2", name: "Consulting", type: "Consulting", color: "#10b981" },
  { id: "ws-3", name: "Gravitas", type: "Product", color: "#f59e0b" },
]

const DEMO_CONTACTS: Contact[] = [
  {
    id: "c-1", workspaceId: "ws-1", name: "Sarah Chen", email: "sarah@chen.com", phone: "+1 (555) 234-5678",
    tags: ["investor", "high-value"], status: "active", source: "Referral from Marcus", trustSignals: ["Verified identity", "2 successful transactions"],
    nextAction: "Schedule property viewing", nextActionDate: "2026-02-10", lastActivity: "2026-02-03", credibilityScore: 92,
    activities: [
      { id: "a-1", type: "call", description: "Discussed luxury condo requirements", date: "2026-02-03" },
      { id: "a-2", type: "email", description: "Sent property portfolio", date: "2026-02-01" },
    ],
  },
  {
    id: "c-2", workspaceId: "ws-1", name: "James Miller", email: "james@miller.io", phone: "+1 (555) 876-5432",
    tags: ["buyer", "first-time"], status: "lead", source: "Website inquiry", trustSignals: ["Pre-approved financing"],
    nextAction: "Follow up on mortgage", nextActionDate: "2026-02-08", lastActivity: "2026-02-02", credibilityScore: 78,
    activities: [
      { id: "a-3", type: "note", description: "Interested in 3BR properties under $600k", date: "2026-02-02" },
    ],
  },
  {
    id: "c-3", workspaceId: "ws-1", name: "Linda Park", email: "linda@parkgroup.com", phone: "+1 (555) 345-6789",
    tags: ["seller", "commercial"], status: "active", source: "Gravitas inquiry", trustSignals: ["Verified business", "Long-term client"],
    nextAction: "Review listing agreement", nextActionDate: "2026-02-12", lastActivity: "2026-01-30", credibilityScore: 95,
    activities: [
      { id: "a-4", type: "email", description: "Sent revised listing terms", date: "2026-01-30" },
      { id: "a-5", type: "call", description: "Negotiated commission rate", date: "2026-01-28" },
    ],
  },
  {
    id: "c-4", workspaceId: "ws-2", name: "David Okafor", email: "david@okafor.co", phone: "+1 (555) 456-7890",
    tags: ["retainer", "strategy"], status: "active", source: "Conference networking", trustSignals: ["3 completed engagements"],
    nextAction: "Prepare Q1 strategy deck", nextActionDate: "2026-02-15", lastActivity: "2026-02-04", credibilityScore: 88,
    activities: [
      { id: "a-6", type: "call", description: "Reviewed organizational goals", date: "2026-02-04" },
    ],
  },
  {
    id: "c-5", workspaceId: "ws-2", name: "Anna Petrov", email: "anna@petrov.biz", phone: "+1 (555) 567-8901",
    tags: ["prospect", "enterprise"], status: "lead", source: "Inbound email", trustSignals: [],
    nextAction: "Send capability deck", nextActionDate: "2026-02-07", lastActivity: "2026-02-01", credibilityScore: 60,
    activities: [
      { id: "a-7", type: "email", description: "Initial inquiry about M&A advisory", date: "2026-02-01" },
    ],
  },
  {
    id: "c-6", workspaceId: "ws-3", name: "Marcus Wei", email: "marcus@tech.io", phone: "+1 (555) 678-9012",
    tags: ["partner", "tech"], status: "active", source: "Gravitas platform", trustSignals: ["Verified developer", "Endorsed by 3 partners"],
    nextAction: "Review integration proposal", nextActionDate: "2026-02-09", lastActivity: "2026-02-05", credibilityScore: 91,
    activities: [
      { id: "a-8", type: "note", description: "Wants to integrate Gravitas widget into SaaS platform", date: "2026-02-05" },
    ],
  },
]

const DEMO_PIPELINE: PipelineItem[] = [
  { id: "p-1", workspaceId: "ws-1", contactId: "c-2", contactName: "James Miller", stage: "new", lastTouch: "2026-02-02", nextAction: "Follow up on mortgage", credibilityScore: 78 },
  { id: "p-2", workspaceId: "ws-1", contactId: "c-1", contactName: "Sarah Chen", stage: "active", lastTouch: "2026-02-03", nextAction: "Schedule property viewing", credibilityScore: 92 },
  { id: "p-3", workspaceId: "ws-1", contactId: "c-3", contactName: "Linda Park", stage: "hot", lastTouch: "2026-01-30", nextAction: "Review listing agreement", credibilityScore: 95 },
  { id: "p-4", workspaceId: "ws-2", contactId: "c-5", contactName: "Anna Petrov", stage: "new", lastTouch: "2026-02-01", nextAction: "Send capability deck", credibilityScore: 60 },
  { id: "p-5", workspaceId: "ws-2", contactId: "c-4", contactName: "David Okafor", stage: "active", lastTouch: "2026-02-04", nextAction: "Prepare Q1 strategy deck", credibilityScore: 88 },
]

const DEMO_TASKS: Task[] = [
  { id: "t-1", workspaceId: "ws-1", description: "Follow up with James on mortgage pre-approval", dueDate: "2026-02-08", completed: false, linkedContactId: "c-2", linkedContactName: "James Miller" },
  { id: "t-2", workspaceId: "ws-1", description: "Schedule property viewing for Sarah", dueDate: "2026-02-10", completed: false, linkedContactId: "c-1", linkedContactName: "Sarah Chen" },
  { id: "t-3", workspaceId: "ws-1", description: "Review Linda's listing agreement", dueDate: "2026-02-12", completed: false, linkedContactId: "c-3", linkedContactName: "Linda Park" },
  { id: "t-4", workspaceId: "ws-2", description: "Prepare Q1 strategy deck for David", dueDate: "2026-02-15", completed: false, linkedContactId: "c-4", linkedContactName: "David Okafor" },
  { id: "t-5", workspaceId: "ws-2", description: "Send capability deck to Anna", dueDate: "2026-02-07", completed: true, linkedContactId: "c-5", linkedContactName: "Anna Petrov" },
  { id: "t-6", workspaceId: "ws-3", description: "Review Marcus's integration proposal", dueDate: "2026-02-09", completed: false, linkedContactId: "c-6", linkedContactName: "Marcus Wei" },
]

const DEMO_INBOX: InboxItem[] = [
  { id: "i-1", workspaceId: "ws-1", from: "unknown@realty.com", subject: "Interested in commercial listing", preview: "I saw your listing on 5th Ave and would like to discuss...", classification: "opportunity", recommendedAction: "Add to contacts and respond", handled: false, date: "2026-02-05" },
  { id: "i-2", workspaceId: "ws-1", from: "spam@offers.net", subject: "Amazing deal!!!", preview: "Exclusive opportunity to buy leads at 50% off...", classification: "noise", recommendedAction: "Mark as spam", handled: false, date: "2026-02-04" },
  { id: "i-3", workspaceId: "ws-2", from: "legal@competitor.co", subject: "Regarding your recent client engagement", preview: "We believe there may be a conflict of interest regarding...", classification: "risk", recommendedAction: "Review with legal team", handled: false, date: "2026-02-03" },
  { id: "i-4", workspaceId: "ws-3", from: "press@techblog.com", subject: "Feature request for Gravitas review", preview: "We'd love to write about Gravitas for our upcoming...", classification: "reputation", recommendedAction: "Respond and schedule interview", handled: false, date: "2026-02-05" },
]

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
}

const WorkspaceContext = createContext<WorkspaceContextType | null>(null)

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(DEFAULT_WORKSPACES)
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(DEFAULT_WORKSPACES[0])
  const [contacts, setContacts] = useState<Contact[]>(DEMO_CONTACTS)
  const [pipeline, setPipeline] = useState<PipelineItem[]>(DEMO_PIPELINE)
  const [tasks, setTasks] = useState<Task[]>(DEMO_TASKS)
  const [inbox, setInbox] = useState<InboxItem[]>(DEMO_INBOX)
  const [activePage, setActivePage] = useState("contacts")

  const createWorkspace = useCallback((name: string, type: WorkspaceType) => {
    const newWs: Workspace = {
      id: `ws-${Date.now()}`,
      name,
      type,
      color: COLORS[workspaces.length % COLORS.length],
    }
    setWorkspaces((prev) => [...prev, newWs])
    setCurrentWorkspace(newWs)
  }, [workspaces.length])

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
        activePage, setActivePage,
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
