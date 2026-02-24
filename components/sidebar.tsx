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
    <aside className="w-[240px] bg-sidebar flex flex-col shrink-0">
      <div className="px-5 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          {currentWorkspace && (
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: currentWorkspace.color }}
            />
          )}
          <span className="text-[11px] font-medium text-sidebar-foreground/70 truncate uppercase tracking-[0.15em]">
            {currentWorkspace?.name || "No workspace"}
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] transition-all duration-150 group ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <Icon className={`h-[18px] w-[18px] shrink-0 transition-colors ${isActive ? 'text-sidebar-accent-foreground' : 'text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70'}`} strokeWidth={1.5} />
              <span className="tracking-wide">{item.label}</span>
              {item.id === "inbox" && unhandledInbox > 0 && (
                <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded bg-destructive text-destructive-foreground leading-none">
                  {unhandledInbox}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="px-5 py-4 border-t border-sidebar-border">
        <p className="text-[10px] text-sidebar-foreground/30 uppercase tracking-[0.15em]">Boxford CRM</p>
      </div>
    </aside>
  )
}
