"use client"

import { useState } from "react"
import { useWorkspace, type PipelineItem } from "@/lib/workspace-context"
import { Kanban, Calendar, Shield, Plus, X, ChevronDown } from "lucide-react"

const STAGES: { id: PipelineItem["stage"]; label: string }[] = [
  { id: "new", label: "New" },
  { id: "active", label: "Active" },
  { id: "hot", label: "Hot" },
  { id: "under_contract", label: "Under Contract" },
  { id: "closed", label: "Closed" },
]

const STAGE_COLORS: Record<string, string> = {
  new: "bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30",
  active: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30",
  hot: "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30",
  under_contract: "bg-violet-500/15 text-violet-400 ring-1 ring-violet-500/30",
  closed: "bg-secondary text-muted-foreground ring-1 ring-border",
}

function PipelineCard({ item }: { item: PipelineItem }) {
  const { movePipelineItem, removePipelineItem } = useWorkspace()
  const [showMove, setShowMove] = useState(false)
  const [removing, setRemoving] = useState(false)

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 bg-emerald-500/15"
    if (score >= 50) return "text-amber-400 bg-amber-500/15"
    return "text-red-400 bg-red-500/15"
  }

  const handleMove = async (stage: PipelineItem["stage"]) => {
    setShowMove(false)
    await movePipelineItem(item.id, stage)
  }

  const handleRemove = async () => {
    setRemoving(true)
    await removePipelineItem(item.id)
  }

  return (
    <div className="group relative p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:bg-card/70 transition-all hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-semibold text-foreground flex-1 min-w-0 pr-2">{item.contactName}</p>
        <div className="flex items-center gap-1 shrink-0">
          {/* Move stage dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMove(s => !s)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              title="Move stage"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {showMove && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMove(false)} />
                <div className="absolute right-0 top-full mt-1 w-44 rounded-xl border border-border bg-popover/95 backdrop-blur-sm shadow-2xl z-50 overflow-hidden">
                  <div className="p-1">
                    {STAGES.filter(s => s.id !== item.stage).map(s => (
                      <button
                        key={s.id}
                        onClick={() => handleMove(s.id)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
                      >
                        <span className={`w-2 h-2 rounded-full ${
                          s.id === "new" ? "bg-blue-400" :
                          s.id === "active" ? "bg-emerald-400" :
                          s.id === "hot" ? "bg-amber-400" :
                          s.id === "under_contract" ? "bg-violet-400" : "bg-muted-foreground"
                        }`} />
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          {/* Remove */}
          <button
            onClick={handleRemove}
            disabled={removing}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md text-muted-foreground hover:text-red-400 hover:bg-red-500/10 disabled:opacity-50"
            title="Remove from pipeline"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span>{item.lastTouch}</span>
        </div>

        {item.nextAction && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 bg-secondary/50 rounded-lg px-2.5 py-2 border border-border/50">
            {item.nextAction}
          </p>
        )}

        {item.credibilityScore > 0 && (
          <div className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg ring-1 ${getScoreColor(item.credibilityScore)}`}>
            <div className="flex items-center gap-1.5">
              <Shield className="h-3 w-3" />
              <span className="text-[10px] font-semibold uppercase tracking-wider">Credibility</span>
            </div>
            <span className="text-xs font-bold">{item.credibilityScore}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export function PipelineView() {
  const { pipeline, currentWorkspace, setActivePage } = useWorkspace()

  const wsPipeline = pipeline.filter(p => p.workspaceId === currentWorkspace?.id)

  if (!currentWorkspace) return null

  if (wsPipeline.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 animate-fade-in">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-secondary/50 border border-border/50 flex items-center justify-center backdrop-blur-sm">
            <Kanban className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="absolute -top-1 -right-1 w-7 h-7 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Plus className="h-4 w-4 text-primary" />
          </div>
        </div>
        <div className="text-center space-y-2 max-w-md">
          <h3 className="text-lg font-semibold text-foreground">Pipeline is empty</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Open a contact in the Contacts view and click "Add to Pipeline" to track it here.
          </p>
        </div>
        <button
          onClick={() => setActivePage("contacts")}
          className="mt-2 px-5 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          Go to Contacts
        </button>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden">
      <div className="flex gap-4 p-6 min-w-max h-full">
        {STAGES.map(stage => {
          const stageItems = wsPipeline.filter(p => p.stage === stage.id)
          return (
            <div key={stage.id} className="w-72 shrink-0 flex flex-col">
              <div className="flex items-center justify-between mb-4 px-1">
                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider ${STAGE_COLORS[stage.id]}`}>
                  {stage.label}
                </span>
                <span className="px-2 py-1 rounded-md text-xs font-semibold bg-secondary/80 text-muted-foreground ring-1 ring-border">
                  {stageItems.length}
                </span>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {stageItems.map(item => (
                  <PipelineCard key={item.id} item={item} />
                ))}

                {stageItems.length === 0 && (
                  <div className="p-8 rounded-xl border-2 border-dashed border-border/50 text-center bg-secondary/20">
                    <p className="text-xs text-muted-foreground">Empty</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
