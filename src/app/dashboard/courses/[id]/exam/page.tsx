import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ExamView from './ExamView'

export default async function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: material } = await supabase
    .from('course_materials').select('content').eq('course_id', id).eq('type', 'practice-exam').single()

  const { data: course } = await supabase.from('courses').select('name').eq('id', id).single()

  return <ExamView courseId={id} courseName={course?.name ?? ''} content={material?.content ?? {}} />
}
