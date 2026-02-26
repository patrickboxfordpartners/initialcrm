"use client"

import { useState, useRef } from "react"
import { useWorkspace, type Contact, type Activity } from "@/lib/workspace-context"
import {
  Search, Plus, User, Phone, Mail, Tag, ChevronRight, X, Calendar, Shield,
  Trash2, Pencil, Check, Download, GitBranch, MessageSquare, AlertCircle,
  Globe
} from "lucide-react"

// ─── Add Contact Modal ────────────────────────────────────────────────────────
function AddContactModal({ workspaceId, onClose, onCreate }: {
  workspaceId: string
  onClose: () => void
  onCreate: (contact: Contact) => void
}) {
  const { createContact } = useWorkspace()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: "", email: "", phone: "", status: "lead" as Contact["status"],
    source: "Manual entry", nextAction: "", nextActionDate: "", tags: "",
  })

  const submit = async () => {
    if (!form.name.trim() || !form.email.trim()) return
    setSaving(true)
    const result = await createContact({
      workspaceId,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      status: form.status,
      source: form.source.trim() || "Manual entry",
      nextAction: form.nextAction.trim(),
      nextActionDate: form.nextActionDate || "",
      tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      trustSignals: [],
      lastActivity: new Date().toISOString().split("T")[0],
      credibilityScore: 50,
    })
    setSaving(false)
    if (result) { onCreate(result); onClose() }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
          <h2 className="text-base font-semibold text-foreground">Add Contact</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-secondary/50 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Name *</label>
              <input
                autoFocus
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && submit()}
                placeholder="Full name"
                className="w-full px-3 py-2 text-sm rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email *</label>
              <input
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="email@example.com"
                type="email"
                className="w-full px-3 py-2 text-sm rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Phone</label>
              <input
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="555-555-5555"
                className="w-full px-3 py-2 text-sm rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as Contact["status"] }))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              >
                <option value="lead">Lead</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Source</label>
              <input
                value={form.source}
                onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                placeholder="Manual entry"
                className="w-full px-3 py-2 text-sm rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Next Action Date</label>
              <input
                value={form.nextActionDate}
                onChange={e => setForm(f => ({ ...f, nextActionDate: e.target.value }))}
                type="date"
                className="w-full px-3 py-2 text-sm rounded-lg bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Next Action</label>
              <input
                value={form.nextAction}
                onChange={e => setForm(f => ({ ...f, nextAction: e.target.value }))}
                placeholder="e.g. Send proposal"
                className="w-full px-3 py-2 text-sm rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Tags <span className="font-normal">(comma-separated)</span></label>
              <input
                value={form.tags}
                onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                placeholder="investor, warm, referral"
                className="w-full px-3 py-2 text-sm rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border/50">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!form.name.trim() || !form.email.trim() || saving}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Add Contact"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Log Activity Modal ───────────────────────────────────────────────────────
function LogActivityModal({ contact, onClose }: { contact: Contact; onClose: () => void }) {
  const { logActivity } = useWorkspace()
  const [type, setType] = useState<Activity["type"]>("call")
  const [description, setDescription] = useState("")
  const [saving, setSaving] = useState(false)

  const submit = async () => {
    if (!description.trim()) return
    setSaving(true)
    await logActivity(contact.id, type, description.trim())
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm rounded-2xl bg-card border border-border shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
          <h2 className="text-base font-semibold text-foreground">Log Activity</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-secondary/50 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground">Contact: <span className="text-foreground font-medium">{contact.name}</span></p>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Type</label>
            <div className="flex gap-2 flex-wrap">
              {(["call", "email", "text", "note"] as Activity["type"][]).map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                    type === t
                      ? "bg-primary/15 text-primary ring-1 ring-primary/40"
                      : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Notes</label>
            <textarea
              autoFocus
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What happened?"
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border/50">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!description.trim() || saving}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Log Activity"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Contact Detail Panel ─────────────────────────────────────────────────────
function ContactDetail({ contact, onClose, onDelete, onLogActivity }: {
  contact: Contact
  onClose: () => void
  onDelete: (id: string) => void
  onLogActivity: (contact: Contact) => void
}) {
  const { updateContact, addToPipeline, pipeline } = useWorkspace()
  const [confirming, setConfirming] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [editValues, setEditValues] = useState({
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    status: contact.status,
    nextAction: contact.nextAction,
    nextActionDate: contact.nextActionDate,
    tags: contact.tags.join(", "),
  })
  const [addingToPipeline, setAddingToPipeline] = useState(false)

  const inPipeline = pipeline.some(p => p.contactId === contact.id)
  const today = new Date().toISOString().split("T")[0]
  const isOverdue = contact.nextActionDate && contact.nextActionDate < today

  const save = async (field: string) => {
    const updates: Parameters<typeof updateContact>[1] = {}
    if (field === "name" && editValues.name.trim()) updates.name = editValues.name.trim()
    if (field === "email" && editValues.email.trim()) updates.email = editValues.email.trim()
    if (field === "phone") updates.phone = editValues.phone.trim()
    if (field === "status") updates.status = editValues.status
    if (field === "nextAction") updates.nextAction = editValues.nextAction.trim()
    if (field === "nextActionDate") updates.nextActionDate = editValues.nextActionDate
    if (field === "tags") updates.tags = editValues.tags.split(",").map(t => t.trim()).filter(Boolean)
    if (Object.keys(updates).length > 0) await updateContact(contact.id, updates)
    setEditing(null)
  }

  const handleAddToPipeline = async () => {
    if (inPipeline || addingToPipeline) return
    setAddingToPipeline(true)
    await addToPipeline(contact.id)
    setAddingToPipeline(false)
  }

  const getScoreColor = (score: number) => score >= 80 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-red-400"
  const getScoreBg = (score: number) => score >= 80 ? "from-emerald-500/20 to-emerald-500/0" : score >= 50 ? "from-amber-500/20 to-amber-500/0" : "from-red-500/20 to-red-500/0"

  const EditableField = ({ field, label, icon: Icon, type = "text", children }: {
    field: string; label: string; icon: React.ElementType; type?: string; children: React.ReactNode
  }) => (
    <div
      className="flex items-center gap-3 text-sm p-3 rounded-lg bg-secondary/50 border border-border/50 group cursor-pointer hover:border-primary/30 hover:bg-secondary/70 transition-all"
      onClick={() => !editing && setEditing(field)}
    >
      <Icon className="h-4 w-4 text-primary shrink-0" />
      <div className="flex-1 min-w-0">
        {editing === field ? (
          type === "select" ? (
            <select
              autoFocus
              value={(editValues as any)[field]}
              onChange={e => setEditValues(v => ({ ...v, [field]: e.target.value }))}
              onBlur={() => save(field)}
              className="w-full bg-transparent text-foreground focus:outline-none text-sm"
            >
              <option value="lead">Lead</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          ) : (
            <input
              autoFocus
              type={type}
              value={(editValues as any)[field]}
              onChange={e => setEditValues(v => ({ ...v, [field]: e.target.value }))}
              onKeyDown={e => { if (e.key === "Enter") save(field); if (e.key === "Escape") setEditing(null) }}
              onBlur={() => save(field)}
              className="w-full bg-transparent text-foreground focus:outline-none text-sm placeholder:text-muted-foreground"
              placeholder={label}
            />
          )
        ) : (
          children
        )}
      </div>
      {editing !== field && (
        <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      )}
    </div>
  )

  return (
    <div className="w-[420px] border-l border-border bg-card/30 backdrop-blur-sm flex flex-col shrink-0 animate-slide-in">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-semibold text-foreground">{contact.name}</h3>
            {isOverdue && (
              <span title="Next action overdue">
                <AlertCircle className="h-4 w-4 text-red-400" />
              </span>
            )}
          </div>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider mt-1 ${
            contact.status === "active" ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30" :
            contact.status === "lead" ? "bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30" :
            "bg-secondary text-muted-foreground ring-1 ring-border"
          }`}>
            {contact.status}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {confirming ? (
            <>
              <span className="text-xs text-muted-foreground mr-1">Delete?</span>
              <button onClick={() => { onDelete(contact.id); onClose() }} className="text-xs px-2 py-1 rounded-md bg-red-500/15 text-red-400 ring-1 ring-red-500/30 hover:bg-red-500/25 transition-colors">Yes</button>
              <button onClick={() => setConfirming(false)} className="text-xs px-2 py-1 rounded-md bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors">No</button>
            </>
          ) : (
            <button onClick={() => setConfirming(true)} className="text-muted-foreground hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10" title="Delete contact">
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-secondary/50">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 px-5 py-3 border-b border-border/30">
        <button
          onClick={() => onLogActivity(contact)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all border border-border/50"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          Log Activity
        </button>
        <button
          onClick={handleAddToPipeline}
          disabled={inPipeline || addingToPipeline}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all border border-border/50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <GitBranch className="h-3.5 w-3.5" />
          {inPipeline ? "In Pipeline" : addingToPipeline ? "Adding..." : "Add to Pipeline"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Credibility Score */}
        <section className={`p-4 rounded-xl bg-gradient-to-br ${getScoreBg(contact.credibilityScore)} border border-border/50`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Shield className="h-3.5 w-3.5" />
              Credibility Score
            </h4>
            <span className={`text-2xl font-bold ${getScoreColor(contact.credibilityScore)}`}>{contact.credibilityScore}</span>
          </div>
          <div className="w-full h-2 bg-secondary/50 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${contact.credibilityScore}%`,
                backgroundImage: contact.credibilityScore >= 80
                  ? "linear-gradient(to right, rgb(52,211,153), rgb(16,185,129))"
                  : contact.credibilityScore >= 50
                  ? "linear-gradient(to right, rgb(251,191,36), rgb(245,158,11))"
                  : "linear-gradient(to right, rgb(248,113,113), rgb(239,68,68))",
              }}
            />
          </div>
          {contact.trustSignals.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {contact.trustSignals.map(s => (
                <div key={s} className="text-xs text-foreground/80 flex items-center gap-2 bg-background/50 rounded-md px-2 py-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {s}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Editable Contact Info */}
        <section className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact Information <span className="normal-case font-normal text-muted-foreground/60">(click to edit)</span></h4>
          <div className="space-y-2">
            <EditableField field="name" label="Full name" icon={User}>
              <span className="text-foreground">{contact.name}</span>
            </EditableField>
            <EditableField field="email" label="Email" icon={Mail} type="email">
              <span className="text-foreground truncate">{contact.email}</span>
            </EditableField>
            <EditableField field="phone" label="Phone" icon={Phone}>
              <span className="text-foreground">{contact.phone || <span className="text-muted-foreground/50">—</span>}</span>
            </EditableField>
            <EditableField field="status" label="Status" icon={Shield} type="select">
              <span className={`capitalize font-medium ${
                contact.status === "active" ? "text-emerald-400" :
                contact.status === "lead" ? "text-blue-400" : "text-muted-foreground"
              }`}>{contact.status}</span>
            </EditableField>
            <EditableField field="tags" label="Tags (comma-separated)" icon={Tag}>
              <div className="flex gap-1 flex-wrap">
                {contact.tags.length > 0
                  ? contact.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded-md text-[10px] bg-background border border-border text-foreground/90">{t}</span>
                  ))
                  : <span className="text-muted-foreground/50 text-xs">—</span>
                }
              </div>
            </EditableField>
          </div>
        </section>

        {/* Source */}
        <section className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Source</h4>
          <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
            <p className="text-sm text-foreground/90">{contact.source || "—"}</p>
          </div>
        </section>

        {/* Next Action */}
        <section className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            Next Action
            {isOverdue && <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-red-500/15 text-red-400 ring-1 ring-red-500/30 font-semibold normal-case">Overdue</span>}
          </h4>
          <div className={`p-4 rounded-xl border space-y-3 ${isOverdue ? "bg-red-500/5 border-red-500/20" : "bg-primary/5 border-primary/20"}`}>
            <div
              className="text-sm font-medium text-foreground cursor-pointer hover:text-primary transition-colors"
              onClick={() => setEditing(editing === "nextAction" ? null : "nextAction")}
            >
              {editing === "nextAction" ? (
                <input
                  autoFocus
                  value={editValues.nextAction}
                  onChange={e => setEditValues(v => ({ ...v, nextAction: e.target.value }))}
                  onKeyDown={e => { if (e.key === "Enter") save("nextAction"); if (e.key === "Escape") setEditing(null) }}
                  onBlur={() => save("nextAction")}
                  className="w-full bg-transparent focus:outline-none text-sm"
                  placeholder="Next action..."
                />
              ) : (
                <span>{contact.nextAction || <span className="text-muted-foreground/50">—</span>}</span>
              )}
            </div>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setEditing(editing === "nextActionDate" ? null : "nextActionDate")}
            >
              <Calendar className={`h-3.5 w-3.5 shrink-0 ${isOverdue ? "text-red-400" : "text-muted-foreground"}`} />
              {editing === "nextActionDate" ? (
                <input
                  autoFocus
                  type="date"
                  value={editValues.nextActionDate}
                  onChange={e => setEditValues(v => ({ ...v, nextActionDate: e.target.value }))}
                  onBlur={() => save("nextActionDate")}
                  className="bg-transparent text-xs focus:outline-none text-foreground"
                />
              ) : (
                <span className={`text-xs ${isOverdue ? "text-red-400 font-medium" : "text-muted-foreground"}`}>
                  {contact.nextActionDate || "No date set"}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Activity Timeline */}
        <section className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Activity Timeline</h4>
          {contact.activities.length === 0 ? (
            <p className="text-xs text-muted-foreground/50 text-center py-4">No activities yet</p>
          ) : (
            <div className="space-y-3">
              {contact.activities.map((activity, idx) => (
                <div key={activity.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${activity.type === "gravitas" ? "bg-primary" : "bg-muted-foreground"}`} />
                    {idx < contact.activities.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                  </div>
                  <div className="pb-3 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] px-2 py-1 rounded-md font-semibold uppercase tracking-wider ${
                        activity.type === "gravitas" ? "bg-primary/15 text-primary ring-1 ring-primary/30" : "bg-secondary text-muted-foreground"
                      }`}>
                        {activity.type}
                      </span>
                      <span className="text-xs text-muted-foreground">{activity.date}</span>
                    </div>
                    <p className="text-sm text-foreground/90">{activity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

// ─── CSV Export ───────────────────────────────────────────────────────────────
function exportCSV(contacts: Contact[], filename: string) {
  const headers = ["Name", "Email", "Phone", "Status", "Source", "Tags", "Next Action", "Next Action Date", "Last Activity", "Credibility Score"]
  const rows = contacts.map(c => [
    c.name, c.email, c.phone, c.status, c.source,
    c.tags.join("; "), c.nextAction, c.nextActionDate, c.lastActivity, String(c.credibilityScore)
  ])
  const csv = [headers, ...rows].map(r => r.map(v => `"${(v || "").replace(/"/g, '""')}"`).join(",")).join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

// ─── Main ContactsView ────────────────────────────────────────────────────────
export function ContactsView() {
  const { contacts, currentWorkspace, deleteContact } = useWorkspace()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [logActivityContact, setLogActivityContact] = useState<Contact | null>(null)
  const [globalSearch, setGlobalSearch] = useState(false)
  const [globalResults, setGlobalResults] = useState<Contact[]>([])
  const [globalSearching, setGlobalSearching] = useState(false)
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const today = new Date().toISOString().split("T")[0]

  const wsContacts = contacts.filter(c => c.workspaceId === currentWorkspace?.id)
  const filtered = wsContacts.filter(c => {
    const q = search.toLowerCase()
    const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    const matchesStatus = statusFilter === "all" || c.status === statusFilter
    return matchesSearch && matchesStatus
  })
  const overdueCount = wsContacts.filter(c => c.nextActionDate && c.nextActionDate < today).length

  const handleSearch = (val: string) => {
    setSearch(val)
    if (!globalSearch || !val.trim()) { setGlobalResults([]); return }
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(async () => {
      setGlobalSearching(true)
      const res = await fetch(`/api/contacts?all=true&q=${encodeURIComponent(val.trim())}`)
      const { contacts: rows } = await res.json()
      setGlobalResults(rows || [])
      setGlobalSearching(false)
    }, 400)
  }

  // Keep selectedContact in sync when contacts update
  const displayedContact = selectedContact
    ? contacts.find(c => c.id === selectedContact.id) ?? selectedContact
    : null

  if (!currentWorkspace) return null

  const displayList = globalSearch && search.trim() ? globalResults : filtered

  if (wsContacts.length === 0 && !showAddModal) {
    return (
      <>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 animate-fade-in">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-secondary/50 border border-border/50 flex items-center justify-center backdrop-blur-sm">
              <User className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="absolute -top-1 -right-1 w-7 h-7 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Plus className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="text-center space-y-2 max-w-sm">
            <h3 className="text-lg font-semibold text-foreground">No contacts yet</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Start building your network by adding your first contact.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-2 px-5 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add First Contact
          </button>
        </div>
        <AddContactModal workspaceId={currentWorkspace.id} onClose={() => setShowAddModal(false)} onCreate={c => setSelectedContact(c)} />
      </>
    )
  }

  return (
    <>
      {showAddModal && (
        <AddContactModal
          workspaceId={currentWorkspace.id}
          onClose={() => setShowAddModal(false)}
          onCreate={c => setSelectedContact(c)}
        />
      )}
      {logActivityContact && (
        <LogActivityModal
          contact={logActivityContact}
          onClose={() => setLogActivityContact(null)}
        />
      )}

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0">
          {/* Toolbar */}
          <div className="px-6 py-3 border-b border-border/50 bg-card/30 space-y-2.5">
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="flex-1 relative min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={globalSearch ? "Search all workspaces..." : "Search contacts..."}
                  value={search}
                  onChange={e => handleSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-secondary/80 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
                {globalSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-primary/50 border-t-primary rounded-full animate-spin" />
                )}
              </div>
              {/* Global search toggle */}
              <button
                onClick={() => { setGlobalSearch(g => !g); setGlobalResults([]); setSearch("") }}
                className={`shrink-0 p-2 rounded-lg border transition-all ${globalSearch ? "bg-primary/10 text-primary border-primary/30 ring-1 ring-primary/20" : "bg-secondary/80 text-muted-foreground border-border/50 hover:text-foreground"}`}
                title="Search all workspaces"
              >
                <Globe className="h-4 w-4" />
              </button>
              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="shrink-0 px-3 py-2 text-sm rounded-lg bg-secondary/80 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="lead">Lead</option>
                <option value="inactive">Inactive</option>
              </select>
              {/* CSV export */}
              <button
                onClick={() => exportCSV(filtered, `${currentWorkspace.name}-contacts.csv`)}
                className="shrink-0 p-2 rounded-lg bg-secondary/80 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                title="Export CSV"
              >
                <Download className="h-4 w-4" />
              </button>
              {/* Add contact */}
              <button
                onClick={() => setShowAddModal(true)}
                className="shrink-0 px-3.5 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
            {overdueCount > 0 && !globalSearch && (
              <div
                className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 cursor-pointer hover:bg-red-500/15 transition-colors"
                onClick={() => { setStatusFilter("all"); setSearch("") }}
              >
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span><span className="font-semibold">{overdueCount}</span> contact{overdueCount !== 1 ? "s" : ""} with overdue next actions</span>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-card/50 backdrop-blur-sm z-10">
                <tr className="border-b border-border/50">
                  <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">Name</th>
                  <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">Status</th>
                  <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">Tags</th>
                  <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">Next Action</th>
                  <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">Credibility</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {displayList.map(contact => {
                  const overdue = contact.nextActionDate && contact.nextActionDate < today
                  return (
                    <tr
                      key={contact.id}
                      onClick={() => setSelectedContact(contact)}
                      className={`border-b border-border/30 cursor-pointer transition-all duration-150 hover:bg-secondary/30 ${
                        displayedContact?.id === contact.id ? "bg-primary/5 ring-1 ring-inset ring-primary/20" : ""
                      } ${overdue ? "bg-red-500/5" : ""}`}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium text-foreground">{contact.name}</span>
                            {overdue && <AlertCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">{contact.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider ${
                          contact.status === "active" ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30" :
                          contact.status === "lead" ? "bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30" :
                          "bg-secondary text-muted-foreground ring-1 ring-border"
                        }`}>
                          {contact.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1.5 flex-wrap">
                          {contact.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="px-2 py-1 rounded-md text-[10px] bg-secondary/80 border border-border/50 text-foreground/90">{tag}</span>
                          ))}
                          {contact.tags.length > 2 && <span className="text-[10px] text-muted-foreground font-medium">+{contact.tags.length - 2}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className={`text-xs font-medium ${overdue ? "text-red-400" : "text-foreground/80"} truncate max-w-[160px]`}>
                            {contact.nextAction || "—"}
                          </div>
                          {contact.nextActionDate && (
                            <div className={`text-[10px] mt-0.5 ${overdue ? "text-red-400" : "text-muted-foreground"}`}>
                              {contact.nextActionDate}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${
                          contact.credibilityScore >= 80 ? "bg-emerald-500/15 ring-1 ring-emerald-500/30" :
                          contact.credibilityScore >= 50 ? "bg-amber-500/15 ring-1 ring-amber-500/30" :
                          "bg-red-500/15 ring-1 ring-red-500/30"
                        }`}>
                          <span className={`text-xs font-bold ${
                            contact.credibilityScore >= 80 ? "text-emerald-400" :
                            contact.credibilityScore >= 50 ? "text-amber-400" : "text-red-400"
                          }`}>
                            {contact.credibilityScore}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </td>
                    </tr>
                  )
                })}
                {displayList.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-muted-foreground">
                      {globalSearch ? "No results across workspaces" : "No contacts match your filters"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {displayedContact && (
          <ContactDetail
            contact={displayedContact}
            onClose={() => setSelectedContact(null)}
            onDelete={deleteContact}
            onLogActivity={c => setLogActivityContact(c)}
          />
        )}
      </div>
    </>
  )
}
