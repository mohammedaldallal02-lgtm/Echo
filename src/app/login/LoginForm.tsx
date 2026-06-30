'use client'

import { useState, useTransition } from 'react'
import { signInWithEmail, signUpWithEmail } from './actions'

export default function LoginForm() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const action = mode === 'signin' ? signInWithEmail : signUpWithEmail
      const result = await action(formData)
      if (result && 'error' in result && result.error) setMessage({ type: 'error', text: result.error })
      if (result && 'success' in result && result.success) setMessage({ type: 'success', text: result.success })
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-700/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 mb-4 shadow-lg shadow-purple-500/25">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Echo</h1>
          <p className="text-gray-400 mt-1 text-sm">
            {mode === 'signin' ? 'Welcome back — let\'s get studying' : 'Create your account to get started'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Tab switcher */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => { setMode('signin'); setMessage(null) }}
              className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all duration-200 ${
                mode === 'signin'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setMessage(null) }}
              className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all duration-200 ${
                mode === 'signup'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@university.edu"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                {mode === 'signin' && (
                  <button type="button" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                required
                placeholder="••••••••"
                minLength={6}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
              />
            </div>

            {/* Message */}
            {message && (
              <div
                className={`rounded-xl px-4 py-3 text-sm flex items-start gap-2 ${
                  message.type === 'error'
                    ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                    : 'bg-green-500/10 border border-green-500/20 text-green-400'
                }`}
              >
                <span className="mt-0.5">
                  {message.type === 'error' ? '⚠️' : '✅'}
                </span>
                {message.text}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 mt-2"
            >
              {isPending
                ? (mode === 'signin' ? 'Signing in...' : 'Creating account...')
                : (mode === 'signin' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-transparent px-3 text-xs text-gray-500">or continue with</span>
            </div>
          </div>

          {/* Google SSO placeholder */}
          <button
            type="button"
            disabled
            className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-xl py-3 text-sm text-gray-400 cursor-not-allowed opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google (coming soon)
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-6">
          By continuing, you agree to Echo&apos;s{' '}
          <span className="text-gray-500 hover:text-gray-400 cursor-pointer">Terms</span>{' '}
          and{' '}
          <span className="text-gray-500 hover:text-gray-400 cursor-pointer">Privacy Policy</span>
        </p>
      </div>
    </div>
  )
}
