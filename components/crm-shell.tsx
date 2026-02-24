"use client"

import { useWorkspace } from "@/lib/workspace-context"
import { TopBar } from "@/components/top-bar"
import { Sidebar } from "@/components/sidebar"
import { ContactsView } from "@/components/contacts-view"
import { PipelineView } from "@/components/pipeline-view"
import { TasksView } from "@/components/tasks-view"
import { InboxView } from "@/components/inbox-view"
import { AnalyticsView } from "@/components/analytics-view"
import { SettingsView } from "@/components/settings-view"

function MainContent() {
  const { activePage } = useWorkspace()

  switch (activePage) {
    case "contacts":
      return <ContactsView />
    case "pipeline":
      return <PipelineView />
    case "tasks":
      return <TasksView />
    case "inbox":
      return <InboxView />
    case "analytics":
      return <AnalyticsView />
    case "settings":
      return <SettingsView />
    default:
      return <ContactsView />
  }
}

export function CrmShell() {
  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar />
        <main className="flex-1 flex flex-col overflow-hidden bg-background">
          <MainContent />
        </main>
      </div>
    </div>
  )
}
