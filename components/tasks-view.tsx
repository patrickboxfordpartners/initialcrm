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
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
          <CheckSquare className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No tasks yet</h3>
        <p className="text-sm text-muted-foreground">Create your first task to stay organized.</p>
        <button className="mt-2 px-4 py-2 text-sm font-medium rounded-md bg-foreground text-background hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4 inline-block mr-1.5" />
          Add Task
        </button>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-1">
          {(["all", "today", "overdue", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === f
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              {f === "all" ? "All" : f === "today" ? "Due Today" : f === "overdue" ? `Overdue${overdueCount > 0 ? ` (${overdueCount})` : ""}` : "Completed"}
            </button>
          ))}
        </div>
        <button className="px-3 py-1.5 text-sm font-medium rounded-md bg-foreground text-background hover:opacity-90 transition-opacity flex items-center gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Add Task
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-border">
          {filtered.map((task) => {
            const isOverdue = !task.completed && new Date(task.dueDate) < now
            return (
              <div
                key={task.id}
                className="px-6 py-3 flex items-center gap-3 hover:bg-accent/30 transition-colors"
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    task.completed
                      ? "bg-foreground border-foreground"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  {task.completed && <Check className="h-3 w-3 text-background" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {task.description}
                  </p>
                  {task.linkedContactName && (
                    <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{task.linkedContactName}</span>
                    </div>
                  )}
                </div>
                <div className={`flex items-center gap-1 text-xs shrink-0 ${
                  isOverdue ? "text-red-400" : "text-muted-foreground"
                }`}>
                  <Calendar className="h-3 w-3" />
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
