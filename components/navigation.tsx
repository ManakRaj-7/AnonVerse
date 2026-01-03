'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { BookOpen, PenTool, User, LogOut, ChevronDown, LogIn } from 'lucide-react'
import { isGuestUser } from '@/lib/isGuest'
import type { Database } from '@/lib/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

interface NavigationProps {
  profile: Profile | null
  activeTab: 'feed' | 'create' | 'profile'
  onTabChange: (tab: 'feed' | 'create' | 'profile') => void
  onSignOut: () => Promise<void>
}

export function Navigation({
  profile,
  activeTab,
  onTabChange,
  onSignOut,
}: NavigationProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const isGuest = isGuestUser()

  const handleSignOut = async () => {
    await onSignOut()
    setShowUserMenu(false)
  }

  const handleExitGuest = () => {
    localStorage.removeItem('anonverse_guest')
    window.location.href = '/'
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">AnonVerse</span>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-1">
            <Button
              variant={activeTab === 'feed' ? 'default' : 'ghost'}
              onClick={() => onTabChange('feed')}
              className="flex items-center space-x-2"
            >
              <BookOpen className="h-4 w-4" />
              <span>Feed</span>
            </Button>

            {!isGuest && (
              <Button
                variant={activeTab === 'create' ? 'default' : 'ghost'}
                onClick={() => onTabChange('create')}
                className="flex items-center space-x-2"
              >
                <PenTool className="h-4 w-4" />
                <span>Create</span>
              </Button>
            )}

            {!isGuest && (
              <Button
                variant={activeTab === 'profile' ? 'default' : 'ghost'}
                onClick={() => onTabChange('profile')}
                className="flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Button>
            )}
          </div>

          {/* User / Guest Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2"
            >
              <span className="font-medium">
                {isGuest ? 'Guest' : profile?.pen_name || 'Anonymous'}
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>

            {showUserMenu && (
              <Card className="absolute right-0 top-full mt-2 w-48 z-50">
                <CardContent className="p-2 space-y-1">
                  <div className="px-3 py-2 text-sm font-medium">
                    {isGuest ? 'Guest User' : profile?.pen_name}
                  </div>

                  <div className="border-t" />

                  {isGuest ? (
                    <>
                      <div className="px-3 py-2 text-xs text-muted-foreground">
                        Sign in to create, like, or comment
                      </div>
                      <Button
                        variant="ghost"
                        onClick={handleExitGuest}
                        className="w-full justify-start"
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign In
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      onClick={handleSignOut}
                      className="w-full justify-start"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
