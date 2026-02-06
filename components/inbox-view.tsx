"use client"

import { useWorkspace } from "@/lib/workspace-context"
import { Inbox, Check, UserPlus, AlertTriangle, Sparkles, Shield, Volume2 } from "lucide-react"

const CLASSIFICATION_CONFIG: Record<string, { label: string; color: string; icon: typeof AlertTriangle }> = {
  noise: { label: "Noise", color: "bg-secondary text-muted-foreground", icon: Volume2 },
  risk: { label: "Risk", color: "bg-red-500/10 text-red-400", icon: AlertTriangle },
  opportunity: { label: "Opportunity", color: "bg-emerald-500/10 text-emerald-400", icon: Sparkles },
  reputation: { label: "Reputation", color: "bg-blue-500/10 text-blue-400", icon: Shield },
}

export function InboxView() {
  const { inbox, handleInboxItem, currentWorkspace } = useWorkspace()

  const wsInbox = inbox.filter((item) => item.workspaceId === currentWorkspace?.id)
  const unhandled = wsInbox.filter((item) => !item.handled)
  const handled = wsInbox.filter((item) => item.handled)

  if (!currentWorkspace) return null

  if (wsInbox.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
          <Inbox className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No inquiries yet</h3>
        <p className="text-sm text-muted-foreground">Your Gravitas widget will route inquiries here.</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {unhandled.length > 0 && (
        <div>
          <div className="px-6 py-2 border-b border-border">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Unhandled ({unhandled.length})
            </span>
          </div>
          <div className="divide-y divide-border">
            {unhandled.map((item) => {
              const config = CLASSIFICATION_CONFIG[item.classification]
              const Icon = config.icon
              return (
                <div key={item.id} className="px-6 py-4 hover:bg-accent/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${config.color}`}>
                          <Icon className="h-3 w-3" />
                          {config.label}
                        </span>
                        <span className="text-xs text-muted-foreground">{item.date}</span>
                      </div>
                      <p className="text-sm font-medium text-foreground">{item.subject}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">From: {item.from}</p>
                      <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{item.preview}</p>
                      <p className="text-xs text-muted-foreground mt-2 italic">Recommended: {item.recommendedAction}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button className="p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors" title="Add to Contact">
                        <UserPlus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleInboxItem(item.id)}
                        className="p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                        title="Mark as Handled"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {handled.length > 0 && (
        <div>
          <div className="px-6 py-2 border-b border-border">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Handled ({handled.length})
            </span>
          </div>
          <div className="divide-y divide-border">
            {handled.map((item) => {
              const config = CLASSIFICATION_CONFIG[item.classification]
              const Icon = config.icon
              return (
                <div key={item.id} className="px-6 py-4 opacity-50">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${config.color}`}>
                      <Icon className="h-3 w-3" />
                      {config.label}
                    </span>
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  </div>
                  <p className="text-sm text-foreground line-through">{item.subject}</p>
                  <p className="text-xs text-muted-foreground">From: {item.from}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
