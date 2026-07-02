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
    <div className="min-h-screen flex items-center justify-center bg-[#0f1f3d] px-4">

      <div className="relative w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-black mb-4 shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Echo</h1>
          <p className="text-blue-200/70 mt-1 text-sm">
            {mode === 'signin' ? 'Welcome back — let\'s get studying' : 'Create your account to get started'}
          </p>
        </div>

        {/* Card — white */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          {/* Tab switcher */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => { setMode('signin'); setMessage(null) }}
              className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all duration-200 ${
                mode === 'signin'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setMessage(null) }}
              className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all duration-200 ${
                mode === 'signup'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Sign Up only fields */}
            {mode === 'signup' && (
              <>
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="John Smith"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all"
                  />
                </div>

                {/* Age */}
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Age
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    min={16}
                    max={100}
                    required
                    placeholder="21"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all"
                  />
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@university.edu"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                {mode === 'signin' && (
                  <button type="button" className="text-xs text-blue-600 hover:text-blue-500 transition-colors">
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
                minLength={8}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all"
              />
            </div>

            {/* Phone Number — Sign Up only */}
            {mode === 'signup' && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all"
                />
              </div>
            )}

            {/* Message */}
            {message && (
              <div
                className={`rounded-xl px-4 py-3 text-sm flex items-start gap-2 ${
                  message.type === 'error'
                    ? 'bg-red-50 border border-red-200 text-red-600'
                    : 'bg-green-50 border border-green-200 text-green-600'
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
              className="w-full bg-[#0f1f3d] hover:bg-[#1a3260] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm shadow-md mt-2"
            >
              {isPending
                ? (mode === 'signin' ? 'Signing in...' : 'Creating account...')
                : (mode === 'signin' ? 'Sign In' : 'Create Account')}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-blue-200/50 mt-6">
          By continuing, you agree to Echo&apos;s{' '}
          <span className="text-blue-200/70 hover:text-white cursor-pointer transition-colors">Terms</span>{' '}
          and{' '}
          <span className="text-blue-200/70 hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
        </p>
      </div>
    </div>
  )
}
