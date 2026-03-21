# Supabase Setup Guide

## Why Supabase?

- **PostgreSQL** - More powerful than MySQL (better JSON, full-text search)
- **Built-in Auth** - Ready for user authentication later
- **Real-time** - Live updates when jobs change
- **Free Tier** - 500MB storage, unlimited API calls
- **Easy Setup** - Web UI, no CLI needed for basic setup

## Step 1: Create Supabase Account

1. Go to https://supabase.com
2. Sign up with GitHub
3. Click "New Project"
4. Fill in:
   - Organization: (your username)
   - Project name: jobhunt
   - Database password: (generate strong one, save it!)
   - Region: Choose closest to you
5. Click "Create new project" (takes 2-3 minutes)

## Step 2: Get Connection Strings

1. In your Supabase dashboard, go to **Project Settings** (gear icon)
2. Click **Database**
3. Scroll to **Connection String** section
4. Click **URI** tab
5. Copy the connection string
6. Replace `[YOUR-PASSWORD]` with your database password

**You'll have TWO connection strings:**

```bash
# Connection Pooling (for Next.js API routes - use this in DATABASE_URL)
postgresql://postgres:password@db.xxxxx.supabase.co:6543/postgres?pgbouncer=true

# Direct Connection (for Prisma migrations - use this in DIRECT_URL)
postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
```

## Step 3: Set Up Environment Variables

Create `.env.local` file:

```bash
# From Supabase Dashboard
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"

# From Vercel (later)
BLOB_READ_WRITE_TOKEN=""
```

## Step 4: Initialize Database

```bash
# 1. Generate Prisma client
npx prisma generate

# 2. Push schema to Supabase
npx prisma db push

# 3. Seed with sample data
npx prisma db seed
# or
npm run db:seed
```

## Step 5: Test Connection

```bash
# Start dev server
npm run dev

# Open http://localhost:3000
# Dashboard should show stats (0 if no seed, or 3 if seeded)
```

## Step 6: Deploy to Vercel

### Add Environment Variables in Vercel:

1. Go to https://vercel.com/dashboard
2. Click your project
3. Go to **Settings** → **Environment Variables**
4. Add:

| Name | Value | Environment |
|------|-------|-------------|
| `DATABASE_URL` | Your Supabase pooling URL | Production, Preview, Development |
| `DIRECT_URL` | Your Supabase direct URL | Production, Preview, Development |
| `BLOB_READ_WRITE_TOKEN` | From Vercel Blob | Production, Preview, Development |

### Deploy:

```bash
vercel --prod
```

Or push to GitHub and Vercel auto-deploys.

## Troubleshooting

### "Connection refused" error?
- Check password is correct
- Verify you're using the pooling URL (port 6543) for DATABASE_URL
- Ensure project is fully initialized (wait 2-3 minutes after creation)

### "Prisma schema drift" error?
```bash
# Reset and push fresh
npx prisma migrate reset
npx prisma db push
```

### SSL errors?
Supabase requires SSL. Connection strings should work as-is.

## Next Steps After Database Works

1. ✅ Database connected
2. ✅ Sample jobs showing
3. 🔄 Set up Vercel Blob for CV uploads
4. 🔄 Deploy to production
5. 🔄 Start Phase 3 (CV parsing & AI tailoring)

## Quick Reference

**Supabase Dashboard:** https://app.supabase.com
**Project Settings:** Gear icon → Database
**Connection Pooling:** Port 6543 (for app)
**Direct Connection:** Port 5432 (for migrations)