import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AllCoursesScreen from './AllCoursesScreen'

export default async function AllCoursesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: courses } = await supabase
    .from('courses')
    .select('id, name, created_at, last_accessed_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return <AllCoursesScreen courses={courses ?? []} />
}
