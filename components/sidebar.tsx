"use client"

import { useWorkspace } from "@/lib/workspace-context"
import { Users, Kanban, CheckSquare, Inbox, BarChart3, Settings } from "lucide-react"

const NAV_ITEMS = [
  { id: "contacts", label: "Contacts", icon: Users },
  { id: "pipeline", label: "Pipeline", icon: Kanban },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "inbox", label: "Inbox", icon: Inbox },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
  const { activePage, setActivePage, currentWorkspace, inbox } = useWorkspace()

  const unhandledInbox = inbox.filter(
    (item) => item.workspaceId === currentWorkspace?.id && !item.handled
  ).length

  return (
    <aside className="w-60 border-r border-border bg-card/30 backdrop-blur-sm flex flex-col shrink-0">
      <div className="px-4 py-4 border-b border-border/50">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-secondary/50 border border-border/50">
          {currentWorkspace && (
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-background"
              style={{ backgroundColor: currentWorkspace.color }}
            />
          )}
          <span className="text-xs font-semibold text-foreground/90 truncate uppercase tracking-wider">
            {currentWorkspace?.name || "No workspace"}
          </span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group ${
                isActive
                  ? "bg-primary/10 text-foreground font-medium ring-1 ring-primary/20 shadow-sm"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? 'text-primary' : 'group-hover:text-foreground'}`} />
              <span>{item.label}</span>
              {item.id === "inbox" && unhandledInbox > 0 && (
                <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-md bg-destructive/90 text-destructive-foreground shadow-sm">
                  {unhandledInbox}
                </span>
              )}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
