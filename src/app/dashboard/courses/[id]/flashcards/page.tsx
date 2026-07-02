export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import FlashcardsView from './FlashcardsView'

export default async function FlashcardsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: material } = await supabase
    .from('course_materials').select('content').eq('course_id', id).eq('type', 'flashcards').single()

  const { data: course } = await supabase.from('courses').select('name').eq('id', id).single()

  return <FlashcardsView courseId={id} courseName={course?.name ?? ''} content={material?.content ?? {}} />
}
