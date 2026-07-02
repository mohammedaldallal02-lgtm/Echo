'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Course = {
  id: string
  name: string
  created_at: string
  last_accessed_at: string
}

export default function AllCoursesScreen({ courses }: { courses: Course[] }) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#f2f2f7] flex flex-col max-w-md mx-auto">
      {/* Header */}
      <header className="bg-[#1a1f2e] px-5 pt-12 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0121 12c0 3.866-3.582 7-8 7s-8-3.134-8-7a12.083 12.083 0 012.84-1.422L12 14z" />
          </svg>
          <span className="text-white font-bold text-lg">Echo</span>
        </div>
        <button
          onClick={() => router.push('/dashboard/new-course')}
          className="bg-white/10 text-white rounded-xl px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New
        </button>
      </header>

      {/* Main */}
      <main className="flex-1 px-5 pt-6 pb-28 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1f2e]">My Courses</h1>
          <p className="text-gray-500 text-sm mt-1">
            {courses.length === 0 ? 'No courses yet — create one to get started.' : `${courses.length} course${courses.length !== 1 ? 's' : ''} saved`}
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm text-center">Upload your first course to start generating study materials.</p>
            <button
              onClick={() => router.push('/dashboard/new-course')}
              className="bg-[#1a1f2e] text-white rounded-2xl px-6 py-3 text-sm font-semibold"
            >
              + Create New Course
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {courses.map((course) => {
              const date = new Date(course.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              return (
                <Link
                  key={course.id}
                  href={`/dashboard/courses/${course.id}`}
                  className="flex items-center justify-between bg-white rounded-2xl px-4 py-4 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[#1a1f2e] font-semibold text-sm">{course.name}</p>
                      <p className="text-gray-400 text-xs mt-0.5">Created {date}</p>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )
            })}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 px-8 py-3 flex items-center justify-around">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-gray-400">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H15.75v-6h-7.5v6H3.75A.75.75 0 013 21V9.75z" />
          </svg>
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link href="/dashboard/all-courses" className="flex flex-col items-center gap-1 text-[#1a1f2e]">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" fill="none"/>
          </svg>
          <span className="text-xs font-bold">Courses</span>
        </Link>
      </nav>
    </div>
  )
}
