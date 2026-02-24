"use client"

import { useState } from "react"
import { useWorkspace, type Contact } from "@/lib/workspace-context"
import { Search, Plus, User, Phone, Mail, Tag, ChevronRight, X, Calendar, Shield } from "lucide-react"

function ContactDetail({ contact, onClose }: { contact: Contact; onClose: () => void }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-700"
    if (score >= 50) return "text-amber-700"
    return "text-red-700"
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-50 border-emerald-200"
    if (score >= 50) return "bg-amber-50 border-amber-200"
    return "bg-red-50 border-red-200"
  }

  const getBarColor = (score: number) => {
    if (score >= 80) return "bg-emerald-600"
    if (score >= 50) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <div className="w-[400px] border-l border-border bg-card flex flex-col shrink-0 animate-slide-in">
      <div className="flex items-center justify-between px-6 py-5 border-b border-border">
        <div>
          <h3 className="text-base font-semibold text-foreground">{contact.name}</h3>
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-[0.1em] mt-1.5 ${
            contact.status === "active" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
            contact.status === "lead" ? "bg-primary/5 text-primary border border-primary/20" :
            "bg-secondary text-muted-foreground border border-border"
          }`}>
            {contact.status}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-secondary"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        <section className={`p-4 rounded-lg border ${getScoreBg(contact.credibilityScore)}`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[11px] font-semibold text-foreground uppercase tracking-[0.1em] flex items-center gap-2">
              <Shield className="h-3.5 w-3.5" />
              Credibility Score
            </h4>
            <span className={`text-2xl font-serif font-bold ${getScoreColor(contact.credibilityScore)}`}>
              {contact.credibilityScore}
            </span>
          </div>
          <div className="w-full h-1.5 bg-background/60 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(contact.credibilityScore)}`}
              style={{ width: `${contact.credibilityScore}%` }}
            />
          </div>
          {contact.trustSignals.length > 0 && (
            <div className="mt-3 flex flex-col gap-1.5">
              {contact.trustSignals.map((signal) => (
                <div key={signal} className="text-xs text-foreground/80 flex items-center gap-2 bg-background/50 rounded px-2.5 py-1.5">
                  <span className="w-1 h-1 rounded-full bg-primary" />
                  {signal}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-3">
          <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.1em]">Contact Information</h4>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 text-[13px] p-3 rounded-md bg-secondary border border-border">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
              <span className="text-foreground">{contact.email}</span>
            </div>
            <div className="flex items-center gap-3 text-[13px] p-3 rounded-md bg-secondary border border-border">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
              <span className="text-foreground">{contact.phone}</span>
            </div>
            <div className="flex items-start gap-3 text-[13px] p-3 rounded-md bg-secondary border border-border">
              <Tag className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" strokeWidth={1.5} />
              <div className="flex gap-1.5 flex-wrap">
                {contact.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded text-[11px] bg-background border border-border text-foreground font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.1em]">Source</h4>
          <div className="p-3 rounded-md bg-secondary border border-border">
            <p className="text-[13px] text-foreground">{contact.source}</p>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.1em]">Next Action</h4>
          <div className="p-4 rounded-lg bg-primary/[0.03] border border-primary/10 flex flex-col gap-2">
            <p className="text-[13px] font-medium text-foreground">{contact.nextAction}</p>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span>Due: {contact.nextActionDate}</span>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.1em]">Activity Timeline</h4>
          <div className="flex flex-col gap-3">
            {contact.activities.map((activity, idx) => (
              <div key={activity.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${
                    activity.type === "gravitas" ? "bg-primary" : "bg-border"
                  }`} />
                  {idx < contact.activities.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                </div>
                <div className="pb-3 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-[0.1em] ${
                      activity.type === "gravitas"
                        ? "bg-primary/5 text-primary border border-primary/15"
                        : "bg-secondary text-muted-foreground border border-border"
                    }`}>
                      {activity.type}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{activity.date}</span>
                  </div>
                  <p className="text-[13px] text-foreground/80 leading-relaxed">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export function ContactsView() {
  const { contacts, currentWorkspace } = useWorkspace()
  const [search, setSearch] = useState("")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const wsContacts = contacts.filter((c) => c.workspaceId === currentWorkspace?.id)
  const filtered = wsContacts.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (!currentWorkspace) return null

  if (wsContacts.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 animate-fade-in">
        <div className="w-16 h-16 rounded-xl bg-secondary border border-border flex items-center justify-center">
          <User className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
        </div>
        <div className="text-center flex flex-col gap-1.5 max-w-sm">
          <h3 className="text-lg font-serif font-semibold text-foreground">No contacts yet</h3>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            Start building your network by adding your first contact. Track credibility, activities, and next actions all in one place.
          </p>
        </div>
        <button className="mt-2 px-5 py-2.5 text-[13px] font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add First Contact
        </button>
      </div>
    )
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-6 py-4 border-b border-border flex items-center gap-3 bg-card">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-[13px] rounded-md bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/30 transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 text-[13px] rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/30 transition-all"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="lead">Lead</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="px-4 py-2 text-[13px] font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Contact
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-card z-10">
              <tr className="border-b border-border">
                <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.1em] px-6 py-3">Name</th>
                <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.1em] px-6 py-3">Status</th>
                <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.1em] px-6 py-3">Tags</th>
                <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.1em] px-6 py-3">Last Activity</th>
                <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.1em] px-6 py-3">Credibility</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((contact) => (
                <tr
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`border-b border-border/60 cursor-pointer transition-all duration-150 hover:bg-secondary/50 group ${
                    selectedContact?.id === contact.id ? "bg-primary/[0.03]" : ""
                  }`}
                >
                  <td className="px-6 py-3.5">
                    <div>
                      <div className="text-[13px] font-medium text-foreground">{contact.name}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{contact.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-[0.1em] border ${
                      contact.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      contact.status === "lead" ? "bg-primary/5 text-primary border-primary/20" :
                      "bg-secondary text-muted-foreground border-border"
                    }`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex gap-1.5 flex-wrap">
                      {contact.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded text-[10px] bg-secondary border border-border text-foreground/80 font-medium">
                          {tag}
                        </span>
                      ))}
                      {contact.tags.length > 2 && (
                        <span className="text-[10px] text-muted-foreground font-medium">+{contact.tags.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-[12px] text-muted-foreground">{contact.lastActivity}</td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-md border ${
                        contact.credibilityScore >= 80 ? "bg-emerald-50 border-emerald-200" :
                        contact.credibilityScore >= 50 ? "bg-amber-50 border-amber-200" :
                        "bg-red-50 border-red-200"
                      }`}>
                        <span className={`text-xs font-bold ${
                          contact.credibilityScore >= 80 ? "text-emerald-700" :
                          contact.credibilityScore >= 50 ? "text-amber-700" :
                          "text-red-700"
                        }`}>
                          {contact.credibilityScore}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <ChevronRight className="h-4 w-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedContact && (
        <ContactDetail contact={selectedContact} onClose={() => setSelectedContact(null)} />
      )}
    </div>
  )
}
