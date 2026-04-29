import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TIER_CONFIG, calculateAllScoringMethods } from '@/lib/scoring'
import { DomainBarChart, DomainRadarChart } from '@/components/DomainChart'
import Navbar from '@/components/Navbar'
import ScoringComparison from '@/components/ScoringComparison'
import type { DomainScore, ScoreTier, AgeRange, RespondentType } from '@/types'
import { ArrowLeft, PlusCircle } from 'lucide-react'
import PrintButton from '@/components/PrintButton'

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: result, error: resultError } = await supabase
    .from('results')
    .select('*, assessments(respondent_type, subject_name, subject_age, subject_age_range, diagnostic_awareness, completed_at)')
    .eq('assessment_id', id)
    .single()

  if (!result) {
    console.error(`Results not found for assessment ${id}:`, resultError)
    notFound()
  }

  const tier = result.tier as ScoreTier
  const config = TIER_CONFIG[tier]
  const domainScores = result.domain_scores as DomainScore[]
  const assessmentData = result.assessments as { respondent_type: string; subject_name: string | null; subject_age: number | null; subject_age_range: string; diagnostic_awareness: string | null; completed_at: string }
  const completedDate = new Date(assessmentData.completed_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  // Fetch responses to calculate alternative scoring methods
  const { data: responses } = await supabase
    .from('responses')
    .select('question_id, score')
    .eq('assessment_id', id)
  
  const responseMap: Record<string, number> = {}
  responses?.forEach((r) => {
    responseMap[r.question_id] = r.score
  })

  // Calculate all scoring methods
  const scoringResults = calculateAllScoringMethods(
    responseMap,
    assessmentData.subject_age_range as AgeRange,
    assessmentData.respondent_type as RespondentType
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userEmail={user.email} />
      <main className="max-w-3xl mx-auto px-4 py-10 print:py-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <div className="flex gap-2">
            <PrintButton />
            <Link
              href="/assessment/new"
              className="flex items-center gap-1.5 text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              New screening
            </Link>
          </div>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Screening Results
            {assessmentData.subject_name ? ` — ${assessmentData.subject_name}` : ''}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Completed {completedDate}</p>
        </div>

        {/* Assessment Context */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {assessmentData.subject_age && (
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Age</p>
              <p className="text-lg font-semibold text-gray-900">{assessmentData.subject_age} years</p>
            </div>
          )}
          {assessmentData.diagnostic_awareness && (
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Diagnostic Status</p>
              <p className="text-sm font-semibold text-gray-900">
                {assessmentData.diagnostic_awareness === 'no_diagnosis_seeking' && 'Seeking assessment'}
                {assessmentData.diagnostic_awareness === 'suspected_undiagnosed' && 'Suspected undiagnosed'}
                {assessmentData.diagnostic_awareness === 'diagnosed' && 'Already diagnosed'}
                {assessmentData.diagnostic_awareness === 'exploring' && 'Exploring'}
              </p>
            </div>
          )}
        </div>

        {/* Tier badge */}
        <div className={`rounded-2xl border p-5 mb-8 ${config.bg} ${config.border}`}>
          <p className={`font-bold text-lg mb-2 ${config.color}`}>{config.label}</p>
          <p className={`text-sm leading-relaxed ${config.color}`}>{config.message}</p>
        </div>

        {/* Overall score */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-indigo-50 border-4 border-indigo-200 flex items-center justify-center shrink-0">
            <span className="text-xl font-bold text-indigo-700">{result.total_score}</span>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Overall score</p>
            <p className="text-sm text-gray-500">Out of 100 across all seven domains</p>
          </div>
        </div>

        {/* Bar chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Domain breakdown</h2>
          <DomainBarChart domainScores={domainScores} />
        </div>

        {/* Radar chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-2">Profile overview</h2>
          <p className="text-sm text-gray-400 mb-4">A radar view shows which areas are most prominent.</p>
          <DomainRadarChart domainScores={domainScores} />
        </div>

        {/* Scoring Comparison */}
        <div className="mb-8">
          <ScoringComparison results={scoringResults} />
        </div>

        {/* Domain detail */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
          <h2 className="font-semibold text-gray-900 mb-4">Score by area</h2>
          <div className="space-y-4">
            {domainScores.map((d) => (
              <div key={d.domain}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{d.label}</span>
                  <span className="text-sm font-semibold" style={{ color: d.color }}>{d.score}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${d.score}%`, backgroundColor: d.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
          <strong>This is a screening tool, not a diagnostic instrument.</strong> Results do not
          constitute a diagnosis and should not be treated as one. Only a qualified clinician —
          such as a psychologist, psychiatrist, or developmental paediatrician — can make a formal
          diagnosis. If you have concerns, please speak with your GP or seek a specialist referral.
        </div>
      </main>
    </div>
  )
}
