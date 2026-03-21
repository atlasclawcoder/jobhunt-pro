# JobHunt Pro - Next.js

Modern job search and application automation tool built with Next.js, TypeScript, Prisma, and Vercel Blob.

## ✅ Vercel-Ready Architecture

- ✅ **Next.js 15** (App Router)
- ✅ **Serverless API Routes**
- ✅ **Prisma + PlanetScale** (Serverless MySQL)
- ✅ **Vercel Blob** (File storage)
- ✅ **TypeScript + Tailwind CSS**

## Features

### Phase 1: Foundation ✅
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS styling
- Prisma ORM with MySQL
- Dashboard with job stats
- Job queue with filtering
- CV upload with drag & drop
- Responsive design

### Phase 2: Job Discovery ✅
- Database integration with Prisma
- Job listing with approve/reject
- Job detail page
- Mock job scraper
- Sample data seeding

### Phase 2.5: Advanced Search ✅
- Multi-keyword selection
- Custom company website scraping
- Match score calculation
- Source filtering (LinkedIn, Glassdoor, Company sites)

### Phase 3: Vercel Deployment ✅
- Vercel Blob for file uploads
- Serverless-ready architecture
- Production environment config

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database (PlanetScale)

```bash
# Create .env.local from template
cp .env.example .env.local

# Edit .env.local with your PlanetScale URL
DATABASE_URL="mysql://..."
```

### 3. Push Database Schema

```bash
npx prisma generate
npx prisma db push
```

### 4. Seed Sample Data

```bash
npm run db:seed
```

### 5. Run Locally

```bash
npm run dev
```

Open http://localhost:3000

## Deployment to Vercel

### Step 1: Create Project on Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Link to your account
vercel login

# Deploy (creates project)
vercel
```

### Step 2: Add Environment Variables

Go to your Vercel dashboard → Project Settings → Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `DATABASE_URL` | Your PlanetScale connection string | Production, Preview, Development |
| `BLOB_READ_WRITE_TOKEN` | From Vercel Blob | Production, Preview, Development |

### Step 3: Get Vercel Blob Token

```bash
# Install Vercel Blob
npm install @vercel/blob

# Or get token from dashboard:
# 1. Go to Project Settings → Storage
# 2. Click "Connect" on Vercel Blob
# 3. Copy the token
```

### Step 4: Redeploy

```bash
vercel --prod
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/jobs` | GET | List all jobs with stats |
| `/api/jobs` | POST | Create new job |
| `/api/jobs/[id]` | GET | Get job details |
| `/api/jobs/[id]/approve` | POST | Approve job |
| `/api/jobs/[id]/reject` | POST | Reject job |
| `/api/upload` | GET | List CV versions |
| `/api/upload` | POST | Upload CV to Vercel Blob |
| `/api/scrape` | POST | Search jobs by keywords |

## Project Structure

```
jobhunt-next/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   │   ├── jobs/       # Job CRUD
│   │   │   ├── upload/     # Vercel Blob uploads
│   │   │   └── scrape/     # Job search
│   │   ├── jobs/           # Job pages
│   │   ├── search/         # Advanced search
│   │   ├── upload/         # CV upload
│   │   ├── page.tsx        # Dashboard
│   │   └── layout.tsx      # Root layout
│   ├── components/         # Reusable components
│   └── lib/
│       ├── db.ts          # Prisma client
│       └── utils.ts       # Utilities
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Sample data
└── README.md
```

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **File Storage:** Vercel Blob
- **Styling:** Tailwind CSS
- **Deployment:** Vercel (Serverless)

## Next Steps

1. ✅ Set up Vercel deployment
2. 🔄 Add real job scraping (Puppeteer/Playwright)
3. 🔄 Integrate with LinkedIn API
4. 🔄 Add CV parsing and AI tailoring
5. 🔄 Implement automated applications

## License

MIT