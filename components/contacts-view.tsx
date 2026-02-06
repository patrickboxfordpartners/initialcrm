"use client"

import { useState } from "react"
import { useWorkspace, type Contact } from "@/lib/workspace-context"
import { Search, Plus, User, Phone, Mail, Tag, ChevronRight, X, Calendar, Shield } from "lucide-react"

function ContactDetail({ contact, onClose }: { contact: Contact; onClose: () => void }) {
  return (
    <div className="w-[400px] border-l border-border bg-card flex flex-col shrink-0">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">{contact.name}</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        <section className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Identity</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-foreground">{contact.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-foreground">{contact.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <Tag className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              {contact.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-secondary text-secondary-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Credibility</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Source:</span>
              <span className="text-foreground">{contact.source}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-foreground">Score: {contact.credibilityScore}/100</span>
            </div>
            <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${contact.credibilityScore}%`,
                  backgroundColor: contact.credibilityScore >= 80 ? "hsl(var(--success))" : contact.credibilityScore >= 50 ? "hsl(var(--warning))" : "hsl(var(--destructive))",
                }}
              />
            </div>
            {contact.trustSignals.length > 0 && (
              <div className="space-y-1">
                {contact.trustSignals.map((signal) => (
                  <div key={signal} className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                    {signal}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Next Action</h4>
          <div className="p-3 rounded-lg bg-secondary space-y-1">
            <p className="text-sm text-foreground">{contact.nextAction}</p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {contact.nextActionDate}
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Activity Timeline</h4>
          <div className="space-y-3">
            {contact.activities.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground mt-1.5" />
                  <div className="w-px flex-1 bg-border" />
                </div>
                <div className="pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground capitalize">{activity.type}</span>
                    <span className="text-xs text-muted-foreground">{activity.date}</span>
                  </div>
                  <p className="text-sm text-foreground mt-1">{activity.description}</p>
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
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
          <User className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No contacts yet</h3>
        <p className="text-sm text-muted-foreground">Add your first contact to get started.</p>
        <button className="mt-2 px-4 py-2 text-sm font-medium rounded-md bg-foreground text-background hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4 inline-block mr-1.5" />
          Add Contact
        </button>
      </div>
    )
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-6 py-4 border-b border-border flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-md bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-md bg-secondary text-foreground border-0 focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="lead">Lead</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="px-3 py-2 text-sm font-medium rounded-md bg-foreground text-background hover:opacity-90 transition-opacity flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Add Contact
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Name</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Tags</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Last Activity</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Score</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((contact) => (
                <tr
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`border-b border-border cursor-pointer transition-colors hover:bg-accent/50 ${
                    selectedContact?.id === contact.id ? "bg-accent/50" : ""
                  }`}
                >
                  <td className="px-6 py-3">
                    <div>
                      <div className="text-sm font-medium text-foreground">{contact.name}</div>
                      <div className="text-xs text-muted-foreground">{contact.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      contact.status === "active" ? "bg-emerald-500/10 text-emerald-400" :
                      contact.status === "lead" ? "bg-blue-500/10 text-blue-400" :
                      "bg-secondary text-muted-foreground"
                    }`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {contact.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] bg-secondary text-secondary-foreground">
                          {tag}
                        </span>
                      ))}
                      {contact.tags.length > 2 && (
                        <span className="text-[10px] text-muted-foreground">+{contact.tags.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-xs text-muted-foreground">{contact.lastActivity}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-medium ${
                      contact.credibilityScore >= 80 ? "text-emerald-400" :
                      contact.credibilityScore >= 50 ? "text-amber-400" :
                      "text-red-400"
                    }`}>
                      {contact.credibilityScore}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
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
