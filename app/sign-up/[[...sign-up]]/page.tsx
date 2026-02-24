import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold text-foreground tracking-tight">Boxford CRM</h1>
          <p className="text-[13px] text-muted-foreground mt-1">Institutional-grade relationship management</p>
        </div>
        <SignUp />
      </div>
    </div>
  )
}
