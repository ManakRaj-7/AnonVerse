'use client'

import { useAuth } from '@/components/auth-provider'
import { AuthForm } from '@/components/auth-form'
import { MainApp } from '@/components/main-app'
import { LoadingSpinner } from '@/components/loading-spinner'

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  return <MainApp />
}
