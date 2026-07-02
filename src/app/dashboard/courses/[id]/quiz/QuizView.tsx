'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Option = { id: string; text: string }
type Question = { id: number; question: string; subject?: string; options: Option[]; correctAnswer: string; explanation: string }
type Content = { title?: string; subject?: string; questions?: Question[] }

export default function QuizView({ courseId, courseName, content }: { courseId: string; courseName: string; content: Content }) {
  const router = useRouter()
  const questions: Question[] = content.questions ?? []
  const subject = content.subject ?? courseName

  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [skipped, setSkipped] = useState(0)

  const q = questions[current]
  const total = questions.length
  const progress = Math.round((current / total) * 100)

  const handleSelect = (optId: string) => { if (!revealed) setSelected(optId) }

  const goNext = () => {
    if (current + 1 >= total) { setFinished(true); return }
    setCurrent((c) => c + 1); setSelected(null); setRevealed(false)
  }

  const handleNext = () => {
    if (!revealed && selected) { setRevealed(true); if (selected === q.correctAnswer) setScore((s) => s + 1); return }
    if (revealed) goNext()
  }

  const handleSkip = () => { setSkipped((s) => s + 1); goNext() }

  if (!q || total === 0) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2f2f7] text-gray-400 text-sm">No questions available.</div>
  )

  if (finished) return (
    <div className="min-h-screen bg-[#f2f2f7] flex flex-col max-w-md mx-auto">
      <header className="bg-white px-5 pt-12 pb-4 flex items-center border-b border-gray-100">
        <button onClick={() => router.push(`/dashboard/courses/${courseId}`)} className="text-[#1a1f2e] mr-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span className="font-bold text-[#1a1f2e]">Practice Quiz</span>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-5 gap-6">
        <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center">
          <svg className="w-12 h-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <div className="text-center">
          <h2 className="text-4xl font-bold text-[#1a1f2e]">{score}/{total}</h2>
          <p className="text-gray-500 mt-1 font-medium">Quiz Complete!</p>
          <p className="text-sm text-gray-400 mt-1">{Math.round((score / total) * 100)}% correct · {skipped} skipped</p>
        </div>
        <button onClick={() => router.push(`/dashboard/courses/${courseId}`)} className="w-full bg-[#1a1f2e] text-white font-semibold py-4 rounded-2xl">
          Back to Study Kit
        </button>
      </main>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f2f2f7] flex flex-col max-w-md mx-auto">
      {/* Header */}
      <header className="bg-white px-5 pt-12 pb-4 flex items-center justify-between border-b border-gray-100">
        <button onClick={() => router.push(`/dashboard/courses/${courseId}`)} className="text-[#1a1f2e]">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span className="font-bold text-[#1a1f2e]">Practice Quiz</span>
        <button className="text-gray-400">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><circle cx="4" cy="10" r="1.5"/><circle cx="10" cy="10" r="1.5"/><circle cx="16" cy="10" r="1.5"/></svg>
        </button>
      </header>

      <main className="flex-1 px-5 pt-5 pb-10 flex flex-col gap-4">
        {/* Progress */}
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span className="font-medium">Question {current + 1} of {total}</span>
            <span className="font-bold text-[#1a1f2e]">{progress}% Complete</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full">
            <div className="h-full bg-[#1a1f2e] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Subject pill */}
        <div className="flex items-center gap-2">
          <span className="bg-amber-100 text-amber-700 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
            {q.subject ?? subject}
          </span>
          <span className="text-gray-400 text-xs">· Multiple Choice</span>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-lg font-bold text-[#1a1f2e] leading-snug">{q.question}</p>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {q.options.map((opt) => {
            const isSelected = selected === opt.id
            const isCorrect = opt.id === q.correctAnswer
            let bg = 'bg-white border-gray-200'
            let letterBg = 'bg-gray-100 text-gray-500'
            if (revealed) {
              if (isCorrect) { bg = 'bg-green-50 border-green-400'; letterBg = 'bg-green-500 text-white' }
              else if (isSelected) { bg = 'bg-red-50 border-red-400'; letterBg = 'bg-red-500 text-white' }
              else { bg = 'bg-white border-gray-100 opacity-50' }
            } else if (isSelected) {
              bg = 'bg-[#1a1f2e]/5 border-[#1a1f2e]'; letterBg = 'bg-[#1a1f2e] text-white'
            }
            return (
              <button key={opt.id} onClick={() => handleSelect(opt.id)} disabled={revealed}
                className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left border-2 transition-all shadow-sm ${bg}`}>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${letterBg}`}>{opt.id}</span>
                <span className="text-sm text-[#1a1f2e] font-medium flex-1">{opt.text}</span>
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {revealed && q.explanation && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <p className="text-xs font-bold text-blue-700 mb-1 uppercase tracking-wide">Explanation</p>
            <p className="text-sm text-blue-900 leading-relaxed">{q.explanation}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 mt-auto pt-2">
          {!revealed && (
            <button onClick={handleSkip} className="flex-1 bg-white border border-gray-200 text-gray-500 font-semibold py-3.5 rounded-2xl text-sm">
              Skip for now
            </button>
          )}
          <button onClick={handleNext} disabled={!selected && !revealed}
            className="flex-1 bg-[#1a1f2e] text-white font-semibold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 disabled:opacity-40">
            {revealed ? (current + 1 < total ? 'Next Question' : 'See Results') : 'Check Answer'}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </main>
    </div>
  )
}
