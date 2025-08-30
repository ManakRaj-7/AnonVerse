'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { BookOpen, PenTool, User, LogOut, ChevronDown } from 'lucide-react'
import type { Database } from '@/lib/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

interface NavigationProps {
  profile: Profile | null
  activeTab: 'feed' | 'create' | 'profile'
  onTabChange: (tab: 'feed' | 'create' | 'profile') => void
  onSignOut: () => Promise<void>
}

export function Navigation({ profile, activeTab, onTabChange, onSignOut }: NavigationProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleSignOut = async () => {
    await onSignOut()
    setShowUserMenu(false)
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
            <Button
              variant={activeTab === 'create' ? 'default' : 'ghost'}
              onClick={() => onTabChange('create')}
              className="flex items-center space-x-2"
            >
              <PenTool className="h-4 w-4" />
              <span>Create</span>
            </Button>
            <Button
              variant={activeTab === 'profile' ? 'default' : 'ghost'}
              onClick={() => onTabChange('profile')}
              className="flex items-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Button>
          </div>

          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2"
            >
              <span className="font-medium">{profile?.pen_name || 'Anonymous'}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>

            {showUserMenu && (
              <Card className="absolute right-0 top-full mt-2 w-48 z-50">
                <CardContent className="p-2">
                  <div className="space-y-1">
                    <div className="px-3 py-2 text-sm font-medium">
                      {profile?.pen_name || 'Anonymous'}
                    </div>
                    <div className="border-t" />
                    <Button
                      variant="ghost"
                      onClick={handleSignOut}
                      className="w-full justify-start"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
