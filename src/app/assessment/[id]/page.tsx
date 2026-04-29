'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { QUESTIONS, DOMAINS } from '@/lib/questions'
import { calculateResults } from '@/lib/scoring'
import QuestionCard from '@/components/QuestionCard'
import type { RespondentType } from '@/types'

export default function AssessmentPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createClient()

  const [respondentType, setRespondentType] = useState<RespondentType>('self_adult')
  const [responses, setResponses] = useState<Record<string, number>>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('assessments')
        .select('respondent_type, status')
        .eq('id', id)
        .single()
      if (!data) { router.push('/dashboard'); return }
      if (data.status === 'completed') { router.push(`/results/${id}`); return }
      setRespondentType(data.respondent_type as RespondentType)

      const { data: existing } = await supabase
        .from('responses')
        .select('question_id, score')
        .eq('assessment_id', id)
      if (existing) {
        const map: Record<string, number> = {}
        existing.forEach((r) => { map[r.question_id] = r.score })
        setResponses(map)
        const answeredCount = Object.keys(map).length
        if (answeredCount > 0) setCurrentIndex(Math.min(answeredCount, QUESTIONS.length - 1))
      }
      setLoading(false)
    }
    load()
  }, [id])

  const question = QUESTIONS[currentIndex]
  const progress = Math.round((Object.keys(responses).length / QUESTIONS.length) * 100)
  const currentDomain = DOMAINS.find((d) => d.key === question?.domain)

  function handleAnswer(score: number) {
    setResponses((prev) => ({ ...prev, [question.id]: score }))
  }

  function goNext() {
    if (currentIndex < QUESTIONS.length - 1) setCurrentIndex((i) => i + 1)
  }

  function goPrev() {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1)
  }

  async function handleSubmit() {
    if (Object.keys(responses).length < QUESTIONS.length) return
    setSaving(true)

    const upserts = Object.entries(responses).map(([question_id, score]) => ({
      assessment_id: id,
      question_id,
      score,
    }))

    await supabase.from('responses').upsert(upserts, { onConflict: 'assessment_id,question_id' })

    const { domainScores, totalScore, tier } = calculateResults(responses)

    await supabase.from('results').upsert({
      assessment_id: id,
      domain_scores: domainScores,
      total_score: totalScore,
      tier,
    }, { onConflict: 'assessment_id' })

    await supabase
      .from('assessments')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', id)

    router.push(`/results/${id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading…
      </div>
    )
  }

  const isLast = currentIndex === QUESTIONS.length - 1
  const allAnswered = Object.keys(responses).length === QUESTIONS.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress bar */}
      <div className="h-1.5 bg-gray-200">
        <div
          className="h-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <main className="max-w-2xl mx-auto px-4 py-10">
        {/* Domain label */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
            style={{
              backgroundColor: currentDomain ? `${currentDomain.color}20` : '#e0e7ff',
              color: currentDomain?.color ?? '#6366f1',
            }}
          >
            {currentDomain?.label}
          </span>
          <span className="text-xs text-gray-400">
            {Object.keys(responses).length} / {QUESTIONS.length} answered
          </span>
        </div>

        <QuestionCard
          questionNumber={currentIndex + 1}
          total={QUESTIONS.length}
          text={question.text[respondentType]}
          value={responses[question.id]}
          onChange={handleAnswer}
        />

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {isLast ? (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-40 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              {saving ? 'Saving…' : 'Submit & see results'}
            </button>
          ) : (
            <button
              onClick={goNext}
              disabled={responses[question.id] === undefined}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-40 transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {!allAnswered && isLast && (
          <p className="text-xs text-amber-600 mt-3 text-right">
            Please answer all questions before submitting.
          </p>
        )}

        {/* Question dots for navigation */}
        <div className="flex flex-wrap gap-1.5 mt-8 justify-center">
          {QUESTIONS.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(i)}
              className={`w-3 h-3 rounded-full transition-colors ${
                i === currentIndex
                  ? 'bg-indigo-600'
                  : responses[q.id] !== undefined
                  ? 'bg-indigo-200'
                  : 'bg-gray-200'
              }`}
              title={`Question ${i + 1}`}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
