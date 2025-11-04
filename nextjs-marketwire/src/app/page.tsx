'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard for authenticated users, login for others
    // For now, redirect to login
    router.push('/login')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">MarketWire</h1>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
}