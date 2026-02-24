"use client"

import { useState } from "react"
import { useWorkspace, type WorkspaceType } from "@/lib/workspace-context"
import { ChevronDown, Plus, Building2, X, Moon, Sun } from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { useTheme } from "next-themes"

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
  const { theme, setTheme } = useTheme()
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
    <header className="h-14 border-b border-border bg-card flex items-center px-6 gap-4 shrink-0">
      <div className="flex items-center gap-3">
        <span className="font-serif text-lg font-semibold text-foreground tracking-tight">Boxford</span>
        <span className="text-border">|</span>
        <span className="text-[13px] font-medium text-muted-foreground">{PAGE_TITLES[activePage] || "Contacts"}</span>
      </div>

      <div className="flex-1" />

      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        aria-label="Toggle dark mode"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </button>

      <UserButton afterSignOutUrl="/sign-in" />

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-md text-[13px] font-medium text-foreground bg-background hover:bg-secondary transition-all duration-150 border border-border"
        >
          {currentWorkspace && (
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: currentWorkspace.color }}
            />
          )}
          <span className="truncate max-w-[140px]">{currentWorkspace?.name || "Select Workspace"}</span>
          <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setShowCreate(false) }} />
            <div className="absolute right-0 top-full mt-2 w-72 rounded-lg border border-border bg-popover shadow-xl z-50 animate-fade-in overflow-hidden">
              <div className="p-1.5">
                <div className="text-[10px] font-medium text-muted-foreground px-3 py-2 uppercase tracking-[0.15em]">Workspaces</div>
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => { setCurrentWorkspace(ws); setOpen(false); setShowCreate(false) }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] transition-all duration-150 ${
                      currentWorkspace?.id === ws.id
                        ? "bg-primary/5 text-foreground font-medium"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: ws.color }}
                    />
                    <span>{ws.name}</span>
                    <span className="ml-auto text-[10px] text-muted-foreground/60 uppercase tracking-[0.1em]">{ws.type}</span>
                  </button>
                ))}
              </div>
              <div className="border-t border-border p-1.5">
                {!showCreate ? (
                  <button
                    onClick={() => setShowCreate(true)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-[13px] text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-150"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span className="font-medium">Create New Workspace</span>
                  </button>
                ) : (
                  <div className="p-3 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-foreground uppercase tracking-[0.1em]">New Workspace</span>
                      <button
                        onClick={() => setShowCreate(false)}
                        className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded hover:bg-secondary"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Workspace name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-3 py-2 text-[13px] rounded-md bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    />
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as WorkspaceType)}
                      className="w-full px-3 py-2 text-[13px] rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                    >
                      <option value="Real Estate">Real Estate</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Product">Product</option>
                      <option value="Other">Other</option>
                    </select>
                    <button
                      onClick={handleCreate}
                      disabled={!newName.trim()}
                      className="w-full px-3 py-2 text-[13px] font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
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
