# boxfordCRM

A credibility-driven, multi-workspace CRM by Boxford Partners.

## Features

- **Multi-Workspace Management**: Separate Real Estate, Consulting, Product workspaces
- **Credibility Scoring**: Track trust signals and credibility scores for every contact
- **Gravitas Integration**: Auto-classify inbox inquiries as Opportunity, Risk, Noise, or Reputation
- **Pipeline Management**: Visual kanban-style deal tracking
- **Task Management**: Link tasks to contacts with due dates
- **Activity Timeline**: Track all interactions with contacts
- **Infrastructure-Grade UI**: Stripe/Linear-inspired dark mode interface

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Database**: Neon (PostgreSQL)
- **Authentication**: Clerk
- **Deployment**: Vercel
- **Hosting**: crm.boxfordpartners.com

## Current Status

✅ **Phase 1 Complete - UI & Architecture**
- Infrastructure-grade dark mode UI
- Multi-workspace architecture
- All core views (Contacts, Pipeline, Tasks, Inbox, Analytics, Settings)
- Credibility-driven features

🔄 **Phase 2 In Progress - Internal Tool Deployment**
- ✅ Neon database schema created
- ✅ Clerk authentication configured
- ✅ Deployment setup for Vercel
- ⏳ Database API routes (next step)
- ⏳ Deploy to crm.boxfordpartners.com

📋 **Phase 3 Planned - Commercial Product**
- Multi-user workspaces
- Gravitas Index deep integration
- Payment/subscription system
- Public marketing site

## Quick Start (Development)

```bash
npm install --legacy-peer-deps
npm run dev
```

Open http://localhost:3000

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions to crm.boxfordpartners.com.

### Quick Deploy Checklist

1. ✅ Run `neon-schema.sql` in Neon console
2. ✅ Create Clerk application
3. ✅ Push to GitHub
4. ✅ Import to Vercel
5. ✅ Add environment variables
6. ✅ Configure crm.boxfordpartners.com domain
7. ✅ Sign up and start using!

## Project Structure

```
boxfordCRM/
├── app/
│   ├── page.tsx              # Main CRM page
│   ├── sign-in/             # Clerk sign-in
│   ├── sign-up/             # Clerk sign-up
│   └── layout.tsx           # Root layout with Clerk provider
├── components/
│   ├── crm-shell.tsx        # Main shell component
│   ├── top-bar.tsx          # Header with workspace switcher
│   ├── sidebar.tsx          # Navigation sidebar
│   ├── contacts-view.tsx    # Contacts management
│   ├── pipeline-view.tsx    # Kanban pipeline
│   ├── tasks-view.tsx       # Task management
│   ├── inbox-view.tsx       # Gravitas-classified inbox
│   ├── analytics-view.tsx   # Analytics dashboard
│   └── settings-view.tsx    # Settings
├── lib/
│   ├── workspace-context.tsx # State management
│   └── db.ts                # Neon database client
├── neon-schema.sql          # Database schema
└── middleware.ts            # Clerk auth middleware
```

## Environment Variables

See `.env.example` for required environment variables.

## Next Steps

After deployment:
1. Create your first workspace
2. Import/add contacts
3. Start tracking deals in pipeline
4. Test Gravitas inbox classification
5. Identify features to add based on usage

## License

Internal use only - Boxford Partners LLC
