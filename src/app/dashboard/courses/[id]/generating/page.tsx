'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const MATERIALS = [
  { type: 'lecture-notes', label: 'Lecture Notes' },
  { type: 'flashcards', label: 'Flash Cards' },
  { type: 'practice-quiz', label: 'Practice Quiz' },
  { type: 'practice-exam', label: 'Practice Exam' },
]

const PHASES = [
  'Analysing your materials...',
  'Extracting key concepts...',
  'Building your study kit...',
  'Finalising content...',
]

export default function GeneratingPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const supabase = createClient()

  const [progress, setProgress] = useState(0)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [statuses, setStatuses] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const triggered = useRef(false)

  // Trigger all 4 edge function calls once
  useEffect(() => {
    if (triggered.current) return
    triggered.current = true

    const generate = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

      // Fire all 4 in parallel
      await Promise.allSettled(
        MATERIALS.map(({ type }) =>
          fetch(`${supabaseUrl}/functions/v1/generate-material`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ course_id: id, type }),
          })
        )
      )
    }

    generate().catch((e) => setError(e.message))
  }, [id])

  // Simulate progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) return p
        return p + Math.random() * 3
      })
    }, 600)
    return () => clearInterval(interval)
  }, [])

  // Cycle through phase labels
  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseIndex((i) => (i + 1) % PHASES.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Poll DB for material statuses
  useEffect(() => {
    const poll = async () => {
      const { data } = await supabase
        .from('course_materials')
        .select('type, status')
        .eq('course_id', id)

      if (!data) return

      const statusMap: Record<string, string> = {}
      data.forEach((m) => { statusMap[m.type] = m.status })
      setStatuses(statusMap)

      const allReady = MATERIALS.every((m) => statusMap[m.type] === 'ready')
      if (allReady) {
        setProgress(100)
        clearInterval(poller)
        setTimeout(() => router.push(`/dashboard/courses/${id}`), 800)
      }
    }

    poll()
    const poller = setInterval(poll, 3000)
    return () => clearInterval(poller)
  }, [id])

  const readyCount = MATERIALS.filter((m) => statuses[m.type] === 'ready').length

  return (
    <div className="min-h-screen bg-[#f2f2f7] flex flex-col max-w-md mx-auto">
      {/* Header */}
      <header className="bg-[#1a1f2e] px-5 pt-12 pb-4 flex items-center gap-2">
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0121 12c0 3.866-3.582 7-8 7s-8-3.134-8-7a12.083 12.083 0 012.84-1.422L12 14z" />
        </svg>
        <span className="text-white font-bold text-lg">Echo</span>
      </header>

      <main className="flex-1 px-5 pt-8 pb-10 flex flex-col gap-6">
        <div>
          <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">Phase 02: Synthesis</p>
          <h1 className="text-3xl font-bold text-[#1a1f2e]">Generating Materials</h1>
        </div>

        {/* Animated Icon */}
        <div className="flex justify-center py-4">
          <div className="relative w-32 h-32">
            {/* Rotating outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#1a1f2e]/20 animate-spin" style={{ animationDuration: '8s' }} />
            {/* Inner card */}
            <div className="absolute inset-4 bg-[#1a1f2e] rounded-3xl flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <p className="text-sm text-gray-500">Echo AI is distilling your lecture...</p>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-[#1a1f2e]">{PHASES[phaseIndex]}</span>
              <span className="text-sm font-bold text-[#1a1f2e]">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1a1f2e] rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <p className="text-xs text-gray-400">
            {readyCount} of {MATERIALS.length} materials ready
          </p>
        </div>

        {/* Material status list */}
        <div className="space-y-2.5">
          {MATERIALS.map(({ type, label }) => {
            const status = statuses[type] ?? 'pending'
            return (
              <div key={type} className="bg-white rounded-2xl px-4 py-3.5 flex items-center justify-between shadow-sm">
                <span className="text-sm font-medium text-[#1a1f2e]">{label}</span>
                {status === 'ready' ? (
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">Ready</span>
                ) : status === 'generating' ? (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                    <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Generating
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">Pending</span>
                )}
              </div>
            )
          })}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
            ⚠️ {error}
          </div>
        )}
      </main>
    </div>
  )
}
