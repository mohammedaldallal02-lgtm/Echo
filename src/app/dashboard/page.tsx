import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/login/actions'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome to Echo 🎓</h1>
        <p className="text-gray-400 mb-6">Signed in as <span className="text-purple-400">{user.email}</span></p>
        <form action={signOut}>
          <button
            type="submit"
            className="bg-white/10 hover:bg-white/15 border border-white/10 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all"
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  )
}
