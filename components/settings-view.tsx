"use client"

import { useWorkspace } from "@/lib/workspace-context"
import { Settings, Link2, Tag, Kanban } from "lucide-react"

export function SettingsView() {
  const { currentWorkspace } = useWorkspace()

  if (!currentWorkspace) return null

  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 max-w-2xl">
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <Settings className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          <h3 className="text-[13px] font-semibold text-foreground">Workspace</h3>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-[11px] font-medium text-muted-foreground block mb-1.5 uppercase tracking-[0.1em]">Workspace Name</label>
            <input
              type="text"
              defaultValue={currentWorkspace.name}
              className="w-full px-3 py-2 text-[13px] rounded-md bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/30 transition-all"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-muted-foreground block mb-1.5 uppercase tracking-[0.1em]">Workspace Type</label>
            <select
              defaultValue={currentWorkspace.type}
              className="w-full px-3 py-2 text-[13px] rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/30 transition-all"
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

      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <Link2 className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          <h3 className="text-[13px] font-semibold text-foreground">Integrations</h3>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border">
            <div>
              <p className="text-[13px] font-medium text-foreground">Gravitas</p>
              <p className="text-[11px] text-muted-foreground">Route inbound inquiries to your inbox</p>
            </div>
            <span className="px-2.5 py-1 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-[0.1em]">Connected</span>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border">
            <div>
              <p className="text-[13px] font-medium text-foreground">Email</p>
              <p className="text-[11px] text-muted-foreground">Sync email activity to contact timelines</p>
            </div>
            <span className="px-2.5 py-1 rounded text-[10px] font-semibold bg-secondary text-muted-foreground border border-border uppercase tracking-[0.1em]">Not Connected</span>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <Tag className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          <h3 className="text-[13px] font-semibold text-foreground">Default Tags</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {["investor", "buyer", "seller", "high-value", "first-time", "commercial", "referral"].map((tag) => (
            <span key={tag} className="px-2.5 py-1 rounded text-[11px] bg-secondary text-foreground border border-border font-medium">
              {tag}
            </span>
          ))}
        </div>
      </section>

      <div className="border-t border-border" />

      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <Kanban className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          <h3 className="text-[13px] font-semibold text-foreground">Pipeline Stages</h3>
        </div>
        <div className="flex flex-col gap-2">
          {["New", "Active", "Hot", "Under Contract", "Closed"].map((stage) => (
            <div key={stage} className="flex items-center gap-3 p-3 rounded-md bg-card border border-border">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
              <span className="text-[13px] text-foreground">{stage}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
