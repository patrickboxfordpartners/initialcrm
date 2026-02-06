import { WorkspaceProvider } from "@/lib/workspace-context"
import { CrmShell } from "@/components/crm-shell"

export default function Home() {
  return (
    <WorkspaceProvider>
      <CrmShell />
    </WorkspaceProvider>
  )
}
