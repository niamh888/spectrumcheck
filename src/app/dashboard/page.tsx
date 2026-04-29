import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TIER_CONFIG } from '@/lib/scoring'
import Navbar from '@/components/Navbar'
import { PlusCircle, ChevronRight, Clock } from 'lucide-react'
import type { ScoreTier } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const { data: assessments } = await supabase
    .from('assessments')
    .select('id, respondent_type, subject_name, subject_age_range, status, created_at, completed_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const completedIds = (assessments ?? [])
    .filter((a) => a.status === 'completed')
    .map((a) => a.id)

  const { data: results } = completedIds.length
    ? await supabase
        .from('results')
        .select('assessment_id, total_score, tier')
        .in('assessment_id', completedIds)
    : { data: [] }

  const resultMap = Object.fromEntries((results ?? []).map((r) => [r.assessment_id, r]))

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'

  function respondentLabel(type: string) {
    if (type === 'self_adult' || type === 'self_teen') return 'Self'
    if (type === 'parent') return 'Parent report'
    if (type === 'teacher') return 'Teacher report'
    return type
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userEmail={user.email} />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hello, {firstName}</h1>
            <p className="text-gray-500 text-sm mt-0.5">Your screening history</p>
          </div>
          <Link
            href="/assessment/new"
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            New screening
          </Link>
        </div>

        {(!assessments || assessments.length === 0) ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <p className="text-gray-500 mb-4">You haven&apos;t completed any screenings yet.</p>
            <Link
              href="/assessment/new"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Start your first screening
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {assessments.map((a) => {
              const result = resultMap[a.id]
              const tierConfig = result ? TIER_CONFIG[result.tier as ScoreTier] : null
              const date = new Date(a.created_at).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'short', year: 'numeric',
              })

              return (
                <div
                  key={a.id}
                  className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-gray-900 text-sm">
                        {a.subject_name ? `${a.subject_name} — ` : ''}{respondentLabel(a.respondent_type)}
                      </span>
                      {a.status === 'in_progress' && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                          In progress
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {date}
                      </span>
                      {result && (
                        <span className={`font-medium ${tierConfig?.color}`}>
                          Score: {result.total_score}/100
                        </span>
                      )}
                    </div>
                  </div>

                  {result && tierConfig && (
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${tierConfig.bg} ${tierConfig.color} ${tierConfig.border} hidden sm:inline-flex shrink-0`}>
                      {tierConfig.label.split(' —')[0]}
                    </span>
                  )}

                  <Link
                    href={a.status === 'completed' ? `/results/${a.id}` : `/assessment/${a.id}`}
                    className="flex items-center gap-1 text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors shrink-0"
                  >
                    {a.status === 'completed' ? 'View' : 'Continue'}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
