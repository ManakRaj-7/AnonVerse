'use client'

import React, { useState } from 'react'
import { useAuth } from './auth-provider'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Textarea } from './ui/textarea'
import { Alert, AlertDescription } from './ui/alert'
import { User, Edit, Save, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

interface ProfileProps {
  profile: Profile | null
  onProfileUpdate: () => void
}

export function Profile({ profile, onProfileUpdate }: ProfileProps) {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [penName, setPenName] = useState(profile?.pen_name || '')
  const [bio, setBio] = useState(profile?.bio || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)

  // Fetch follower counts and follow status
  const fetchFollowData = async () => {
    if (!profile) return

    try {
      // Get followers count
      const { count: followers } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', profile.id)

      // Get following count
      const { count: following } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', profile.id)

      // Check if current user is following this profile
      if (user && user.id !== profile.id) {
        const { data: followData } = await supabase
          .from('followers')
          .select('*')
          .eq('follower_id', user.id)
          .eq('following_id', profile.id)
          .single()

        setIsFollowing(!!followData)
      }

      setFollowersCount(followers || 0)
      setFollowingCount(following || 0)
    } catch (error) {
      console.error('Error fetching follow data:', error)
    }
  }

  const handleFollow = async () => {
    if (!user || !profile || user.id === profile.id) return

    setFollowLoading(true)
    try {
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('followers')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', profile.id)

        if (error) throw error
        setIsFollowing(false)
        setFollowersCount(prev => Math.max(0, prev - 1))
      } else {
        // Follow
        const { error } = await supabase
          .from('followers')
          .insert({
            follower_id: user.id,
            following_id: profile.id,
          })

        if (error) throw error
        setIsFollowing(true)
        setFollowersCount(prev => prev + 1)
      }
    } catch (error) {
      console.error('Error following/unfollowing:', error)
    } finally {
      setFollowLoading(false)
    }
  }

  // Fetch follow data when profile changes
  React.useEffect(() => {
    fetchFollowData()
  }, [profile])

  const handleSave = async () => {
    if (!user || !penName.trim()) return

    setLoading(true)
    setError('')

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          pen_name: penName.trim(),
          bio: bio.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        setIsEditing(false)
        onProfileUpdate()
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setPenName(profile?.pen_name || '')
    setBio(profile?.bio || '')
    setError('')
    setIsEditing(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <User className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your anonymous profile and pen name
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Your pen name and bio are visible to other users
              </CardDescription>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="penName">Pen Name</Label>
                <Input
                  id="penName"
                  value={penName}
                  onChange={(e) => setPenName(e.target.value)}
                  placeholder="Your anonymous pen name"
                  required
                  maxLength={50}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio (Optional)</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  maxLength={500}
                />
                <div className="text-sm text-muted-foreground text-right">
                  {bio.length}/500 characters
                </div>
              </div>

              {error && (
                <Alert>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <AlertDescription>
                    Profile updated successfully!
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={loading || !penName.trim()}
                  className="flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Pen Name
                </Label>
                <p className="text-lg font-semibold mt-1">
                  {profile?.pen_name || 'Anonymous'}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Bio
                </Label>
                <p className="mt-1">
                  {profile?.bio || 'No bio added yet.'}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Member Since
                </Label>
                <p className="mt-1">
                  {profile?.created_at 
                    ? new Date(profile.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Unknown'
                  }
                </p>
              </div>

              {/* Follow Stats */}
              <div className="flex items-center space-x-6 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{followersCount}</div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{followingCount}</div>
                  <div className="text-sm text-muted-foreground">Following</div>
                </div>
              </div>

              {/* Follow Button - Only show if viewing someone else's profile */}
              {user && profile && user.id !== profile.id && (
                <div className="pt-4">
                  <Button
                    onClick={handleFollow}
                    disabled={followLoading}
                    variant={isFollowing ? "outline" : "default"}
                    className="w-full"
                  >
                    {followLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    ) : null}
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
