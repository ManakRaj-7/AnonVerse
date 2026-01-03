'use client'

import { useAuth } from '@/components/auth-provider'
import { AuthForm } from '@/components/auth-form'
import { MainApp } from '@/components/main-app'
import { LoadingSpinner } from '@/components/loading-spinner'
import { isGuestUser } from '@/lib/isGuest'

export default function Home() {
  const { user, loading } = useAuth()
  const isGuest = isGuestUser()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  // ✅ Allow guest users to access the app
  if (!user && !isGuest) {
    return <AuthForm />
  }

  return <MainApp />
}
