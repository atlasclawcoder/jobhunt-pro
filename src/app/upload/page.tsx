'use client'

import { useEffect, useState } from 'react'

interface CVVersion {
  id: string
  name: string
  fileUrl: string
  isMaster: boolean
  createdAt: string
}

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [cvs, setCvs] = useState<CVVersion[]>([])
  const [masterCv, setMasterCv] = useState<CVVersion | null>(null)
  const [versionName, setVersionName] = useState('Master CV')

  useEffect(() => {
    fetchCVs()
  }, [])

  async function fetchCVs() {
    try {
      const response = await fetch('/api/upload')
      if (response.ok) {
        const data = await response.json()
        setCvs(data.cvs)
        setMasterCv(data.masterCv)
      }
    } catch (error) {
      console.error('Failed to fetch CVs:', error)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      setMessage('Please upload a PDF file')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setMessage('File size must be under 10MB')
      return
    }
    setSelectedFile(file)
    setMessage('')
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    
    setUploading(true)
    setMessage('')
    
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('versionName', versionName)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      const result = await response.json()
      
      if (result.success) {
        setMessage('CV uploaded successfully!')
        setSelectedFile(null)
        setVersionName('Master CV')
        fetchCVs() // Refresh the list
      } else {
        setMessage(result.error || 'Upload failed')
      }
    } catch (error) {
      setMessage('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">CV Management</h1>
      
      {/* Current Master CV */}
      {masterCv && (
        <div className="bg-white p-6 rounded-lg border border-green-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-green-800">Current Master CV</h2>
              <p className="text-green-600">{masterCv.name}</p>
              <p className="text-sm text-gray-500">
                Uploaded {new Date(masterCv.createdAt).toLocaleDateString()}
              </p>
            </div>
            <a
              href={masterCv.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              View PDF
            </a>
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Upload New CV</h2>
        
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          <div className="text-4xl mb-4">📤</div>
          <div className="text-lg font-medium text-gray-900 mb-2">
            Click to upload or drag and drop
          </div>
          <p className="text-gray-500">PDF files only (max 10MB)</p>
          
          <input
            id="fileInput"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileSelect}
          />
          
          {selectedFile && (
            <div className="mt-4 p-3 bg-blue-100 rounded-md">
              <p className="text-blue-800 font-medium">Selected: {selectedFile.name}</p>
              <p className="text-blue-600 text-sm">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</p>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Version Name
          </label>
          <input 
            type="text" 
            value={versionName}
            onChange={(e) => setVersionName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Senior Dev CV 2026"
          />
          <p className="text-sm text-gray-500 mt-1">
            Include &quot;Master&quot; in the name to set as your primary CV
          </p>
        </div>
        
        <button 
          className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedFile || uploading}
          onClick={handleUpload}
        >
          {uploading ? 'Uploading to Vercel Blob...' : 'Upload CV'}
        </button>
        
        {message && (
          <div className={`mt-4 p-3 rounded-md ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}
      </div>

      {/* CV History */}
      {cvs.length > 0 && (
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">CV History</h3>
          <div className="space-y-3">
            {cvs.map((cv) => (
              <div key={cv.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📄</span>
                  <div>
                    <div className="font-medium">{cv.name}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(cv.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {cv.isMaster && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      MASTER
                    </span>
                  )}
                  <a
                    href={cv.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm"
                  >
                    View
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Tips for best results:</h3>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start">
            <span className="text-green-600 font-semibold mr-2">✓</span>
            Use a clean PDF with selectable text (not scanned images)
          </li>
          <li className="flex items-start">
            <span className="text-green-600 font-semibold mr-2">✓</span>
            Include clear section headers: Experience, Skills, Education
          </li>
          <li className="flex items-start">
            <span className="text-green-600 font-semibold mr-2">✓</span>
            Use bullet points with specific achievements (XYZ formula)
          </li>
          <li className="flex items-start">
            <span className="text-green-600 font-semibold mr-2">✓</span>
            Avoid tables, columns, or fancy formatting that may not parse well
          </li>
        </ul>
      </div>
    </div>
  )
}