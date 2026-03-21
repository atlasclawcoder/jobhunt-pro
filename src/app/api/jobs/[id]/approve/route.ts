import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const job = await db.job.update({
      where: { id },
      data: { status: 'approved' }
    })
    
    return NextResponse.json({ success: true, job })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to approve job' },
      { status: 500 }
    )
  }
}