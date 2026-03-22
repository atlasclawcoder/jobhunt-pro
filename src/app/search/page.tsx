'use client'

import { useState } from 'react'

export default function SearchPage() {
  const [keywords, setKeywords] = useState<string[]>(['software engineer', 'react', 'typescript'])
  const [location, setLocation] = useState('')
  const [sources, setSources] = useState<string[]>(['linkedin', 'glassdoor'])
  const [companyUrls, setCompanyUrls] = useState<string[]>([''])
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)

  const jobRoles = [
    'product manager', 'event planner', 'project manager', 'data analyst',
    'marketing manager', 'business analyst', 'ux designer', 'graphic designer',
    'sales manager', 'operations manager', 'hr manager', 'financial analyst',
    'software engineer', 'developer', 'full stack', 'frontend', 'backend',
    'devops engineer', 'qa engineer', 'mobile developer'
  ]

  const technicalSkills = [
    'react', 'vue', 'angular', 'typescript', 'javascript', 'node', 'python',
    'java', 'c++', 'go', 'rust', 'sql', 'postgresql', 'mongodb',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'ci/cd', 'git',
    'rest api', 'graphql', 'microservices', 'agile', 'scrum'
  ]

  const availableKeywords = [...jobRoles, ...technicalSkills]

  const toggleKeyword = (keyword: string) => {
    if (keywords.includes(keyword)) {
      setKeywords(keywords.filter(k => k !== keyword))
    } else {
      setKeywords([...keywords, keyword])
    }
  }

  const toggleSource = (source: string) => {
    if (sources.includes(source)) {
      setSources(sources.filter(s => s !== source))
    } else {
      setSources([...sources, source])
    }
  }

  const addCompanyUrl = () => {
    setCompanyUrls([...companyUrls, ''])
  }

  const updateCompanyUrl = (index: number, value: string) => {
    const newUrls = [...companyUrls]
    newUrls[index] = value
    setCompanyUrls(newUrls)
  }

  const handleSearch = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywords,
          location: location || undefined,
          sources,
          companyUrls: companyUrls.filter(url => url.trim() !== '')
        })
      })
      
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Advanced Job Search</h1>
      
      {/* Job Roles */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Job Roles</h2>
        <div className="flex flex-wrap gap-2">
          {jobRoles.map(role => (
            <button
              key={role}
              onClick={() => toggleKeyword(role)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                keywords.includes(role)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Technical Skills */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Technical Skills & Frameworks</h2>
        <div className="flex flex-wrap gap-2">
          {technicalSkills.map(skill => (
            <button
              key={skill}
              onClick={() => toggleKeyword(skill)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                keywords.includes(skill)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-3">
          Selected: {keywords.join(', ')}
        </p>
      </div>

      {/* Location */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Location (Optional)</h2>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g., Remote, San Francisco, New York"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Sources */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Job Sources</h2>
        <div className="flex gap-4">
          {['linkedin', 'glassdoor', 'company'].map(source => (
            <label key={source} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sources.includes(source)}
                onChange={() => toggleSource(source)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="capitalize">{source.replace('_', ' ')}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Company URLs */}
      {sources.includes('company') && (
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Company Career Pages</h2>
          <div className="space-y-3">
            {companyUrls.map((url, index) => (
              <input
                key={index}
                type="url"
                value={url}
                onChange={(e) => updateCompanyUrl(index, e.target.value)}
                placeholder="https://company.com/careers"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            ))}
          </div>
          <button
            onClick={addCompanyUrl}
            className="mt-3 text-blue-500 hover:underline text-sm"
          >
            + Add another company
          </button>
        </div>
      )}

      {/* Search Button */}
      <button
        onClick={handleSearch}
        disabled={loading || keywords.length === 0}
        className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Searching...' : `Search Jobs (${sources.length} sources)`}
      </button>

      {/* Results */}
      {results && (
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            Results: {results.count} jobs found
          </h2>
          {results.count > 0 ? (
            <div className="space-y-4">
              {results.jobs.map((job: any) => (
                <div key={job.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{job.title}</h3>
                      <p className="text-gray-600">{job.company}</p>
                      <p className="text-sm text-gray-500">{job.location}</p>
                    </div>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {Math.round((job.matchScore || 0.5) * 100)}% match
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {job.description}
                  </p>
                </div>
              ))}
              <a
                href="/jobs"
                className="block text-center py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                View All Jobs →
              </a>
            </div>
          ) : (
            <p className="text-gray-500">No jobs found with these keywords.</p>
          )}
        </div>
      )}
    </div>
  )
}