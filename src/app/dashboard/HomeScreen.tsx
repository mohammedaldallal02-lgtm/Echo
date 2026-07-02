'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Course = {
  id: string
  name: string
  created_at: string
  last_accessed_at: string
}

export default function HomeScreen({ firstName, recentCourses }: { firstName: string; recentCourses: Course[] }) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#f2f2f7] flex flex-col max-w-md mx-auto relative">

      {/* Header */}
      <header className="bg-[#1a1f2e] px-5 pt-12 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0121 12c0 3.866-3.582 7-8 7s-8-3.134-8-7a12.083 12.083 0 012.84-1.422L12 14z" />
          </svg>
          <span className="text-white font-bold text-lg">Echo</span>
        </div>
        <button className="text-white">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 pt-6 pb-28 space-y-5">

        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-bold text-[#1a1f2e] leading-tight">
            Welcome back, {firstName}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Your academic dashboard is ready for today&apos;s tasks.</p>
        </div>

        {/* New Course Button */}
        <button
          onClick={() => router.push('/dashboard/new-course')}
          className="w-full bg-[#1a1f2e] text-white rounded-2xl py-4 flex items-center justify-center gap-2 text-base font-semibold shadow-sm active:opacity-90 transition-opacity"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8" />
          </svg>
          New Course
        </button>

        {/* My Courses Button */}
        <button
          onClick={() => router.push('/dashboard/all-courses')}
          className="w-full bg-[#e5e5ea] text-[#1a1f2e] rounded-2xl py-4 flex items-center justify-center gap-2 text-base font-semibold shadow-sm active:opacity-90 transition-opacity"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          My Courses
        </button>

        {/* Recently Visited Courses — only shown if courses exist */}
        {recentCourses.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-[#1a1f2e] mb-3">Recently visited courses</h2>
            <div className="space-y-2.5">
              {recentCourses.map((course) => (
                <div
                  key={course.id}
                  className="w-full bg-white rounded-2xl px-4 py-4 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#f2f2f7] flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#1a1f2e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <span className="text-[#1a1f2e] font-medium text-sm">{course.name}</span>
                  </div>
                  <Link
                    href={`/dashboard/courses/${course.id}`}
                    className="text-[#1a1f2e] font-semibold text-sm"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 px-8 py-3 flex items-center justify-around">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-[#1a1f2e]">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span className="text-xs font-bold">Home</span>
        </Link>
        <Link href="/dashboard/all-courses" className="flex flex-col items-center gap-1 text-gray-400">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
          </svg>
          <span className="text-xs font-medium">Courses</span>
        </Link>
      </nav>

    </div>
  )
}
