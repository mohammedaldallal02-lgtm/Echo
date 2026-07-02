'use client'

import { useRouter } from 'next/navigation'

type Section = { heading: string; content: string; keyPoints: string[] }
type Content = { title?: string; summary?: string; sections?: Section[] }

export default function LectureNotesView({ courseId, courseName, content }: { courseId: string; courseName: string; content: Content }) {
  const router = useRouter()
  const sections: Section[] = content.sections ?? []

  return (
    <div className="min-h-screen bg-[#f2f2f7] flex flex-col max-w-md mx-auto">
      <header className="bg-[#1a1f2e] px-5 pt-12 pb-4 flex items-center justify-between">
        <button onClick={() => router.push(`/dashboard/courses/${courseId}`)} className="text-white">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-white font-bold">Lecture Notes</span>
        <div className="w-6" />
      </header>

      <main className="flex-1 px-5 pt-6 pb-10 space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1f2e]">{content.title ?? courseName}</h1>
          {content.summary && <p className="text-gray-500 text-sm mt-2 leading-relaxed">{content.summary}</p>}
        </div>

        {sections.map((sec, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-[#1a1f2e]">{sec.heading}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{sec.content}</p>
            {sec.keyPoints?.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {sec.keyPoints.map((pt, j) => (
                  <div key={j} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1a1f2e] mt-1.5 shrink-0" />
                    <span className="text-sm text-gray-700">{pt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {sections.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-400 shadow-sm">
            No notes available yet.
          </div>
        )}
      </main>
    </div>
  )
}
