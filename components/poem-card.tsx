'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Heart, MessageCircle, User, Clock } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
import { useAuth } from './auth-provider'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type Poem = Database['public']['Tables']['poems']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row']
  likes_count: number
  comments_count: number
  is_liked: boolean
}

type Comment = Database['public']['Tables']['comments']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row']
}

interface PoemCardProps {
  poem: Poem
  onLike: () => void
  onUnlike: () => void
  onCommentAdded: () => void
}

export function PoemCard({
  poem,
  onLike,
  onUnlike,
  onCommentAdded,
}: PoemCardProps) {
  const { user } = useAuth()
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loadingComments, setLoadingComments] = useState(false)
  const [submittingComment, setSubmittingComment] = useState(false)

  const handleToggleComments = async () => {
    if (!showComments && comments.length === 0) {
      await fetchComments()
    }
    setShowComments(!showComments)
  }

  const fetchComments = async () => {
    setLoadingComments(true)
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`*, profiles (*)`)
        .eq('poem_id', poem.id)
        .order('created_at', { ascending: true })

      if (!error) {
        setComments(data || [])
      }
    } catch (err) {
      console.error('Error fetching comments:', err)
    } finally {
      setLoadingComments(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newComment.trim()) return

    setSubmittingComment(true)
    try {
      const { error } = await supabase.from('comments').insert({
        poem_id: poem.id,
        author_id: user.id,
        content: newComment.trim(),
      })

      if (!error) {
        setNewComment('')
        await fetchComments()
        onCommentAdded()
      }
    } catch (err) {
      console.error('Error adding comment:', err)
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleLikeClick = () => {
    poem.is_liked ? onUnlike() : onLike()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{poem.profiles.pen_name}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatRelativeTime(poem.created_at)}</span>
          </div>
        </div>
        <h3 className="text-xl font-semibold">{poem.title}</h3>
      </CardHeader>

      <CardContent>
        <div className="prose prose-sm max-w-none mb-4">
          <p className="whitespace-pre-wrap">{poem.content}</p>
        </div>

        <div className="flex items-center space-x-4">
          {/* ❤️ Likes */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLikeClick}
            className={`flex items-center space-x-1 ${
              poem.is_liked ? 'text-red-500' : 'text-muted-foreground'
            }`}
          >
            <Heart
              className={`h-4 w-4 ${poem.is_liked ? 'fill-current' : ''}`}
            />
            <span>{poem.likes_count}</span>
          </Button>

          {/* 💬 Comments (ICON ONLY, NO COUNT) */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleComments}
            className="flex items-center"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>

        {showComments && (
          <div className="mt-6 border-t pt-4 space-y-4">
            <h4 className="font-medium">Comments</h4>

            {loadingComments ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin h-6 w-6 border-b-2 border-primary rounded-full" />
              </div>
            ) : comments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No comments yet.
              </p>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="flex space-x-3">
                  <User className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="font-medium">
                        {comment.profiles.pen_name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              ))
            )}

            {user && (
              <form
                onSubmit={handleSubmitComment}
                className="flex space-x-2 pt-2"
              >
                <Input
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  disabled={submittingComment}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={submittingComment || !newComment.trim()}
                >
                  Post
                </Button>
              </form>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
