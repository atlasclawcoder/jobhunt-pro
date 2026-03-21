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
}

interface Stats {
  total: number
  pending_review: number
  approved: number
  applied: number
  rejected: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending_review: 0,
    approved: 0,
    applied: 0,
    rejected: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const response = await fetch('/api/jobs')
      const data = await response.json()
      setStats(data.stats)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border-t-4 border-blue-500 shadow-sm">
          <div className="text-3xl font-bold text-gray-900">
            {loading ? '...' : stats.total}
          </div>
          <div className="text-sm text-gray-500">Jobs Found</div>
        </div>
        <div className="bg-white p-6 rounded-lg border-t-4 border-yellow-500 shadow-sm">
          <div className="text-3xl font-bold text-gray-900">
            {loading ? '...' : stats.pending_review}
          </div>
          <div className="text-sm text-gray-500">Pending Review</div>
        </div>
        <div className="bg-white p-6 rounded-lg border-t-4 border-green-500 shadow-sm">
          <div className="text-3xl font-bold text-gray-900">
            {loading ? '...' : stats.approved}
          </div>
          <div className="text-sm text-gray-500">Approved</div>
        </div>
        <div className="bg-white p-6 rounded-lg border-t-4 border-blue-500 shadow-sm">
          <div className="text-3xl font-bold text-gray-900">
            {loading ? '...' : stats.applied}
          </div>
          <div className="text-sm text-gray-500">Applied</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/jobs" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-2xl mb-2">👀</div>
            <div className="font-medium">Review Jobs</div>
            <div className="text-sm text-gray-500">
              {stats.pending_review} jobs waiting for approval
            </div>
          </a>
          <a href="/upload" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-2xl mb-2">📄</div>
            <div className="font-medium">Upload CV</div>
            <div className="text-sm text-gray-500">Update your master CV</div>
          </a>
          <a 
            href="/search"
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-2xl mb-2">🔍</div>
            <div className="font-medium">Find Jobs</div>
            <div className="text-sm text-gray-500">Search by keywords & sources</div>
          </a>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-lg font-semibold mb-4">System Status</h2>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <span className="text-sm">Database connected</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <span className="text-sm">Job scraper active</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
            <span className="text-sm">CV tailor (Phase 3)</span>
          </div>
        </div>
      </div>
    </div>
  )
}