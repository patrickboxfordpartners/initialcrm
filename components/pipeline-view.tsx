"use client"

import { useWorkspace, type PipelineItem } from "@/lib/workspace-context"
import { Kanban, GripVertical, Calendar, Shield } from "lucide-react"

const STAGES: { id: PipelineItem["stage"]; label: string }[] = [
  { id: "new", label: "New" },
  { id: "active", label: "Active" },
  { id: "hot", label: "Hot" },
  { id: "under_contract", label: "Under Contract" },
  { id: "closed", label: "Closed" },
]

const STAGE_COLORS: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  hot: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  under_contract: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  closed: "bg-secondary text-muted-foreground border-border",
}

function PipelineCard({ item }: { item: PipelineItem }) {
  return (
    <div className="group p-3 rounded-lg bg-card border border-border hover:border-ring transition-all hover:-translate-y-0.5 cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{item.contactName}</p>
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>{item.lastTouch}</span>
          </div>
        </div>
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      </div>
      <p className="text-xs text-muted-foreground mt-2 line-clamp-1">{item.nextAction}</p>
      {item.credibilityScore > 0 && (
        <div className="flex items-center gap-1.5 mt-2">
          <Shield className="h-3 w-3 text-muted-foreground" />
          <span className={`text-xs font-medium ${
            item.credibilityScore >= 80 ? "text-emerald-400" :
            item.credibilityScore >= 50 ? "text-amber-400" : "text-red-400"
          }`}>
            {item.credibilityScore}
          </span>
        </div>
      )}
    </div>
  )
}

export function PipelineView() {
  const { pipeline, currentWorkspace } = useWorkspace()

  const wsPipeline = pipeline.filter((p) => p.workspaceId === currentWorkspace?.id)

  if (!currentWorkspace) return null

  if (wsPipeline.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
          <Kanban className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No active pipeline items</h3>
        <p className="text-sm text-muted-foreground">Add a contact and move them into your workflow.</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-x-auto p-6">
      <div className="flex gap-4 min-w-max">
        {STAGES.map((stage) => {
          const stageItems = wsPipeline.filter((p) => p.stage === stage.id)
          return (
            <div key={stage.id} className="w-64 shrink-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium border ${STAGE_COLORS[stage.id]}`}>
                    {stage.label}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{stageItems.length}</span>
              </div>
              <div className="space-y-2">
                {stageItems.map((item) => (
                  <PipelineCard key={item.id} item={item} />
                ))}
              </div>
              {stageItems.length === 0 && (
                <div className="p-4 rounded-lg border border-dashed border-border text-center">
                  <p className="text-xs text-muted-foreground">No items</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
