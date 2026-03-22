import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { reason } = await request.json()
    
    const job = await db.job.update({
      where: { id },
      data: { status: 'rejected' }
    })
    
    // TODO: Store rejection reason if needed
    
    return NextResponse.json({ success: true, job })
  } catch (error) {
    console.error('Error rejecting job:', error)
    return NextResponse.json(
      { error: 'Failed to reject job', details: process.env.NODE_ENV === 'development' ? String(error) : undefined },
      { status: 500 }
    )
  }
}