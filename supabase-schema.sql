
-- Supabase SQL Schema for JobHunt Pro
-- Run this in Supabase Dashboard → SQL Editor → New query

-- Enable required extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Jobs table
CREATE TABLE IF NOT EXISTS "jobs" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "title" TEXT NOT NULL,
  "company" TEXT NOT NULL,
  "description" TEXT,
  "url" TEXT NOT NULL UNIQUE,
  "location" TEXT,
  "salaryRange" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pending_review',
  "source" TEXT NOT NULL,
  "matchScore" DOUBLE PRECISION,
  "discoveredAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Applications table
CREATE TABLE IF NOT EXISTS "applications" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "jobId" TEXT NOT NULL REFERENCES "jobs"("id") ON DELETE CASCADE,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "tailoredCvPath" TEXT,
  "coverLetterPath" TEXT,
  "notes" TEXT,
  "appliedAt" TIMESTAMP WITH TIME ZONE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CV Versions table
CREATE TABLE IF NOT EXISTS "cv_versions" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "name" TEXT NOT NULL,
  "fileUrl" TEXT NOT NULL,
  "rawText" TEXT,
  "skills" JSONB,
  "experience" JSONB,
  "isMaster" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- User Profile table
CREATE TABLE IF NOT EXISTS "user_profile" (
  "id" TEXT PRIMARY KEY DEFAULT 'user',
  "name" TEXT,
  "email" TEXT,
  "phone" TEXT,
  "linkedinUrl" TEXT,
  "targetRoles" JSONB,
  "keywords" JSONB,
  "preferences" JSONB
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "jobs_status_idx" ON "jobs"("status");
CREATE INDEX IF NOT EXISTS "jobs_discoveredAt_idx" ON "jobs"("discoveredAt" DESC);
CREATE INDEX IF NOT EXISTS "applications_jobId_idx" ON "applications"("jobId");

-- Insert default user profile
INSERT INTO "user_profile" ("id", "targetRoles", "keywords", "preferences")
VALUES (
  'user',
  '["Senior Software Engineer", "Full Stack Developer", "Frontend Engineer"]',
  '["React", "TypeScript", "Node.js", "Next.js"]',
  '{"rateLimit": 1}'
)
ON CONFLICT ("id") DO NOTHING;

-- Insert sample jobs
INSERT INTO "jobs" ("title", "company", "description", "url", "location", "salaryRange", "source", "status")
VALUES (
  'Senior Software Engineer',
  'TechCorp Inc.',
  'We are looking for a senior software engineer with 5+ years of experience in React and Node.js.\n\nResponsibilities:\n- Build scalable web applications\n- Lead a team of 3-4 developers\n- Mentor junior engineers\n- Collaborate with product and design teams\n\nRequirements:\n- 5+ years of software engineering experience\n- Strong proficiency in React, TypeScript, and Node.js\n- Experience with databases (PostgreSQL, MongoDB)\n- Knowledge of cloud platforms (AWS, GCP, or Azure)\n- Excellent communication skills',
  'https://linkedin.com/jobs/view/sample-1',
  'Remote',
  '$120k - $180k',
  'linkedin',
  'pending_review'
)
ON CONFLICT ("url") DO NOTHING;

INSERT INTO "jobs" ("title", "company", "description", "url", "location", "source", "status")
VALUES (
  'Full Stack Developer',
  'StartupXYZ',
  'Join our fast-growing startup as a full stack developer. We are building the future of AI-powered productivity tools.\n\nTech Stack:\n- React, Next.js\n- TypeScript\n- PostgreSQL\n- Redis\n- Docker, Kubernetes\n\nWhat we offer:\n- Competitive salary\n- Equity\n- Remote-first culture\n- Flexible PTO',
  'https://linkedin.com/jobs/view/sample-2',
  'San Francisco, CA',
  'linkedin',
  'pending_review'
)
ON CONFLICT ("url") DO NOTHING;

INSERT INTO "jobs" ("title", "company", "description", "url", "location", "salaryRange", "source", "status")
VALUES (
  'Frontend Engineer',
  'BigTech Co.',
  'Build beautiful user interfaces that millions of users interact with daily.\n\nYou will work on:\n- Design system components\n- Performance optimization\n- Accessibility improvements\n- A/B testing infrastructure\n\nQualifications:\n- 3+ years React experience\n- Deep understanding of CSS and modern frontend tooling\n- Experience with design systems\n- Passion for user experience',
  'https://glassdoor.com/job/sample-3',
  'New York, NY',
  '$100k - $150k',
  'glassdoor',
  'approved'
)
ON CONFLICT ("url") DO NOTHING;

-- Verify tables created
SELECT 'Tables created successfully!' AS status;

-- Show table counts
SELECT 'jobs' AS table_name, COUNT(*) AS row_count FROM "jobs"
UNION ALL
SELECT 'cv_versions', COUNT(*) FROM "cv_versions"
UNION ALL
SELECT 'user_profile', COUNT(*) FROM "user_profile";