'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Option = { id: string; text: string }
type Question = { id: number; question: string; subject?: string; topic?: string; difficulty?: string; options: Option[]; correctAnswer: string; explanation: string }
type Content = { title?: string; subject?: string; duration?: number; questions?: Question[] }

export default function ExamView({ courseId, courseName, content }: { courseId: string; courseName: string; content: Content }) {
  const router = useRouter()
  const questions: Question[] = content.questions ?? []
  const totalSeconds = (content.duration ?? 60) * 60
  const subject = content.subject ?? courseName

  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [flagged, setFlagged] = useState<Set<number>>(new Set())
  const [current, setCurrent] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(totalSeconds)

  const total = questions.length

  useEffect(() => {
    if (submitted) return
    const t = setInterval(() => setTimeLeft((s) => { if (s <= 1) { setSubmitted(true); return 0 } return s - 1 }), 1000)
    return () => clearInterval(t)
  }, [submitted])

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0')
  const secs = (timeLeft % 60).toString().padStart(2, '0')
  const score = submitted ? questions.filter((q) => answers[q.id] === q.correctAnswer).length : 0
  const q = questions[current]

  const toggleFlag = () => {
    setFlagged((prev) => {
      const next = new Set(prev)
      if (next.has(current)) next.delete(current); else next.add(current)
      return next
    })
  }

  if (submitted) return (
    <div className="min-h-screen bg-[#f2f2f7] flex flex-col max-w-md mx-auto">
      <header className="bg-white px-5 pt-12 pb-4 flex items-center border-b border-gray-100">
        <button onClick={() => router.push(`/dashboard/courses/${courseId}`)} className="text-[#1a1f2e] mr-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span className="font-bold text-[#1a1f2e]">Practice Exam</span>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-5 gap-6">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <div className="text-center">
          <h2 className="text-4xl font-bold text-[#1a1f2e]">{score}/{total}</h2>
          <p className="text-gray-500 mt-1 font-medium">Exam Complete!</p>
          <p className="text-sm text-gray-400 mt-1">{Math.round((score / total) * 100)}% correct</p>
        </div>
        <button onClick={() => router.push(`/dashboard/courses/${courseId}`)} className="w-full bg-[#1a1f2e] text-white font-semibold py-4 rounded-2xl">
          Back to Study Kit
        </button>
      </main>
    </div>
  )

  if (!q) return <div className="min-h-screen flex items-center justify-center text-gray-400">No questions available.</div>

  const progress = Math.round((current / total) * 100)

  return (
    <div className="min-h-screen bg-[#f2f2f7] flex flex-col max-w-md mx-auto">
      {/* Header */}
      <header className="bg-[#1a1f2e] px-5 pt-12 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="text-white font-bold">Practice Exam</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/10 rounded-xl px-3 py-1.5">
          <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className={`text-sm font-bold ${timeLeft < 300 ? 'text-red-400' : 'text-white'}`}>{mins}:{secs}</span>
          <span className="text-white/50 text-xs">remaining</span>
        </div>
      </header>

      <main className="flex-1 px-5 pt-5 pb-10 flex flex-col gap-4 overflow-y-auto">
        {/* Progress */}
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span className="font-medium">Question {current + 1} of {total}</span>
            <span className="font-bold text-[#1a1f2e]">{progress}% Complete</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full">
            <div className="h-full bg-[#1a1f2e] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Subject + topic tag */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
            {q.subject ?? subject}{q.topic ? ` · ${q.topic}` : ''}
          </span>
          {q.difficulty && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              q.difficulty === 'Hard' ? 'bg-red-100 text-red-600' :
              q.difficulty === 'Medium' ? 'bg-amber-100 text-amber-600' :
              'bg-green-100 text-green-600'
            }`}>{q.difficulty}</span>
          )}
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-base font-bold text-[#1a1f2e] leading-snug">{q.question}</p>
        </div>

        {/* Radio options */}
        <div className="space-y-2.5">
          {q.options.map((opt) => {
            const isSelected = answers[q.id] === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => setAnswers({ ...answers, [q.id]: opt.id })}
                className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left border-2 transition-all bg-white shadow-sm ${
                  isSelected ? 'border-[#1a1f2e]' : 'border-transparent'
                }`}
              >
                {/* Radio circle */}
                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  isSelected ? 'border-[#1a1f2e]' : 'border-gray-300'
                }`}>
                  {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-[#1a1f2e]" />}
                </span>
                <span className="text-xs font-bold text-gray-400 w-5 shrink-0">{opt.id}.</span>
                <span className="text-sm text-[#1a1f2e] font-medium flex-1">{opt.text}</span>
              </button>
            )
          })}
        </div>

        {/* Question Map */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#1a1f2e]">Question Map</span>
            <div className="flex items-center gap-3 text-[10px] text-gray-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#1a1f2e] inline-block" /> Completed</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-200 border border-gray-300 inline-block" /> Unanswered</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {questions.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                  i === current ? 'bg-[#1a1f2e] text-white ring-2 ring-offset-1 ring-[#1a1f2e]' :
                  flagged.has(i) ? 'bg-amber-400 text-white' :
                  answers[questions[i].id] ? 'bg-[#1a1f2e]/70 text-white' :
                  'bg-gray-100 text-gray-500'
                }`}>
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom bar */}
      <div className="bg-white border-t border-gray-100 px-5 py-4 flex items-center gap-3">
        <button onClick={toggleFlag}
          className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-3 rounded-2xl border transition-all ${
            flagged.has(current) ? 'bg-amber-50 border-amber-300 text-amber-600' : 'border-gray-200 text-gray-500'
          }`}>
          <svg className="w-4 h-4" fill={flagged.has(current) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
          </svg>
          Flag for Review
        </button>

        {current + 1 < total ? (
          <button onClick={() => setCurrent(current + 1)}
            className="flex-1 bg-[#1a1f2e] text-white font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 text-sm">
            Next Question
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        ) : (
          <button onClick={() => setSubmitted(true)}
            className="flex-1 bg-green-600 text-white font-semibold py-3 rounded-2xl text-sm">
            Submit Exam
          </button>
        )}
      </div>
    </div>
  )
}
