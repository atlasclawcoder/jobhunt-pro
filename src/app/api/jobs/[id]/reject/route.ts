import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { reason } = await request.json()
    
    const job = await db.job.update({
      where: { id: params.id },
      data: { status: 'rejected' }
    })
    
    // TODO: Store rejection reason if needed
    
    return NextResponse.json({ success: true, job })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to reject job' },
      { status: 500 }
    )
  }
}