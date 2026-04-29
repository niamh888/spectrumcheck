'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Brain, LogOut, LayoutDashboard } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function Navbar({ userEmail }: { userEmail?: string | null }) {
  const router = useRouter()
  const supabase = createClient()

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-indigo-700 text-lg">
          <Brain className="w-5 h-5" />
          SpectrumCheck
        </Link>

        <div className="flex items-center gap-4">
          {userEmail ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-indigo-700 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <button
                onClick={signOut}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm text-gray-600 hover:text-indigo-700 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
