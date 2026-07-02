'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function NewCourseForm() {
  const router = useRouter()
  const supabase = createClient()

  const pdfInputRef = useRef<HTMLInputElement>(null)
  const mp3InputRef = useRef<HTMLInputElement>(null)

  const [fileName, setFileName] = useState('')
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [mp3File, setMp3File] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!fileName.trim()) { setError('Please enter a file name.'); return }
    if (!pdfFile && !mp3File) { setError('Please upload at least one file.'); return }

    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      let pdfPath: string | null = null
      let mp3Path: string | null = null

      // Upload PDF
      if (pdfFile) {
        const ext = pdfFile.name.split('.').pop()
        pdfPath = `${user.id}/${Date.now()}-${fileName.replace(/\s+/g, '-')}.${ext}`
        const { error: uploadErr } = await supabase.storage
          .from('course-pdfs')
          .upload(pdfPath, pdfFile, { upsert: false })
        if (uploadErr) throw new Error(`PDF upload failed: ${uploadErr.message}`)
      }

      // Upload MP3
      if (mp3File) {
        const ext = mp3File.name.split('.').pop()
        mp3Path = `${user.id}/${Date.now()}-${fileName.replace(/\s+/g, '-')}.${ext}`
        const { error: uploadErr } = await supabase.storage
          .from('course-audio')
          .upload(mp3Path, mp3File, { upsert: false })
        if (uploadErr) throw new Error(`Audio upload failed: ${uploadErr.message}`)
      }

      // Save course record
      const { error: dbErr } = await supabase.from('courses').insert({
        user_id: user.id,
        name: fileName.trim(),
        pdf_path: pdfPath,
        mp3_path: mp3Path,
      })
      if (dbErr) throw new Error(`Failed to save course: ${dbErr.message}`)

      // Get the newly created course id
      const { data: newCourse } = await supabase
        .from('courses')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', fileName.trim())
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      router.push(`/dashboard/courses/${newCourse?.id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

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
        <button onClick={() => router.push('/dashboard')} className="text-white">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 px-5 pt-6 pb-28 space-y-5">

        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold text-[#1a1f2e]">Create New File</h1>
          <p className="text-gray-500 text-sm mt-1 leading-relaxed">
            Upload your academic materials to begin processing your smart study guide.
          </p>
        </div>

        {/* File Name */}
        <div>
          <label className="block text-sm font-semibold text-[#1a1f2e] mb-1.5">File Name</label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="e.g. Physics 101-Lecture 4"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e]/20 transition-all"
          />
        </div>

        {/* Upload PDF */}
        <div>
          <label className="block text-sm font-semibold text-[#1a1f2e] mb-1.5">Upload PDF</label>
          <input ref={pdfInputRef} type="file" accept=".pdf" className="hidden"
            onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)} />
          <button
            type="button"
            onClick={() => pdfInputRef.current?.click()}
            className={`w-full rounded-xl border-2 border-dashed px-4 py-8 flex flex-col items-center justify-center gap-2 transition-all bg-white ${
              pdfFile ? 'border-[#1a1f2e]' : 'border-gray-300'
            }`}
          >
            {pdfFile ? (
              <>
                <div className="w-14 h-14 rounded-2xl bg-[#1a1f2e] flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-[#1a1f2e]">{pdfFile.name}</p>
                <p className="text-xs text-gray-400">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB · Tap to change</p>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl bg-[#1a1f2e] flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6M9 17h4" />
                  </svg>
                </div>
                <p className="text-base font-bold text-[#1a1f2e]">Upload PDF</p>
                <p className="text-xs text-gray-400">Drag and drop or click to browse</p>
              </>
            )}
          </button>
        </div>

        {/* Upload Voice Memo or MP3 */}
        <div>
          <label className="block text-sm font-semibold text-[#1a1f2e] mb-1.5">Upload Voice Memo or MP3</label>
          <input ref={mp3InputRef} type="file" accept=".mp3,.m4a,.wav,audio/*" className="hidden"
            onChange={(e) => setMp3File(e.target.files?.[0] ?? null)} />
          <button
            type="button"
            onClick={() => mp3InputRef.current?.click()}
            className={`w-full rounded-xl border-2 border-dashed px-4 py-8 flex flex-col items-center justify-center gap-3 transition-all bg-white ${
              mp3File ? 'border-[#1a1f2e]' : 'border-gray-300'
            }`}
          >
            {mp3File ? (
              <>
                <div className="w-14 h-14 rounded-2xl bg-[#1a1f2e] flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-[#1a1f2e]">{mp3File.name}</p>
                <p className="text-xs text-gray-400">{(mp3File.size / 1024 / 1024).toFixed(2)} MB · Tap to change</p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  {/* Mic icon — warm yellow */}
                  <div className="w-14 h-14 rounded-2xl bg-[#f5c842] flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <span className="text-gray-400 font-semibold text-sm">OR</span>
                  {/* File icon — teal */}
                  <div className="w-14 h-14 rounded-2xl bg-[#4ecdc4] flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                </div>
                <p className="text-base font-bold text-[#1a1f2e]">Upload Voice Memo or MP3</p>
                <p className="text-xs text-gray-400">Record live or select an existing audio file</p>
              </>
            )}
          </button>
        </div>


        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Start Processing Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#1a1f2e] text-white rounded-2xl py-4 flex items-center justify-center gap-2 text-base font-semibold shadow-sm disabled:opacity-60 transition-opacity"
        >
          {loading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Uploading...
            </>
          ) : (
            <>
              Start Processing
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 px-8 py-3 flex items-center justify-around">
        <button onClick={() => router.push('/dashboard')} className="flex flex-col items-center gap-1 text-gray-400">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H15.75v-6h-7.5v6H3.75A.75.75 0 013 21V9.75z" />
          </svg>
          <span className="text-xs font-medium">Home</span>
        </button>
        <button onClick={() => router.push('/dashboard/all-courses')} className="flex flex-col items-center gap-1 text-gray-400">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
          </svg>
          <span className="text-xs font-medium">Courses</span>
        </button>
      </nav>

    </div>
  )
}
