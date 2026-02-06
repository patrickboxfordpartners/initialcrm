"use client"

import { useState } from "react"
import { useWorkspace, type WorkspaceType } from "@/lib/workspace-context"
import { ChevronDown, Plus, Building2, X } from "lucide-react"

const PAGE_TITLES: Record<string, string> = {
  contacts: "Contacts",
  pipeline: "Pipeline",
  tasks: "Tasks",
  inbox: "Inbox",
  analytics: "Analytics",
  settings: "Settings",
}

export function TopBar() {
  const { workspaces, currentWorkspace, setCurrentWorkspace, createWorkspace, activePage } = useWorkspace()
  const [open, setOpen] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState("")
  const [newType, setNewType] = useState<WorkspaceType>("Other")

  const handleCreate = () => {
    if (!newName.trim()) return
    createWorkspace(newName.trim(), newType)
    setNewName("")
    setNewType("Other")
    setShowCreate(false)
    setOpen(false)
  }

  return (
    <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-4 shrink-0">
      <div className="flex items-center gap-2">
        <Building2 className="h-5 w-5 text-foreground" />
        <span className="font-semibold text-sm text-foreground tracking-tight">InitialCRM</span>
      </div>

      <div className="flex-1 flex justify-center">
        <span className="text-sm font-medium text-muted-foreground">{PAGE_TITLES[activePage] || "Contacts"}</span>
      </div>

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-foreground bg-secondary hover:bg-accent transition-colors"
        >
          {currentWorkspace && (
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: currentWorkspace.color }} />
          )}
          <span className="truncate max-w-[140px]">{currentWorkspace?.name || "Select Workspace"}</span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setShowCreate(false) }} />
            <div className="absolute right-0 top-full mt-1 w-64 rounded-lg border border-border bg-popover shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="p-1.5">
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => { setCurrentWorkspace(ws); setOpen(false); setShowCreate(false) }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                      currentWorkspace?.id === ws.id
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: ws.color }} />
                    <span>{ws.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{ws.type}</span>
                  </button>
                ))}
              </div>
              <div className="border-t border-border p-1.5">
                {!showCreate ? (
                  <button
                    onClick={() => setShowCreate(true)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Create New Workspace</span>
                  </button>
                ) : (
                  <div className="p-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-foreground">New Workspace</span>
                      <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Workspace name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-sm rounded-md bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    />
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as WorkspaceType)}
                      className="w-full px-2.5 py-1.5 text-sm rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      <option value="Real Estate">Real Estate</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Product">Product</option>
                      <option value="Other">Other</option>
                    </select>
                    <button
                      onClick={handleCreate}
                      disabled={!newName.trim()}
                      className="w-full px-3 py-1.5 text-sm font-medium rounded-md bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-40"
                    >
                      Create Workspace
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
