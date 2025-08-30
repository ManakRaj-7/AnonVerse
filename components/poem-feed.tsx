'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './auth-provider'
import { PoemCard } from './poem-card'
import { LoadingSpinner } from './loading-spinner'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type Poem = Database['public']['Tables']['poems']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row']
  likes_count: number
  comments_count: number
  is_liked: boolean
}

export function PoemFeed() {
  const { user } = useAuth()
  const [poems, setPoems] = useState<Poem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPoems()
  }, [])

  const fetchPoems = async () => {
    try {
      const { data, error } = await supabase
        .from('poems')
        .select(`
          *,
          profiles (*),
          likes_count:likes(count),
          comments_count:comments(count)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching poems:', error)
      } else {
        // Transform the data to flatten the counts
        const transformedPoems = data?.map(poem => ({
          ...poem,
          likes_count: Array.isArray(poem.likes_count) ? poem.likes_count.length : 0,
          comments_count: Array.isArray(poem.comments_count) ? poem.comments_count.length : 0,
          is_liked: false, // Will be updated separately
        })) || []
        
        // If user is logged in, check which poems they've liked
        if (user && transformedPoems.length > 0) {
          const poemIds = transformedPoems.map(poem => poem.id)
          const { data: likesData } = await supabase
            .from('likes')
            .select('poem_id')
            .eq('user_id', user.id)
            .in('poem_id', poemIds)

          const likedPoemIds = new Set(likesData?.map(like => like.poem_id) || [])
          
          transformedPoems.forEach(poem => {
            poem.is_liked = likedPoemIds.has(poem.id)
          })
        }
        
        setPoems(transformedPoems)
      }
    } catch (error) {
      console.error('Error fetching poems:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (poemId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('likes')
        .insert({
          poem_id: poemId,
          user_id: user.id,
        })

      if (error && error.code !== '23505') { // Ignore duplicate key error
        console.error('Error liking poem:', error)
      } else {
        // Update local state
        setPoems(prev => prev.map(poem => 
          poem.id === poemId 
            ? { ...poem, likes_count: poem.likes_count + 1, is_liked: true }
            : poem
        ))
      }
    } catch (error) {
      console.error('Error liking poem:', error)
    }
  }

  const handleUnlike = async (poemId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('poem_id', poemId)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error unliking poem:', error)
      } else {
        // Update local state
        setPoems(prev => prev.map(poem => 
          poem.id === poemId 
            ? { ...poem, likes_count: Math.max(0, poem.likes_count - 1), is_liked: false }
            : poem
        ))
      }
    } catch (error) {
      console.error('Error unliking poem:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Poetry Feed</h1>
      
      {poems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No poems yet. Be the first to share!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {poems.map((poem) => (
            <PoemCard
              key={poem.id}
              poem={poem}
              onLike={() => handleLike(poem.id)}
              onUnlike={() => handleUnlike(poem.id)}
              onCommentAdded={fetchPoems}
            />
          ))}
        </div>
      )}
    </div>
  )
}
