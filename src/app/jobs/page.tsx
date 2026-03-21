'use client'

import { useEffect, useState } from 'react'

interface Job {
  id: string
  title: string
  company: string
  location?: string
  status: string
  source: string
  discoveredAt: string
  description?: string
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [filter])

  async function fetchJobs() {
    setLoading(true)
    try {
      const url = filter === 'all' 
        ? '/api/jobs' 
        : `/api/jobs?status=${filter}`
      const response = await fetch(url)
      const data = await response.json()
      setJobs(data.jobs)
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove(id: string) {
    try {
      await fetch(`/api/jobs/${id}/approve`, { method: 'POST' })
      fetchJobs()
    } catch (error) {
      alert('Failed to approve job')
    }
  }

  async function handleReject(id: string) {
    const reason = prompt('Why are you rejecting this job? (optional)')
    try {
      await fetch(`/api/jobs/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      })
      fetchJobs()
    } catch (error) {
      alert('Failed to reject job')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_review': return 'bg-yellow-500'
      case 'approved': return 'bg-green-500'
      case 'applied': return 'bg-blue-500'
      case 'rejected': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Job Queue</h1>
        <div className="flex flex-wrap gap-2">
          {['all', 'pending_review', 'approved', 'applied'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === status
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100 border'
              }`}
            >
              {status === 'all' ? 'All' : getStatusLabel(status)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-500">Loading jobs...</div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-500 mb-4">
            {filter === 'all' 
              ? 'Click "Find Jobs" on the dashboard to discover new opportunities.'
              : `No jobs with status "${getStatusLabel(filter)}".`
            }
          </p>
          {filter !== 'all' && (
            <button 
              onClick={() => setFilter('all')}
              className="text-blue-500 hover:underline"
            >
              View all jobs
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg border p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                    <span>🏢 {job.company}</span>
                    {job.location && <span>📍 {job.location}</span>}
                    <span>from {job.source}</span>
                    <span>{new Date(job.discoveredAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(job.status)}`}>
                  {getStatusLabel(job.status)}
                </span>
              </div>

              {job.description && (
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {job.description.substring(0, 200)}...
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                <a
                  href={`/jobs/${job.id}`}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                >
                  View Details
                </a>
                {job.status === 'pending_review' && (
                  <>
                    <button
                      onClick={() => handleApprove(job.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(job.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}