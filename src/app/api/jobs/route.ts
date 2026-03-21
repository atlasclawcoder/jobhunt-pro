import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    const jobs = await db.job.findMany({
      where: status ? { status } : undefined,
      orderBy: { discoveredAt: 'desc' },
      include: {
        applications: true
      }
    })
    
    const stats = await db.job.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    })
    
    const total = await db.job.count()
    
    const statsMap = stats.reduce((acc, curr) => {
      acc[curr.status] = curr._count.status
      return acc
    }, {} as Record<string, number>)
    
    return NextResponse.json({
      jobs,
      stats: {
        total,
        pending_review: statsMap['pending_review'] || 0,
        approved: statsMap['approved'] || 0,
        applied: statsMap['applied'] || 0,
        rejected: statsMap['rejected'] || 0
      }
    })
  } catch (error) {
    console.error('Database error:', error)
    // Return mock data if database not connected
    return NextResponse.json({
      jobs: [],
      stats: {
        total: 0,
        pending_review: 0,
        approved: 0,
        applied: 0,
        rejected: 0
      }
    })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const job = await db.job.create({
      data: {
        title: body.title,
        company: body.company,
        description: body.description,
        url: body.url,
        location: body.location,
        salaryRange: body.salaryRange,
        source: body.source || 'manual',
        status: 'pending_review'
      }
    })
    
    return NextResponse.json({ success: true, job })
  } catch (error) {
    console.error('Create job error:', error)
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    )
  }
}