'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { Alert, AlertDescription } from './ui/alert'
import { BookOpen } from 'lucide-react'

export function AuthForm() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [penName, setPenName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showResend, setShowResend] = useState(false)

  const { signIn, signUp, resendConfirmation } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setShowResend(false)

    try {
      // ✅ IMPORTANT FIX: clear guest mode on real authentication
      localStorage.removeItem('anonverse_guest')

      if (isSignUp) {
        await signUp(email, password, penName)
      } else {
        await signIn(email, password, penName)
      }
    } catch (err: any) {
      setError(err.message)
      if (
        err.message.includes('Email not confirmed') ||
        err.message.includes('confirmation')
      ) {
        setShowResend(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    try {
      await resendConfirmation(email)
      alert('Confirmation email sent! Please check your inbox.')
    } catch (err: any) {
      setError(err.message)
    }
  }

  // Guest entry (tab-based navigation → root)
  const handleGuestAccess = () => {
    localStorage.setItem('anonverse_guest', 'true')
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AnonVerse
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Share your poetry anonymously
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Welcome to AnonVerse
            </CardTitle>
            <CardDescription className="text-center">
              {isSignUp
                ? 'Create your anonymous profile'
                : 'Sign in to your account'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Tabs */}
            <div className="grid w-full grid-cols-2 mb-6">
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  !isSignUp
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isSignUp
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Sign In */}
            {!isSignUp && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            )}

            {/* Sign Up */}
            {isSignUp && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="penName">Pen Name</Label>
                  <Input
                    id="penName"
                    placeholder="Your anonymous pen name"
                    value={penName}
                    onChange={e => setPenName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            )}

            {/* Error */}
            {error && (
              <Alert className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Resend */}
            {showResend && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Email not confirmed?{' '}
                  <button
                    type="button"
                    onClick={handleResendConfirmation}
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Resend confirmation
                  </button>
                </p>
              </div>
            )}

            {/* Guest Access */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={handleGuestAccess}
                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                Continue as Guest
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
