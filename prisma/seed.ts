import { db } from './src/lib/db'

async function main() {
  console.log('Start seeding...')
  
  // Create sample jobs
  const sampleJobs = [
    {
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      description: `We are looking for a senior software engineer with 5+ years of experience in React and Node.js.

Responsibilities:
- Build scalable web applications
- Lead a team of 3-4 developers
- Mentor junior engineers
- Collaborate with product and design teams

Requirements:
- 5+ years of software engineering experience
- Strong proficiency in React, TypeScript, and Node.js
- Experience with databases (PostgreSQL, MongoDB)
- Knowledge of cloud platforms (AWS, GCP, or Azure)
- Excellent communication skills`,
      url: 'https://linkedin.com/jobs/view/senior-software-engineer-1',
      location: 'Remote',
      salaryRange: '$120k - $180k',
      source: 'linkedin',
      status: 'pending_review'
    },
    {
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      description: `Join our fast-growing startup as a full stack developer. We're building the future of AI-powered productivity tools.

Tech Stack:
- React, Next.js
- TypeScript
- PostgreSQL
- Redis
- Docker, Kubernetes

What we offer:
- Competitive salary
- Equity
- Remote-first culture
- Flexible PTO`,
      url: 'https://linkedin.com/jobs/view/full-stack-developer-2',
      location: 'San Francisco, CA',
      source: 'linkedin',
      status: 'pending_review'
    },
    {
      title: 'Frontend Engineer',
      company: 'BigTech Co.',
      description: `Build beautiful user interfaces that millions of users interact with daily.

You'll work on:
- Design system components
- Performance optimization
- Accessibility improvements
- A/B testing infrastructure

Qualifications:
- 3+ years React experience
- Deep understanding of CSS and modern frontend tooling
- Experience with design systems
- Passion for user experience`,
      url: 'https://glassdoor.com/job/frontend-engineer-3',
      location: 'New York, NY',
      salaryRange: '$100k - $150k',
      source: 'glassdoor',
      status: 'approved'
    }
  ]
  
  for (const jobData of sampleJobs) {
    try {
      await db.job.create({
        data: jobData
      })
      console.log(`Created job: ${jobData.title} at ${jobData.company}`)
    } catch (e) {
      console.log(`Job already exists: ${jobData.title}`)
    }
  }
  
  // Create user profile
  await db.userProfile.upsert({
    where: { id: 'user' },
    update: {},
    create: {
      id: 'user',
      targetRoles: JSON.stringify(['Senior Software Engineer', 'Full Stack Developer', 'Frontend Engineer']),
      keywords: JSON.stringify(['React', 'TypeScript', 'Node.js', 'Next.js']),
      preferences: JSON.stringify({ rateLimit: 1 })
    }
  })
  
  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })