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
    <aside className="w-56 border-r border-border bg-card flex flex-col shrink-0">
      <div className="px-3 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          {currentWorkspace && (
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: currentWorkspace.color }} />
          )}
          <span className="text-xs font-medium text-muted-foreground truncate">
            {currentWorkspace?.name || "No workspace"}
          </span>
        </div>
      </div>

      <nav className="flex-1 p-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-accent text-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
              {item.id === "inbox" && unhandledInbox > 0 && (
                <span className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-destructive text-destructive-foreground">
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
