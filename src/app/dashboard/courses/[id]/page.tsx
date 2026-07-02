import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CourseMaterials from './CourseMaterials'

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!course) redirect('/dashboard')

  // Update last accessed
  await supabase.from('courses').update({ last_accessed_at: new Date().toISOString() }).eq('id', id)

  const { data: materials } = await supabase
    .from('course_materials')
    .select('type, status, content')
    .eq('course_id', id)

  const materialsMap: Record<string, { status: string; content: Record<string, unknown> }> = {}
  materials?.forEach((m) => { materialsMap[m.type] = { status: m.status, content: m.content } })

  return <CourseMaterials course={course} materials={materialsMap} />
}
