"use client"

import { useState } from "react"
import { useWorkspace, type Contact } from "@/lib/workspace-context"
import { Search, Plus, User, Phone, Mail, Tag, ChevronRight, X, Calendar, Shield } from "lucide-react"

function ContactDetail({ contact, onClose }: { contact: Contact; onClose: () => void }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400"
    if (score >= 50) return "text-amber-400"
    return "text-red-400"
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return "from-emerald-500/20 to-emerald-500/0"
    if (score >= 50) return "from-amber-500/20 to-amber-500/0"
    return "from-red-500/20 to-red-500/0"
  }

  return (
    <div className="w-[420px] border-l border-border bg-card/30 backdrop-blur-sm flex flex-col shrink-0 animate-slide-in">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
        <div>
          <h3 className="text-base font-semibold text-foreground">{contact.name}</h3>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider mt-1 ${
            contact.status === "active" ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30" :
            contact.status === "lead" ? "bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30" :
            "bg-secondary text-muted-foreground ring-1 ring-border"
          }`}>
            {contact.status}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-secondary/50"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        <section className={`p-4 rounded-xl bg-gradient-to-br ${getScoreBg(contact.credibilityScore)} border border-border/50`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Shield className="h-3.5 w-3.5" />
              Credibility Score
            </h4>
            <span className={`text-2xl font-bold ${getScoreColor(contact.credibilityScore)}`}>
              {contact.credibilityScore}
            </span>
          </div>
          <div className="w-full h-2 bg-secondary/50 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 bg-gradient-to-r"
              style={{
                width: `${contact.credibilityScore}%`,
                backgroundImage: contact.credibilityScore >= 80
                  ? "linear-gradient(to right, rgb(52, 211, 153), rgb(16, 185, 129))"
                  : contact.credibilityScore >= 50
                  ? "linear-gradient(to right, rgb(251, 191, 36), rgb(245, 158, 11))"
                  : "linear-gradient(to right, rgb(248, 113, 113), rgb(239, 68, 68))",
              }}
            />
          </div>
          {contact.trustSignals.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {contact.trustSignals.map((signal) => (
                <div key={signal} className="text-xs text-foreground/80 flex items-center gap-2 bg-background/50 rounded-md px-2 py-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {signal}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact Information</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-secondary/50 border border-border/50">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <span className="text-foreground">{contact.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-secondary/50 border border-border/50">
              <Phone className="h-4 w-4 text-primary shrink-0" />
              <span className="text-foreground">{contact.phone}</span>
            </div>
            <div className="flex items-start gap-3 text-sm p-3 rounded-lg bg-secondary/50 border border-border/50">
              <Tag className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="flex gap-1.5 flex-wrap">
                {contact.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 rounded-md text-xs bg-background border border-border text-foreground/90">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Source</h4>
          <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
            <p className="text-sm text-foreground/90">{contact.source}</p>
          </div>
        </section>

        <section className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Next Action</h4>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
            <p className="text-sm font-medium text-foreground">{contact.nextAction}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>Due: {contact.nextActionDate}</span>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Activity Timeline</h4>
          <div className="space-y-3">
            {contact.activities.map((activity, idx) => (
              <div key={activity.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${
                    activity.type === "gravitas" ? "bg-primary" : "bg-muted-foreground"
                  }`} />
                  {idx < contact.activities.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                </div>
                <div className="pb-3 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] px-2 py-1 rounded-md font-semibold uppercase tracking-wider ${
                      activity.type === "gravitas"
                        ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                        : "bg-secondary text-muted-foreground"
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
            Start building your network by adding your first contact. Track credibility, activities, and next actions all in one place.
          </p>
        </div>
        <button className="mt-2 px-5 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add First Contact
        </button>
      </div>
    )
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-6 py-4 border-b border-border/50 flex items-center gap-3 bg-card/30">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg bg-secondary/80 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 text-sm rounded-lg bg-secondary/80 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="lead">Lead</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="px-4 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Contact
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-card/50 backdrop-blur-sm z-10">
              <tr className="border-b border-border/50">
                <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">Name</th>
                <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">Status</th>
                <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">Tags</th>
                <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">Last Activity</th>
                <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">Credibility</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((contact) => (
                <tr
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`border-b border-border/30 cursor-pointer transition-all duration-150 hover:bg-secondary/30 ${
                    selectedContact?.id === contact.id ? "bg-primary/5 ring-1 ring-primary/20" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-foreground">{contact.name}</div>
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
                      {contact.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-2 py-1 rounded-md text-[10px] bg-secondary/80 border border-border/50 text-foreground/90">
                          {tag}
                        </span>
                      ))}
                      {contact.tags.length > 2 && (
                        <span className="text-[10px] text-muted-foreground font-medium">+{contact.tags.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">{contact.lastActivity}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                        contact.credibilityScore >= 80 ? "bg-emerald-500/15 ring-1 ring-emerald-500/30" :
                        contact.credibilityScore >= 50 ? "bg-amber-500/15 ring-1 ring-amber-500/30" :
                        "bg-red-500/15 ring-1 ring-red-500/30"
                      }`}>
                        <span className={`text-xs font-bold ${
                          contact.credibilityScore >= 80 ? "text-emerald-400" :
                          contact.credibilityScore >= 50 ? "text-amber-400" :
                          "text-red-400"
                        }`}>
                          {contact.credibilityScore}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
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
