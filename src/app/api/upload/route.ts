import { put } from '@vercel/blob'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const versionName = formData.get('versionName') as string || 'Master CV'
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are accepted' }, { status: 400 })
    }
    
    // Upload to Vercel Blob
    const blob = await put(`cvs/${Date.now()}-${file.name}`, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN
    })
    
    // Try to extract text from PDF (basic implementation)
    // In production, you'd use a PDF parsing service
    const rawText = null // Placeholder for PDF text extraction
    
    // Save to database
    // If this is marked as master, unmark others
    if (versionName.toLowerCase().includes('master')) {
      await db.cVVersion.updateMany({
        where: { isMaster: true },
        data: { isMaster: false }
      })
    }
    
    const cvVersion = await db.cVVersion.create({
      data: {
        name: versionName,
        fileUrl: blob.url,
        rawText,
        isMaster: versionName.toLowerCase().includes('master')
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'CV uploaded successfully',
      filename: file.name,
      versionName,
      url: blob.url,
      cvId: cvVersion.id
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: 'Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 })
  }
}

// GET endpoint to retrieve CV versions
export async function GET() {
  try {
    const cvs = await db.cVVersion.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    const masterCv = cvs.find(cv => cv.isMaster)
    
    return NextResponse.json({
      cvs,
      masterCv: masterCv || null
    })
  } catch (error) {
    console.error('Fetch CVs error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch CVs'
    }, { status: 500 })
  }
}