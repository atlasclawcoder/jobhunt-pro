import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const job = await db.job.update({
      where: { id: params.id },
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