'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './auth-provider'
import { Navigation } from './navigation'
import { PoemFeed } from './poem-feed'
import { CreatePoem } from './create-poem'
import { Profile } from './profile'
import { supabase } from '@/lib/supabase'
import { isGuestUser } from '@/lib/isGuest'
import type { Database } from '@/lib/supabase'

type ProfileType = Database['public']['Tables']['profiles']['Row']

export function MainApp() {
  const { user, signOut } = useAuth()
  const isGuest = isGuestUser()

  const [profile, setProfile] = useState<ProfileType | null>(null)
  const [activeTab, setActiveTab] = useState<'feed' | 'create' | 'profile'>('feed')
  const [loading, setLoading] = useState(true)

  // 🔹 Handle guest users
  useEffect(() => {
    if (isGuest) {
      setActiveTab('feed')
      setLoading(false)
    }
  }, [isGuest])

  // 🔹 Handle authenticated users
  useEffect(() => {
    if (user) {
      fetchProfile()
    }
    if (!user && !isGuest) {
      // Logged out (not guest)
      setLoading(false)
    }
  }, [user, isGuest])

  const fetchProfile = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
    } else {
      setProfile(data)
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        profile={profile}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSignOut={signOut}
      />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {activeTab === 'feed' && <PoemFeed />}
        {activeTab === 'create' && !isGuest && (
          <CreatePoem onPoemCreated={() => setActiveTab('feed')} />
        )}
        {activeTab === 'profile' && !isGuest && profile && (
          <Profile profile={profile} onProfileUpdate={fetchProfile} />
        )}
      </main>
    </div>
  )
}
