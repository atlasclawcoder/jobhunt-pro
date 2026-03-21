# JobHunt Pro - Phase 2.5: Advanced Search

## ✅ Enhanced Features

### Keyword-Based Search
- Select multiple keywords from predefined list
- Toggle keywords on/off
- Real-time keyword matching
- Match score calculation (0-100%)

### Multi-Source Job Discovery
- **LinkedIn** - Job listings scraping
- **Glassdoor** - Company reviews + jobs
- **Company Websites** - Custom career page URLs
- Support for Greenhouse, Lever, Workday, etc.

### Search Interface
- Dedicated `/search` page
- Keyword selection UI
- Location filtering
- Source selection (checkboxes)
- Multiple company URL inputs
- Live results preview

### Smart Matching
- Title matches weighted 2x
- Description matches weighted 1x
- Relevance scoring algorithm
- Results sorted by match score

## API Enhancements

### POST /api/scrape
```json
{
  "keywords": ["software engineer", "react", "typescript"],
  "location": "Remote",
  "sources": ["linkedin", "glassdoor", "company"],
  "companyUrls": ["https://stripe.com/jobs"]
}
```

### Response
```json
{
  "success": true,
  "count": 5,
  "keywords": ["software engineer", "react", "typescript"],
  "jobs": [
    {
      "id": "...",
      "title": "Senior Software Engineer",
      "company": "TechCorp",
      "matchScore": 0.85,
      "source": "linkedin"
    }
  ]
}
```

## Next: Phase 3
- CV parsing
- ATS analysis
- AI-powered tailoring