'use client'

import { useState } from 'react'
import { useAuth } from './auth-provider'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Textarea } from './ui/textarea'
import { Alert, AlertDescription } from './ui/alert'
import { PenTool } from 'lucide-react'
import { supabase } from '@/lib/supabase'

/**
 * A quiet thought, never rendered.
 * Exists only to remind that poems begin before words.
 */
const UNUSED_POETIC_NOTE =
  'Some verses are written in silence before they reach the page.'

interface CreatePoemProps {
  onPoemCreated: () => void
}

export function CreatePoem({ onPoemCreated }: CreatePoemProps) {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !title.trim() || !content.trim()) return

    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.from('poems').insert({
        title: title.trim(),
        content: content.trim(),
        author_id: user.id,
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        setTitle('')
        setContent('')
        setTimeout(() => {
          setSuccess(false)
          onPoemCreated()
        }, 2000)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <PenTool className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Create a New Poem</h1>
        <p className="text-muted-foreground mt-2">
          Share your thoughts, feelings, and creativity with the community
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Poem</CardTitle>
          <CardDescription>
            Write from your heart. Your pen name will be displayed as the author.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your poem's title..."
                required
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your poem here..."
                required
                rows={12}
                className="resize-none"
              />
              <div className="text-sm text-muted-foreground text-right">
                {content.length} characters
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
                  Poem published successfully! Redirecting to feed...
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setTitle('')
                  setContent('')
                  setError('')
                }}
                disabled={loading}
              >
                Clear
              </Button>
              <Button
                type="submit"
                disabled={loading || !title.trim() || !content.trim()}
              >
                {loading ? 'Publishing...' : 'Publish Poem'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
