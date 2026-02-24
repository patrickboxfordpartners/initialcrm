"use client"

import { useWorkspace } from "@/lib/workspace-context"
import { Inbox, Check, UserPlus, AlertTriangle, Sparkles, Shield, Volume2, ExternalLink } from "lucide-react"

const CLASSIFICATION_CONFIG: Record<string, { label: string; color: string; bgColor: string; icon: typeof AlertTriangle }> = {
  noise: { label: "Noise", color: "text-muted-foreground", bgColor: "bg-secondary border-border", icon: Volume2 },
  risk: { label: "Risk", color: "text-red-700", bgColor: "bg-red-50 border-red-200", icon: AlertTriangle },
  opportunity: { label: "Opportunity", color: "text-emerald-700", bgColor: "bg-emerald-50 border-emerald-200", icon: Sparkles },
  reputation: { label: "Reputation", color: "text-primary", bgColor: "bg-primary/5 border-primary/15", icon: Shield },
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
        <div className="w-16 h-16 rounded-xl bg-secondary border border-border flex items-center justify-center">
          <Inbox className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
        </div>
        <div className="text-center flex flex-col gap-1.5 max-w-md">
          <h3 className="text-lg font-serif font-semibold text-foreground">Inbox is Empty</h3>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            Your Gravitas widget will automatically classify and route inquiries here. Get notified of opportunities, risks, and reputation signals in real-time.
          </p>
        </div>
        <a
          href="https://gravitas.example.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 px-5 py-2.5 text-[13px] font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-2"
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
          <div className="px-6 py-3 border-b border-border bg-card sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">
                Requires Action
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/5 text-primary border border-primary/15">
                {unhandled.length} unhandled
              </span>
            </div>
          </div>
          <div className="divide-y divide-border/60">
            {unhandled.map((item) => {
              const config = CLASSIFICATION_CONFIG[item.classification]
              const Icon = config.icon
              return (
                <div key={item.id} className="px-6 py-5 hover:bg-secondary/30 transition-all duration-150 group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-[0.1em] border ${config.bgColor} ${config.color}`}>
                          <Icon className="h-3 w-3" strokeWidth={1.5} />
                          {config.label}
                        </span>
                        <span className="text-[11px] text-muted-foreground">{item.date}</span>
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-foreground mb-1">{item.subject}</p>
                        <p className="text-[11px] text-muted-foreground">From: <span className="text-foreground/80">{item.from}</span></p>
                      </div>
                      <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-2">{item.preview}</p>
                      <div className="p-3 rounded-md bg-primary/[0.03] border border-primary/10">
                        <p className="text-[12px] font-medium text-foreground/80">
                          <span className="text-primary font-semibold">Recommended:</span> {item.recommendedAction}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        className="p-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-all border border-border"
                        title="Add to Contacts"
                      >
                        <UserPlus className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => handleInboxItem(item.id)}
                        className="p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                        title="Mark as Handled"
                      >
                        <Check className="h-4 w-4" strokeWidth={1.5} />
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
          <div className="px-6 py-3 border-b border-border bg-card sticky top-0 z-10">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">
              Handled ({handled.length})
            </span>
          </div>
          <div className="divide-y divide-border/60">
            {handled.map((item) => {
              const config = CLASSIFICATION_CONFIG[item.classification]
              const Icon = config.icon
              return (
                <div key={item.id} className="px-6 py-4 opacity-40">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-[0.1em] border ${config.bgColor} ${config.color}`}>
                      <Icon className="h-3 w-3" strokeWidth={1.5} />
                      {config.label}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{item.date}</span>
                  </div>
                  <p className="text-[13px] text-foreground line-through">{item.subject}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">From: {item.from}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
