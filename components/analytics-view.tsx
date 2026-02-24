"use client"

import { useWorkspace } from "@/lib/workspace-context"
import { BarChart3, Users, Inbox, CheckSquare, TrendingUp } from "lucide-react"

function MetricCard({ label, value, icon: Icon, trend }: { label: string; value: string | number; icon: typeof Users; trend?: string }) {
  return (
    <div className="p-5 rounded-lg bg-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">{label}</span>
        <Icon className="h-4 w-4 text-muted-foreground/50" strokeWidth={1.5} />
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-serif font-bold text-foreground">{value}</span>
        {trend && (
          <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-0.5 mb-1.5">
            <TrendingUp className="h-3 w-3" strokeWidth={1.5} />
            {trend}
          </span>
        )}
      </div>
    </div>
  )
}

function BarChartSimple({ data, title }: { data: { label: string; value: number; color: string }[]; title: string }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="p-5 rounded-lg bg-card border border-border">
      <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em] mb-5">{title}</h4>
      <div className="flex flex-col gap-4">
        {data.map((item) => (
          <div key={item.label} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="text-foreground font-semibold">{item.value}</span>
            </div>
            <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(item.value / max) * 100}%`, backgroundColor: item.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AnalyticsView() {
  const { contacts, inbox, tasks, pipeline, currentWorkspace } = useWorkspace()

  if (!currentWorkspace) return null

  const wsContacts = contacts.filter((c) => c.workspaceId === currentWorkspace.id)
  const wsInbox = inbox.filter((i) => i.workspaceId === currentWorkspace.id)
  const wsTasks = tasks.filter((t) => t.workspaceId === currentWorkspace.id)
  const wsPipeline = pipeline.filter((p) => p.workspaceId === currentWorkspace.id)

  const completedTasks = wsTasks.filter((t) => t.completed).length
  const totalTasks = wsTasks.length

  const classificationData = [
    { label: "Opportunity", value: wsInbox.filter((i) => i.classification === "opportunity").length, color: "#0f7a4d" },
    { label: "Reputation", value: wsInbox.filter((i) => i.classification === "reputation").length, color: "#1a2236" },
    { label: "Risk", value: wsInbox.filter((i) => i.classification === "risk").length, color: "#dc2626" },
    { label: "Noise", value: wsInbox.filter((i) => i.classification === "noise").length, color: "#9ca3af" },
  ]

  const pipelineData = [
    { label: "New", value: wsPipeline.filter((p) => p.stage === "new").length, color: "#1a2236" },
    { label: "Active", value: wsPipeline.filter((p) => p.stage === "active").length, color: "#0f7a4d" },
    { label: "Hot", value: wsPipeline.filter((p) => p.stage === "hot").length, color: "#c2790a" },
    { label: "Under Contract", value: wsPipeline.filter((p) => p.stage === "under_contract").length, color: "#2d4a8a" },
    { label: "Closed", value: wsPipeline.filter((p) => p.stage === "closed").length, color: "#9ca3af" },
  ]

  const avgCredibility = wsContacts.length > 0
    ? Math.round(wsContacts.reduce((sum, c) => sum + c.credibilityScore, 0) / wsContacts.length)
    : 0

  if (wsContacts.length === 0 && wsInbox.length === 0 && wsTasks.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <div className="w-16 h-16 rounded-xl bg-secondary border border-border flex items-center justify-center">
          <BarChart3 className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-serif font-semibold text-foreground">No data yet</h3>
        <p className="text-[13px] text-muted-foreground">Analytics will appear once activity begins.</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Contacts" value={wsContacts.length} icon={Users} trend="+12%" />
        <MetricCard label="Total Inquiries" value={wsInbox.length} icon={Inbox} />
        <MetricCard label="Tasks Completed" value={`${completedTasks}/${totalTasks}`} icon={CheckSquare} />
        <MetricCard label="Avg Credibility" value={avgCredibility} icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BarChartSimple data={classificationData} title="Inquiry Classification" />
        <BarChartSimple data={pipelineData} title="Pipeline Distribution" />
      </div>
    </div>
  )
}
