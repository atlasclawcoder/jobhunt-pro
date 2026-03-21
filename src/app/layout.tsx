import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JobHunt Pro',
  description: 'Automated job search and application tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-primary">JobHunt Pro</h1>
              </div>
              <div className="flex items-center space-x-8">
                <a href="/" className="text-gray-600 hover:text-blue-500">Dashboard</a>
                <a href="/search" className="text-gray-600 hover:text-blue-500">Search</a>
                <a href="/jobs" className="text-gray-600 hover:text-blue-500">Jobs</a>
                <a href="/upload" className="text-gray-600 hover:text-blue-500">CV Upload</a>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  )
}