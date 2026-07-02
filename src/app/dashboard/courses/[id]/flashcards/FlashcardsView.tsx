'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Card = { front: string; back: string }
type Content = { cards?: Card[] }

export default function FlashcardsView({ courseId, courseName, content }: { courseId: string; courseName: string; content: Content }) {
  const router = useRouter()
  const cards: Card[] = content.cards ?? []
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const current = cards[index]
  const total = cards.length

  return (
    <div className="min-h-screen bg-[#f2f2f7] flex flex-col max-w-md mx-auto">
      <header className="bg-[#1a1f2e] px-5 pt-12 pb-4 flex items-center justify-between">
        <button onClick={() => router.push(`/dashboard/courses/${courseId}`)} className="text-white">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-white font-bold">Flash Cards</span>
        <span className="text-white/60 text-sm">{index + 1}/{total}</span>
      </header>

      <main className="flex-1 px-5 pt-8 pb-10 flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-bold text-[#1a1f2e]">{courseName}</h1>
          <p className="text-sm text-gray-500">{total} cards · Tap card to flip</p>
        </div>

        {/* Progress */}
        <div className="w-full h-1.5 bg-gray-200 rounded-full">
          <div className="h-full bg-[#1a1f2e] rounded-full transition-all duration-300" style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>

        {/* Card */}
        {current ? (
          <button
            onClick={() => setFlipped(!flipped)}
            className="w-full min-h-52 bg-white rounded-3xl shadow-md p-6 flex flex-col items-center justify-center gap-3 active:scale-[0.98] transition-transform"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{flipped ? 'Answer' : 'Question'}</span>
            <p className="text-lg font-semibold text-[#1a1f2e] text-center leading-snug">
              {flipped ? current.back : current.front}
            </p>
            <span className="text-xs text-gray-400 mt-2">Tap to {flipped ? 'see question' : 'reveal answer'}</span>
          </button>
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center text-gray-400 shadow-sm">No flashcards available.</div>
        )}

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            disabled={index === 0}
            onClick={() => { setIndex(index - 1); setFlipped(false) }}
            className="flex-1 bg-white border border-gray-200 text-[#1a1f2e] font-semibold py-3 rounded-2xl disabled:opacity-40 transition-opacity"
          >
            ← Previous
          </button>
          <button
            disabled={index === total - 1}
            onClick={() => { setIndex(index + 1); setFlipped(false) }}
            className="flex-1 bg-[#1a1f2e] text-white font-semibold py-3 rounded-2xl disabled:opacity-40 transition-opacity"
          >
            Next →
          </button>
        </div>
      </main>
    </div>
  )
}
