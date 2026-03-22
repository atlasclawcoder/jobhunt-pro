import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

interface ScrapeRequest {
  keywords?: string[]
  location?: string
  sources?: ('linkedin' | 'glassdoor' | 'company')[],
  companyUrls?: string[] // For custom company career pages
}

// Job title keywords to match - includes both job roles and technical skills
const DEFAULT_KEYWORDS = [
  // Job Roles
  'software engineer', 'product manager', 'event planner', 'project manager',
  'data analyst', 'marketing manager', 'business analyst', 'ux designer',
  // Technical Roles
  'developer', 'full stack', 'frontend', 'backend', 'devops engineer',
  'qa engineer', 'mobile developer',
  // Technical Skills
  'react', 'typescript', 'node', 'python'
]

export async function POST(request: Request) {
  try {
    const body: ScrapeRequest = await request.json()
    const { keywords, location, sources, companyUrls } = body
    
    // Get user keywords from profile if not provided
    let searchKeywords = keywords
    if (!searchKeywords || searchKeywords.length === 0) {
      const profile = await db.userProfile.findUnique({
        where: { id: 'user' }
      })
      if (profile?.keywords && Array.isArray(profile.keywords)) {
        searchKeywords = profile.keywords as string[]
      } else {
        searchKeywords = DEFAULT_KEYWORDS
      }
    }
    
    const scrapedJobs: any[] = []
    const allSources = sources || ['linkedin', 'glassdoor']
    
    // Scrape from each source
    if (allSources.includes('linkedin')) {
      const linkedInJobs = await scrapeLinkedIn(searchKeywords, location)
      scrapedJobs.push(...linkedInJobs)
    }
    
    if (allSources.includes('glassdoor')) {
      const glassdoorJobs = await scrapeGlassdoor(searchKeywords, location)
      scrapedJobs.push(...glassdoorJobs)
    }
    
    if (allSources.includes('company') && companyUrls) {
      for (const url of companyUrls) {
        const companyJobs = await scrapeCompanyWebsite(url, searchKeywords)
        scrapedJobs.push(...companyJobs)
      }
    }
    
    // Filter jobs by keywords
    const matchedJobs = filterJobsByKeywords(scrapedJobs, searchKeywords)
    
    // Calculate match scores
    const jobsWithScores = matchedJobs.map(job => ({
      ...job,
      matchScore: calculateMatchScore(job, searchKeywords)
    }))
    
    // Save to database
    const createdJobs = []
    for (const jobData of jobsWithScores) {
      try {
        const job = await db.job.create({
          data: jobData
        })
        createdJobs.push(job)
      } catch (e) {
        // Job already exists (unique URL constraint)
        console.log('Job already exists:', jobData.url)
      }
    }
    
    return NextResponse.json({
      success: true,
      count: createdJobs.length,
      keywords: searchKeywords,
      jobs: createdJobs
    })
  } catch (error) {
    console.error('Scrape error:', error)
    return NextResponse.json(
      { error: 'Failed to scrape jobs' },
      { status: 500 }
    )
  }
}

// Filter jobs that match keywords
function filterJobsByKeywords(jobs: any[], keywords: string[]): any[] {
  if (!keywords || keywords.length === 0) return jobs
  
  return jobs.filter(job => {
    const text = `${job.title} ${job.description}`.toLowerCase()
    return keywords.some(keyword => text.includes(keyword.toLowerCase()))
  })
}

// Calculate relevance score
function calculateMatchScore(job: any, keywords: string[]): number {
  if (!keywords || keywords.length === 0) return 0.5
  
  const text = `${job.title} ${job.description}`.toLowerCase()
  let matches = 0
  
  keywords.forEach(keyword => {
    // Title matches weighted higher
    if (job.title.toLowerCase().includes(keyword.toLowerCase())) {
      matches += 2
    } else if (text.includes(keyword.toLowerCase())) {
      matches += 1
    }
  })
  
  // Normalize to 0-1 range
  return Math.min(matches / (keywords.length * 1.5), 1)
}

async function scrapeLinkedIn(keywords: string[], location?: string): Promise<any[]> {
  // TODO: Real implementation with Puppeteer/Playwright
  // This simulates keyword matching
  const mockJobs = [
    {
      title: 'Senior Software Engineer - React',
      company: 'TechCorp Inc.',
      description: `We are looking for a senior software engineer with 5+ years of experience in React, TypeScript, and Node.js.

Key Requirements:
- ${keywords.slice(0, 3).join(', ')}
- Building scalable web applications
- Leading a team of developers`,
      url: `https://linkedin.com/jobs/view/${Date.now()}-senior-software-engineer`,
      location: location || 'Remote',
      salaryRange: '$120k - $180k',
      source: 'linkedin',
      status: 'pending_review'
    },
    {
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      description: `Join our fast-growing startup as a full stack developer.

Tech Stack:
- ${keywords.slice(0, 4).join('\n- ')}
- React, Next.js
- PostgreSQL, Redis`,
      url: `https://linkedin.com/jobs/view/${Date.now()}-full-stack-developer`,
      location: location || 'San Francisco, CA',
      source: 'linkedin',
      status: 'pending_review'
    },
    {
      title: 'Frontend Engineer - Design Systems',
      company: 'DesignFirst Co',
      description: 'Looking for a frontend engineer passionate about design systems and component libraries. Experience with React and TypeScript required.',
      url: `https://linkedin.com/jobs/view/${Date.now()}-frontend-engineer`,
      location: location || 'New York, NY',
      source: 'linkedin',
      status: 'pending_review'
    }
  ]
  
  return mockJobs
}

async function scrapeGlassdoor(keywords: string[], location?: string): Promise<any[]> {
  const mockJobs = [
    {
      title: 'Backend Engineer - Python/Node',
      company: 'BigTech Co.',
      description: `Build scalable backend services.

Requirements:
- ${keywords.filter(k => ['python', 'node', 'backend'].some(bk => k.includes(bk))).join(', ') || 'Software development'}
- Microservices architecture
- AWS/GCP experience`,
      url: `https://glassdoor.com/job/${Date.now()}-backend-engineer`,
      location: location || 'Seattle, WA',
      salaryRange: '$130k - $190k',
      source: 'glassdoor',
      status: 'pending_review'
    },
    {
      title: 'React Native Developer',
      company: 'MobileFirst App',
      description: `Build cross-platform mobile apps with React Native.

Looking for:
- React Native experience
- ${keywords.filter(k => k.includes('react') || k.includes('typescript')).join(', ') || 'JavaScript/TypeScript'}
- Mobile app deployment`,
      url: `https://glassdoor.com/job/${Date.now()}-react-native`,
      location: location || 'Austin, TX',
      salaryRange: '$100k - $150k',
      source: 'glassdoor',
      status: 'pending_review'
    }
  ]
  
  return mockJobs
}

async function scrapeCompanyWebsite(url: string, keywords: string[]): Promise<any[]> {
  // TODO: Generic career page scraper
  // This would parse common career page structures:
  // - /careers, /jobs, /join-us paths
  // - Greenhouse, Lever, Workday, etc.
  
  console.log(`Scraping company website: ${url}`)
  
  // Mock data based on URL
  const companyName = new URL(url).hostname.replace('www.', '').split('.')[0]
  
  return [
    {
      title: `Software Engineer at ${companyName}`,
      company: companyName.charAt(0).toUpperCase() + companyName.slice(1),
      description: `Join ${companyName} as a software engineer. Looking for experience with: ${keywords.slice(0, 3).join(', ')}`,
      url: `${url}/jobs/software-engineer-${Date.now()}`,
      location: 'Various',
      source: 'company_website',
      status: 'pending_review'
    }
  ]
}

// GET endpoint to retrieve user's keywords and supported sources
export async function GET() {
  try {
    const profile = await db.userProfile.findUnique({
      where: { id: 'user' }
    })
    
    return NextResponse.json({
      defaultKeywords: DEFAULT_KEYWORDS,
      userKeywords: profile?.keywords && Array.isArray(profile.keywords) ? profile.keywords : null,
      supportedSources: ['linkedin', 'glassdoor', 'company'],
      exampleCompanyUrls: [
        'https://careers.google.com',
        'https://www.meta.com/careers',
        'https://careers.microsoft.com'
      ]
    })
  } catch (error) {
    return NextResponse.json({
      defaultKeywords: DEFAULT_KEYWORDS,
      supportedSources: ['linkedin', 'glassdoor', 'company']
    })
  }
}