"use client"

import { useWorkspace } from "@/lib/workspace-context"
import { Inbox, Check, UserPlus, AlertTriangle, Sparkles, Shield, Volume2, ExternalLink } from "lucide-react"

const CLASSIFICATION_CONFIG: Record<string, { label: string; color: string; bgColor: string; icon: typeof AlertTriangle }> = {
  noise: { label: "Noise", color: "text-muted-foreground", bgColor: "bg-secondary/80 ring-border", icon: Volume2 },
  risk: { label: "Risk", color: "text-red-400", bgColor: "bg-red-500/15 ring-red-500/30", icon: AlertTriangle },
  opportunity: { label: "Opportunity", color: "text-emerald-400", bgColor: "bg-emerald-500/15 ring-emerald-500/30", icon: Sparkles },
  reputation: { label: "Reputation", color: "text-blue-400", bgColor: "bg-blue-500/15 ring-blue-500/30", icon: Shield },
}

export function InboxView() {
  const { inbox, handleInboxItem, currentWorkspace } = useWorkspace()

  const wsInbox = inbox.filter((item) => item.workspaceId === currentWorkspace?.id)
  const unhandled = wsInbox.filter((item) => !item.handled)
  const handled = wsInbox.filter((item) => item.handled)

  if (!currentWorkspace) return null

  if (wsInbox.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 animate-fade-in">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-secondary/50 border border-border/50 flex items-center justify-center backdrop-blur-sm">
            <Inbox className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="absolute -top-1 -right-1 w-7 h-7 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
        </div>
        <div className="text-center space-y-2 max-w-md">
          <h3 className="text-lg font-semibold text-foreground">Inbox is Empty</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your Gravitas widget will automatically classify and route inquiries here. Get notified of opportunities, risks, and reputation signals in real-time.
          </p>
        </div>
        <a
          href="https://gravitas.example.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 px-5 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          Configure Gravitas Widget
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {unhandled.length > 0 && (
        <div>
          <div className="px-6 py-3 border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Requires Action
              </span>
              <span className="px-2 py-1 rounded-md text-[10px] font-semibold bg-primary/10 text-primary ring-1 ring-primary/30">
                {unhandled.length} unhandled
              </span>
            </div>
          </div>
          <div className="divide-y divide-border/30">
            {unhandled.map((item) => {
              const config = CLASSIFICATION_CONFIG[item.classification]
              const Icon = config.icon
              return (
                <div key={item.id} className="px-6 py-5 hover:bg-secondary/30 transition-all duration-150 group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider ring-1 ${config.bgColor} ${config.color}`}>
                          <Icon className="h-3 w-3" />
                          {config.label}
                        </span>
                        <span className="text-xs text-muted-foreground">{item.date}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-1">{item.subject}</p>
                        <p className="text-xs text-muted-foreground">From: <span className="text-foreground/80">{item.from}</span></p>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{item.preview}</p>
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <p className="text-xs font-medium text-foreground/90">
                          <span className="text-primary">Recommended:</span> {item.recommendedAction}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        className="p-2.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all border border-border/50 hover:border-border"
                        title="Add to Contacts"
                      >
                        <UserPlus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleInboxItem(item.id)}
                        className="p-2.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all border border-primary/30 hover:border-primary/50"
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
          <div className="px-6 py-3 border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-10">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Handled ({handled.length})
            </span>
          </div>
          <div className="divide-y divide-border/30">
            {handled.map((item) => {
              const config = CLASSIFICATION_CONFIG[item.classification]
              const Icon = config.icon
              return (
                <div key={item.id} className="px-6 py-4 opacity-40">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ring-1 ${config.bgColor} ${config.color}`}>
                      <Icon className="h-3 w-3" />
                      {config.label}
                    </span>
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  </div>
                  <p className="text-sm text-foreground line-through">{item.subject}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">From: {item.from}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
