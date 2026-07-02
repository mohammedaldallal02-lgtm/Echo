'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Material = { status: string; content: Record<string, unknown> }

const ITEMS = [
  {
    type: 'lecture-notes',
    label: 'Lecture Notes',
    description: 'Comprehensive, structured summaries capturing every critical detail, definition, and contextual nuance from your provided source material.',
    route: 'lecture-notes',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    actionLabel: 'View full summary',
  },
  {
    type: 'flashcards',
    label: 'Flash Cards',
    description: '42 interactive cards optimized for active recall and spaced repetition of key terms.',
    route: 'flashcards',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    actionLabel: '42 Cards Generated',
  },
  {
    type: 'practice-quiz',
    label: 'Practice Quizzes',
    description: 'Dynamic multiple-choice questions focusing on concept application and critical logic.',
    route: 'quiz',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    actionLabel: 'Start Quiz',
  },
  {
    type: 'practice-exam',
    label: 'Practice Exam',
    description: '50-question timed exam with varying difficulty to simulate real exam conditions.',
    route: 'exam',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    actionLabel: 'Start Exam',
  },
]

export default function CourseMaterials({
  course,
  materials: initialMaterials,
}: {
  course: { id: string; name: string }
  materials: Record<string, Material>
}) {
  const router = useRouter()
  const supabase = createClient()
  const [materials, setMaterials] = useState(initialMaterials)
  const [generating, setGenerating] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTap = async (type: string, route: string) => {
    const existing = materials[type]
    if (existing?.status === 'ready') {
      router.push(`/dashboard/courses/${course.id}/${route}`)
      return
    }
    if (generating === type) return

    setError(null)
    setGenerating(type)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const res = await fetch(`${supabaseUrl}/functions/v1/generate-material`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ course_id: course.id, type }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Generation failed')
      }

      setMaterials((prev) => ({ ...prev, [type]: { status: 'ready', content: {} } }))
      router.push(`/dashboard/courses/${course.id}/${route}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setGenerating(null)
    }
  }

  const allReady = ITEMS.every(({ type }) => materials[type]?.status === 'ready')

  return (
    <div className="min-h-screen bg-[#f2f2f7] flex flex-col max-w-md mx-auto">
      {/* Header */}
      <header className="bg-white px-5 pt-12 pb-4 flex items-center justify-between border-b border-gray-100">
        <button onClick={() => router.push('/dashboard')} className="text-[#1a1f2e]">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-bold text-[#1a1f2e] text-base">Generated Materials</span>
        <button className="text-[#1a1f2e]">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      </header>

      <main className="flex-1 px-5 pt-6 pb-28 space-y-4">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-[#1a1f2e]">Review Your Study Kit</h1>
          <p className="text-gray-500 text-sm mt-1 leading-relaxed">
            Echo AI has parsed your input. Below are the distilled components ready for your library. Select individual items to preview or save them all to your profile.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Material Cards */}
        <div className="space-y-3">
          {ITEMS.map(({ type, label, description, iconBg, iconColor, icon, route, actionLabel }) => {
            const isReady = materials[type]?.status === 'ready'
            const isGenerating = generating === type
            const isDisabled = !!generating && generating !== type

            return (
              <button
                key={type}
                onClick={() => handleTap(type, route)}
                disabled={isDisabled}
                className={`w-full text-left rounded-2xl p-4 bg-white shadow-sm border border-gray-100 transition-all active:scale-[0.98] ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${isGenerating ? 'bg-[#1a1f2e] text-white' : `${iconBg} ${iconColor}`}`}>
                    {isGenerating ? (
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                    ) : icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-[#1a1f2e] text-sm">{label}</span>
                      {isReady && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Ready</span>
                      )}
                      {isGenerating && (
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">Generating…</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{description}</p>

                    {/* Progress bar for quiz (always show as decoration when generating) */}
                    {isGenerating && (
                      <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#1a1f2e] rounded-full animate-pulse w-3/4" />
                      </div>
                    )}

                    {/* Action row */}
                    {!isGenerating && (
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs font-semibold ${isReady ? 'text-[#1a1f2e]' : 'text-gray-400'}`}>
                          {isReady ? actionLabel : 'Tap to generate'}
                        </span>
                        {isReady && (
                          <svg className="w-4 h-4 text-[#1a1f2e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </div>
                    )}
                    {isGenerating && (
                      <p className="text-xs text-gray-400 mt-1">High confidence generation</p>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </main>

      {/* Save All Button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-5 pb-8 pt-3 bg-gradient-to-t from-[#f2f2f7] to-transparent">
        <button
          onClick={() => {
            if (allReady) router.push('/dashboard')
          }}
          className="w-full bg-[#1a1f2e] text-white rounded-2xl py-4 flex items-center justify-center gap-2 text-sm font-bold shadow-lg tracking-wide"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          SAVE ALL MATERIALS
        </button>
      </div>
    </div>
  )
}
