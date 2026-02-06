"use client"

import { useWorkspace } from "@/lib/workspace-context"
import { Settings, Link2, Tag, Kanban } from "lucide-react"

export function SettingsView() {
  const { currentWorkspace } = useWorkspace()

  if (!currentWorkspace) return null

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-2xl">
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Workspace</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Workspace Name</label>
            <input
              type="text"
              defaultValue={currentWorkspace.name}
              className="w-full px-3 py-2 text-sm rounded-md bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Workspace Type</label>
            <select
              defaultValue={currentWorkspace.type}
              className="w-full px-3 py-2 text-sm rounded-md bg-secondary border-0 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="Real Estate">Real Estate</option>
              <option value="Consulting">Consulting</option>
              <option value="Product">Product</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Link2 className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Integrations</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
            <div>
              <p className="text-sm font-medium text-foreground">Gravitas</p>
              <p className="text-xs text-muted-foreground">Route inbound inquiries to your inbox</p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400">Connected</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
            <div>
              <p className="text-sm font-medium text-foreground">Email</p>
              <p className="text-xs text-muted-foreground">Sync email activity to contact timelines</p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-secondary text-muted-foreground border border-border">Not Connected</span>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Default Tags</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {["investor", "buyer", "seller", "high-value", "first-time", "commercial", "referral"].map((tag) => (
            <span key={tag} className="px-2.5 py-1 rounded-full text-xs bg-secondary text-secondary-foreground">
              {tag}
            </span>
          ))}
        </div>
      </section>

      <div className="border-t border-border" />

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Kanban className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Pipeline Stages</h3>
        </div>
        <div className="space-y-2">
          {["New", "Active", "Hot", "Under Contract", "Closed"].map((stage) => (
            <div key={stage} className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary">
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
              <span className="text-sm text-foreground">{stage}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
