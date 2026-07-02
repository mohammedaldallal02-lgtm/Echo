import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import HomeScreen from './HomeScreen'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const firstName = user.user_metadata?.full_name?.split(' ')[0] ?? user.email?.split('@')[0] ?? 'Student'

  // Fetch the 4 most recently accessed courses for this user
  const { data: recentCourses } = await supabase
    .from('courses')
    .select('id, name, created_at, last_accessed_at')
    .eq('user_id', user.id)
    .order('last_accessed_at', { ascending: false })
    .limit(4)

  return <HomeScreen firstName={firstName} recentCourses={recentCourses ?? []} />
}
