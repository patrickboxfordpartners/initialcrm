"use client"

import { useState } from "react"
import { useWorkspace } from "@/lib/workspace-context"
import { CheckSquare, Plus, Calendar, User, Check } from "lucide-react"

export function TasksView() {
  const { tasks, toggleTask, currentWorkspace } = useWorkspace()
  const [filter, setFilter] = useState<"all" | "today" | "overdue" | "completed">("all")

  const wsTasks = tasks.filter((t) => t.workspaceId === currentWorkspace?.id)
  const now = new Date("2026-02-05")

  const filtered = wsTasks.filter((t) => {
    if (filter === "completed") return t.completed
    if (filter === "today") return !t.completed && t.dueDate === "2026-02-05"
    if (filter === "overdue") return !t.completed && new Date(t.dueDate) < now
    return true
  })

  const overdueCount = wsTasks.filter((t) => !t.completed && new Date(t.dueDate) < now).length

  if (!currentWorkspace) return null

  if (wsTasks.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 animate-fade-in">
        <div className="w-16 h-16 rounded-xl bg-secondary border border-border flex items-center justify-center">
          <CheckSquare className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
        </div>
        <div className="text-center flex flex-col gap-1.5 max-w-md">
          <h3 className="text-lg font-serif font-semibold text-foreground">No Tasks Yet</h3>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            Create tasks to stay organized and track follow-ups. Link tasks to contacts and never miss an opportunity.
          </p>
        </div>
        <button className="mt-2 px-5 py-2.5 text-[13px] font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create First Task
        </button>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-card flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {(["all", "today", "overdue", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] rounded-md transition-all ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {f === "all" ? "All" : f === "today" ? "Due Today" : f === "overdue" ? `Overdue${overdueCount > 0 ? ` (${overdueCount})` : ""}` : "Completed"}
            </button>
          ))}
        </div>
        <button className="px-4 py-2 text-[13px] font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-border/60">
          {filtered.map((task) => {
            const isOverdue = !task.completed && new Date(task.dueDate) < now
            return (
              <div
                key={task.id}
                className="px-6 py-4 flex items-start gap-4 hover:bg-secondary/30 transition-all group"
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    task.completed
                      ? "bg-primary border-primary"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  {task.completed && <Check className="h-3 w-3 text-primary-foreground" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] font-medium leading-relaxed ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {task.description}
                  </p>
                  {task.linkedContactName && (
                    <div className="flex items-center gap-2 mt-2 px-2.5 py-1.5 rounded-md bg-secondary border border-border w-fit">
                      <User className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
                      <span className="text-[11px] font-medium text-foreground">{task.linkedContactName}</span>
                    </div>
                  )}
                </div>
                <div className={`flex items-center gap-2 text-[11px] font-medium shrink-0 px-2.5 py-1.5 rounded-md border ${
                  isOverdue
                    ? "bg-red-50 text-red-700 border-red-200"
                    : task.completed
                    ? "bg-secondary text-muted-foreground border-border"
                    : "bg-background text-foreground/70 border-border"
                }`}>
                  <Calendar className="h-3.5 w-3.5" strokeWidth={1.5} />
                  <span>{task.dueDate}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
