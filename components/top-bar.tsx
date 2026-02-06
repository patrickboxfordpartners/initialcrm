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
    <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center px-6 gap-4 shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary/10">
          <Building2 className="h-4 w-4 text-primary" />
        </div>
        <span className="font-semibold text-sm text-foreground tracking-tight">boxfordCRM</span>
      </div>

      <div className="flex-1 flex justify-center">
        <span className="text-sm font-medium text-foreground/80">{PAGE_TITLES[activePage] || "Contacts"}</span>
      </div>

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-sm font-medium text-foreground bg-secondary/80 hover:bg-secondary transition-all duration-150 border border-border/50 shadow-sm hover:shadow"
        >
          {currentWorkspace && (
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-background"
              style={{ backgroundColor: currentWorkspace.color }}
            />
          )}
          <span className="truncate max-w-[140px]">{currentWorkspace?.name || "Select Workspace"}</span>
          <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setShowCreate(false) }} />
            <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-border bg-popover/95 backdrop-blur-sm shadow-2xl z-50 animate-fade-in overflow-hidden">
              <div className="p-1.5">
                <div className="text-xs font-medium text-muted-foreground px-3 py-2 uppercase tracking-wider">Workspaces</div>
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => { setCurrentWorkspace(ws); setOpen(false); setShowCreate(false) }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                      currentWorkspace?.id === ws.id
                        ? "bg-primary/10 text-foreground ring-1 ring-primary/20"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-background"
                      style={{ backgroundColor: ws.color }}
                    />
                    <span className="font-medium">{ws.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground/60 uppercase tracking-wide">{ws.type}</span>
                  </button>
                ))}
              </div>
              <div className="border-t border-border/50 p-1.5">
                {!showCreate ? (
                  <button
                    onClick={() => setShowCreate(true)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all duration-150"
                  >
                    <div className="flex items-center justify-center w-5 h-5 rounded-md bg-primary/10">
                      <Plus className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="font-medium">Create New Workspace</span>
                  </button>
                ) : (
                  <div className="p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground uppercase tracking-wider">New Workspace</span>
                      <button
                        onClick={() => setShowCreate(false)}
                        className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded hover:bg-secondary/50"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Workspace name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    />
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as WorkspaceType)}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    >
                      <option value="Real Estate">Real Estate</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Product">Product</option>
                      <option value="Other">Other</option>
                    </select>
                    <button
                      onClick={handleCreate}
                      disabled={!newName.trim()}
                      className="w-full px-3 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
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
