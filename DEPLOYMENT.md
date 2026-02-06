# boxfordCRM Deployment Guide

Deploy boxfordCRM at app.boxfordpartners.com

## Prerequisites

- Neon account (you have credentials)
- Clerk account (free tier works)
- Vercel account
- Domain access to boxfordpartners.com

---

## Step 1: Set Up Neon Database

1. **Go to Neon Console**: https://console.neon.tech
2. **Create a new project** (or use existing)
   - Name: `boxford-crm`
   - Region: Choose closest to your users
3. **Copy the connection string**
   - Go to Dashboard → Connection Details
   - Copy the `DATABASE_URL` (should look like: `postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require`)
4. **Run the schema**
   - Go to SQL Editor in Neon
   - Open `/neon-schema.sql` from this repo
   - Copy and paste the entire contents
   - Click "Run" to execute
   - Verify tables were created in the "Tables" tab

---

## Step 2: Set Up Clerk Authentication

1. **Go to Clerk**: https://dashboard.clerk.com
2. **Create a new application**
   - Name: `boxfordCRM`
   - Authentication methods: Email/Password (can add Google later)
3. **Copy API keys**
   - Go to API Keys
   - Copy `Publishable key` (starts with `pk_`)
   - Copy `Secret key` (starts with `sk_`)
4. **Configure URLs** (in Clerk dashboard → Paths):
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in URL: `/`
   - After sign-up URL: `/`

---

## Step 3: Deploy to Vercel

1. **Push code to GitHub**
   ```bash
   cd /Users/patrickmitchell/initialCRM
   git init
   git add .
   git commit -m "Initial commit - internal CRM"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repo
   - Framework Preset: Next.js (auto-detected)

3. **Add Environment Variables** (in Vercel project settings):
   ```
   DATABASE_URL=<your_neon_connection_string>
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>
   CLERK_SECRET_KEY=<your_clerk_secret_key>
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2 minutes)

---

## Step 4: Configure Custom Domain

1. **In Vercel Project Settings → Domains**:
   - Add domain: `app.boxfordpartners.com`

2. **In your DNS provider** (wherever boxfordpartners.com is hosted):
   - Add CNAME record:
     - Name: `app`
     - Value: `cname.vercel-dns.com`
   - Or A record (Vercel will provide IP)

3. **Wait for DNS propagation** (~5-60 minutes)

4. **Update Clerk allowed origins**:
   - Go to Clerk Dashboard → API Keys
   - Add `https://app.boxfordpartners.com` to allowed origins

---

## Step 5: Create Your User Account

1. **Go to**: `https://app.boxfordpartners.com/sign-up`
2. **Create account** with your email
3. **Verify email** (check spam if needed)
4. **Sign in** at `https://app.boxfordpartners.com/sign-in`

---

## Step 6: Seed Initial Data (Optional)

The app will start empty. You can either:

**Option A: Add data manually through the UI**
- Create your first workspace
- Add contacts, tasks, etc.

**Option B: Seed with demo data**
I can create a seed script that inserts the demo data you've been seeing in development.

---

## Post-Deployment

### Verify Everything Works
- [ ] Can access app.boxfordpartners.com
- [ ] Sign-in page loads
- [ ] Can create account
- [ ] Can create workspaces
- [ ] Can add contacts
- [ ] Can create tasks
- [ ] Can view pipeline

### Next Steps
- Start using it for your Real Estate/Consulting/Gravitas workspaces
- Note features you want added
- Test Gravitas integration workflow
- Invite team members (if needed)

---

## Troubleshooting

**Database connection errors:**
- Verify DATABASE_URL is correct in Vercel
- Check Neon project is active
- Ensure IP allowlist is disabled in Neon (or add Vercel IPs)

**Authentication not working:**
- Verify Clerk keys are correct
- Check allowed origins in Clerk includes your domain
- Clear browser cookies and try again

**Build failures:**
- Check Vercel build logs
- Ensure all dependencies are in package.json
- Try deploying from main branch

---

## Environment Variables Reference

```env
# Neon Database
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

---

## Support

If you run into issues during deployment, check:
1. Vercel deployment logs
2. Browser console for errors
3. Neon connection status
4. Clerk dashboard for auth errors
