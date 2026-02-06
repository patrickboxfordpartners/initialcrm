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
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-secondary/50 border border-border/50 flex items-center justify-center backdrop-blur-sm">
            <CheckSquare className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="absolute -top-1 -right-1 w-7 h-7 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Plus className="h-4 w-4 text-primary" />
          </div>
        </div>
        <div className="text-center space-y-2 max-w-md">
          <h3 className="text-lg font-semibold text-foreground">No Tasks Yet</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Create tasks to stay organized and track follow-ups. Link tasks to contacts and never miss an opportunity.
          </p>
        </div>
        <button className="mt-2 px-5 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create First Task
        </button>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-6 py-4 border-b border-border/50 bg-card/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {(["all", "today", "overdue", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-2 text-[10px] font-semibold uppercase tracking-wider rounded-lg transition-all ${
                filter === f
                  ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              {f === "all" ? "All" : f === "today" ? "Due Today" : f === "overdue" ? `Overdue${overdueCount > 0 ? ` (${overdueCount})` : ""}` : "Completed"}
            </button>
          ))}
        </div>
        <button className="px-4 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-border/30">
          {filtered.map((task) => {
            const isOverdue = !task.completed && new Date(task.dueDate) < now
            return (
              <div
                key={task.id}
                className="px-6 py-4 flex items-start gap-4 hover:bg-secondary/30 transition-all group"
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    task.completed
                      ? "bg-primary border-primary shadow-sm"
                      : "border-border hover:border-primary/50 hover:bg-primary/5"
                  }`}
                >
                  {task.completed && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium leading-relaxed ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {task.description}
                  </p>
                  {task.linkedContactName && (
                    <div className="flex items-center gap-2 mt-2 px-2.5 py-1.5 rounded-lg bg-secondary/50 border border-border/50 w-fit">
                      <User className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-medium text-foreground/90">{task.linkedContactName}</span>
                    </div>
                  )}
                </div>
                <div className={`flex items-center gap-2 text-xs font-medium shrink-0 px-3 py-1.5 rounded-lg ring-1 ${
                  isOverdue
                    ? "bg-red-500/15 text-red-400 ring-red-500/30"
                    : task.completed
                    ? "bg-secondary text-muted-foreground ring-border"
                    : "bg-primary/5 text-foreground/80 ring-border"
                }`}>
                  <Calendar className="h-3.5 w-3.5" />
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
