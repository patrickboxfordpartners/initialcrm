"use client"

import { useWorkspace, type PipelineItem } from "@/lib/workspace-context"
import { Kanban, GripVertical, Calendar, Shield, Plus } from "lucide-react"

const STAGES: { id: PipelineItem["stage"]; label: string }[] = [
  { id: "new", label: "New" },
  { id: "active", label: "Active" },
  { id: "hot", label: "Hot" },
  { id: "under_contract", label: "Under Contract" },
  { id: "closed", label: "Closed" },
]

const STAGE_COLORS: Record<string, string> = {
  new: "bg-primary/5 text-primary border border-primary/15",
  active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  hot: "bg-amber-50 text-amber-700 border border-amber-200",
  under_contract: "bg-primary/10 text-primary border border-primary/20",
  closed: "bg-secondary text-muted-foreground border border-border",
}

function PipelineCard({ item }: { item: PipelineItem }) {
  const getScoreStyle = (score: number) => {
    if (score >= 80) return "text-emerald-700 bg-emerald-50 border-emerald-200"
    if (score >= 50) return "text-amber-700 bg-amber-50 border-amber-200"
    return "text-red-700 bg-red-50 border-red-200"
  }

  return (
    <div className="group p-4 rounded-lg bg-card border border-border hover:border-primary/20 transition-all cursor-move hover:shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <p className="text-[13px] font-medium text-foreground flex-1 min-w-0 pr-2">{item.contactName}</p>
        <GripVertical className="h-4 w-4 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" strokeWidth={1.5} />
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
          <span>{item.lastTouch}</span>
        </div>

        <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2 bg-secondary rounded-md px-2.5 py-2 border border-border">
          {item.nextAction}
        </p>

        {item.credibilityScore > 0 && (
          <div className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md border ${getScoreStyle(item.credibilityScore)}`}>
            <div className="flex items-center gap-1.5">
              <Shield className="h-3 w-3" strokeWidth={1.5} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em]">Credibility</span>
            </div>
            <span className="text-xs font-bold">{item.credibilityScore}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export function PipelineView() {
  const { pipeline, currentWorkspace } = useWorkspace()

  const wsPipeline = pipeline.filter((p) => p.workspaceId === currentWorkspace?.id)

  if (!currentWorkspace) return null

  if (wsPipeline.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 animate-fade-in">
        <div className="w-16 h-16 rounded-xl bg-secondary border border-border flex items-center justify-center">
          <Kanban className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
        </div>
        <div className="text-center flex flex-col gap-1.5 max-w-md">
          <h3 className="text-lg font-serif font-semibold text-foreground">No Pipeline Items</h3>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            Add contacts to your pipeline and track them through your sales stages. Move cards between stages to update their progress.
          </p>
        </div>
        <button className="mt-2 px-5 py-2.5 text-[13px] font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add to Pipeline
        </button>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden">
      <div className="flex gap-4 p-6 min-w-max h-full">
        {STAGES.map((stage) => {
          const stageItems = wsPipeline.filter((p) => p.stage === stage.id)
          return (
            <div key={stage.id} className="w-72 shrink-0 flex flex-col">
              <div className="flex items-center justify-between mb-4 px-1">
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-[0.1em] ${STAGE_COLORS[stage.id]}`}>
                  {stage.label}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold text-muted-foreground bg-secondary border border-border">
                  {stageItems.length}
                </span>
              </div>

              <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
                {stageItems.map((item) => (
                  <PipelineCard key={item.id} item={item} />
                ))}

                {stageItems.length === 0 && (
                  <div className="p-8 rounded-lg border-2 border-dashed border-border text-center">
                    <p className="text-[11px] text-muted-foreground">Drop here</p>
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
