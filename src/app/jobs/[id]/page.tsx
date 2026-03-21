'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface Job {
  id: string
  title: string
  company: string
  description?: string
  url: string
  location?: string
  salaryRange?: string
  status: string
  source: string
  matchScore?: number
  discoveredAt: string
}

export default function JobDetailPage() {
  const params = useParams()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchJob()
    }
  }, [params.id])

  async function fetchJob() {
    try {
      const response = await fetch(`/api/jobs/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setJob(data)
      }
    } catch (error) {
      console.error('Failed to fetch job:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove() {
    if (!job) return
    try {
      await fetch(`/api/jobs/${job.id}/approve`, { method: 'POST' })
      fetchJob()
    } catch (error) {
      alert('Failed to approve job')
    }
  }

  async function handleReject() {
    if (!job) return
    const reason = prompt('Why are you rejecting this job? (optional)')
    try {
      await fetch(`/api/jobs/${job.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      })
      fetchJob()
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

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Loading job details...</div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <h1 className="text-xl font-semibold text-gray-900">Job not found</h1>
        <a href="/jobs" className="text-blue-500 hover:underline mt-4 inline-block">
          ← Back to Job Queue
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <a href="/jobs" className="text-gray-500 hover:text-blue-500 mb-4 inline-block">
        ← Back to Job Queue
      </a>

      <div className="bg-white rounded-lg border p-6 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <div className="flex flex-wrap gap-4 mt-2 text-gray-600">
              <span>🏢 {job.company}</span>
              {job.location && <span>📍 {job.location}</span>}
              {job.salaryRange && <span>💰 {job.salaryRange}</span>}
            </div>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium text-white ${getStatusColor(job.status)}`}>
            {getStatusLabel(job.status)}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {job.status === 'pending_review' && (
            <>
              <button
                onClick={handleApprove}
                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 font-medium"
              >
                ✅ Approve for Application
              </button>
              <button
                onClick={handleReject}
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-medium"
              >
                ❌ Reject
              </button>
            </>
          )}
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
          >
            View Original Posting ↗
          </a>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-lg border p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Job Description</h2>
          {job.description ? (
            <div className="prose max-w-none">
              {job.description.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-4 text-gray-700">{paragraph}</p>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No description available.</p>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <h3 className="font-semibold mb-4">Job Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Source:</span>
                <span className="font-medium capitalize">{job.source}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Discovered:</span>
                <span className="font-medium">
                  {new Date(job.discoveredAt).toLocaleDateString()}
                </span>
              </div>
              {job.matchScore && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Match Score:</span>
                  <span className="font-medium text-green-600">
                    {Math.round(job.matchScore * 100)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {job.status === 'approved' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">
                ✅ Job approved. Ready for CV tailoring.
              </p>
              <p className="text-green-600 text-sm mt-1">
                Phase 3 coming soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}