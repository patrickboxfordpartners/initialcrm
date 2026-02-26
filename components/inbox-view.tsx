"use client"

import { useState } from "react"
import { useWorkspace, type InboxItem } from "@/lib/workspace-context"
import { Inbox, Check, UserPlus, AlertTriangle, Sparkles, Shield, Volume2, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"

const CLASSIFICATION_CONFIG: Record<string, { label: string; color: string; bgColor: string; icon: typeof AlertTriangle }> = {
  noise: { label: "Noise", color: "text-muted-foreground", bgColor: "bg-secondary/80 ring-border", icon: Volume2 },
  risk: { label: "Risk", color: "text-red-400", bgColor: "bg-red-500/15 ring-red-500/30", icon: AlertTriangle },
  opportunity: { label: "Opportunity", color: "text-emerald-400", bgColor: "bg-emerald-500/15 ring-emerald-500/30", icon: Sparkles },
  reputation: { label: "Reputation", color: "text-blue-400", bgColor: "bg-blue-500/15 ring-blue-500/30", icon: Shield },
}

function SignalItem({ label, value }: { label: string; value: string }) {
  return (
    <li>
      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
      <p className="mt-0.5 text-sm text-foreground">{value}</p>
    </li>
  )
}

function SignalPanel({ item }: { item: InboxItem }) {
  const signals = item.signals ?? {}
  const hasSignals =
    signals.timelineClarity ||
    signals.locationSpecificity ||
    signals.propertyClarity ||
    (signals.readinessIndicators as string[] | undefined)?.length ||
    (signals.riskTriggers as string[] | undefined)?.length

  return (
    <div className="mt-4 space-y-4 border-t border-border/50 pt-4">
      {/* Full text */}
      {item.fullText && (
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Full Message</p>
          <div className="p-3 rounded-lg bg-secondary/40 border border-border/50 text-sm text-foreground leading-relaxed font-mono max-h-40 overflow-y-auto">
            {item.fullText}
          </div>
        </div>
      )}

      {/* Signal analysis */}
      {hasSignals && (
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Signal Analysis</p>
          <ul className="space-y-3">
            {signals.timelineClarity && (
              <SignalItem label="Timeline Clarity" value={signals.timelineClarity as string} />
            )}
            {signals.locationSpecificity && (
              <SignalItem label="Location Specificity" value={signals.locationSpecificity as string} />
            )}
            {signals.propertyClarity && (
              <SignalItem label="Property Clarity" value={signals.propertyClarity as string} />
            )}
            {(signals.readinessIndicators as string[] | undefined)?.length ? (
              <li>
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Readiness Indicators</span>
                <ul className="mt-1.5 space-y-1">
                  {(signals.readinessIndicators as string[]).map((indicator, i) => (
                    <li key={i} className="text-sm text-foreground flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                      {indicator}
                    </li>
                  ))}
                </ul>
              </li>
            ) : null}
            {(signals.riskTriggers as string[] | undefined)?.length ? (
              <li>
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Risk Triggers</span>
                <ul className="mt-1.5 space-y-1">
                  {(signals.riskTriggers as string[]).map((trigger, i) => (
                    <li key={i} className="text-sm text-foreground flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                      {trigger}
                    </li>
                  ))}
                </ul>
              </li>
            ) : null}
          </ul>
        </div>
      )}

      {/* Rationale */}
      {item.rationale && (
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Rationale</p>
          <p className="text-sm text-foreground/80 leading-relaxed">{item.rationale}</p>
        </div>
      )}
    </div>
  )
}

export function InboxView() {
  const { inbox, handleInboxItem, currentWorkspace } = useWorkspace()
  const [expandedId, setExpandedId] = useState<string | null>(null)

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
          href="https://gravitasindex.com"
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

  const hasDetail = (item: InboxItem) =>
    !!item.fullText || !!item.rationale || !!(item.signals && Object.keys(item.signals).length > 0)

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
              const isExpanded = expandedId === item.id
              const expandable = hasDetail(item)
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
                      {expandable && isExpanded && <SignalPanel item={item} />}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {expandable && (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          className="p-2.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all border border-border/50 hover:border-border"
                          title={isExpanded ? "Collapse" : "View Signal Detail"}
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                      )}
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
              const isExpanded = expandedId === item.id
              const expandable = hasDetail(item)
              return (
                <div key={item.id} className={`px-6 py-4 ${isExpanded ? '' : 'opacity-40'}`}>
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ring-1 ${config.bgColor} ${config.color}`}>
                          <Icon className="h-3 w-3" />
                          {config.label}
                        </span>
                        <span className="text-xs text-muted-foreground">{item.date}</span>
                      </div>
                      <p className="text-sm text-foreground line-through">{item.subject}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">From: {item.from}</p>
                      {expandable && isExpanded && <SignalPanel item={item} />}
                    </div>
                    {expandable && (
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all border border-border/50 hover:border-border shrink-0"
                        title={isExpanded ? "Collapse" : "View Signal Detail"}
                      >
                        {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
