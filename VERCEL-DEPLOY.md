# Vercel Deployment Guide

## Prerequisites

- Vercel account (free tier works)
- PlanetScale account (free tier works)
- Git repository with your code

## Step-by-Step Deployment

### 1. Prepare Your Repository

```bash
# Make sure all changes are committed
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Create Vercel Project

**Option A: Vercel CLI**
```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (creates project automatically)
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name? jobhunt-pro (or your choice)
# - Directory? ./
# - Override build settings? No
```

**Option B: Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Framework preset: Next.js
5. Click "Deploy"

### 3. Set Up PlanetScale Database

1. Go to https://planetscale.com and sign up
2. Create new database: `jobhunt`
3. Go to "Connect" tab
4. Select "Connect with: @pscale/cli or general ORM"
5. Copy the connection string
   - Format: `mysql://username:password@host.region.psdb.cloud/jobhunt?sslaccept=strict`

### 4. Add Environment Variables

In Vercel dashboard → Your Project → Settings → Environment Variables:

```
DATABASE_URL=mysql://... (from PlanetScale)
```

### 5. Set Up Vercel Blob

1. In Vercel dashboard → Your Project → Settings → Storage
2. Click "Connect" on Vercel Blob
3. This automatically adds `BLOB_READ_WRITE_TOKEN`

**Or manually:**

```bash
# In your terminal
vercel env add BLOB_READ_WRITE_TOKEN
# Enter value when prompted (generate in Vercel dashboard)
```

### 6. Push Database Schema

```bash
# Make sure DATABASE_URL is set locally
export DATABASE_URL="your-planetscale-url"

# Generate Prisma client
npx prisma generate

# Push schema to PlanetScale
npx prisma db push

# Seed sample data
npm run db:seed
```

### 7. Redeploy

```bash
vercel --prod
```

## Troubleshooting

### File Upload Not Working?
- Check `BLOB_READ_WRITE_TOKEN` is set
- Verify blob token has correct permissions
- Check browser console for errors

### Database Connection Error?
- Verify `DATABASE_URL` is correct
- Check PlanetScale dashboard for connection limits
- Ensure `sslaccept=strict` is in the URL

### Build Failing?
- Run `npm run build` locally first
- Check TypeScript errors: `npx tsc --noEmit`
- Ensure all dependencies installed: `npm install`

## Environment Variables Checklist

- [x] `DATABASE_URL` - PlanetScale connection string
- [x] `BLOB_READ_WRITE_TOKEN` - Vercel Blob token (auto-added)
- [x] `NEXT_PUBLIC_VERCEL_URL` - Auto-added by Vercel

## After Deployment

1. Visit your Vercel URL (e.g., `jobhunt-pro.vercel.app`)
2. Dashboard should show stats
3. Try searching for jobs: `/search`
4. Upload a CV: `/upload`
5. Approve/reject jobs: `/jobs`

Your app is now live on Vercel! 🚀