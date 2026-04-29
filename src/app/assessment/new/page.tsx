'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Baby, BookOpen, Stethoscope, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { RespondentType, AgeRange } from '@/types'
import Navbar from '@/components/Navbar'

const RESPONDENT_OPTIONS: {
  type: RespondentType
  label: string
  sublabel: string
  icon: React.ReactNode
  ageRange: AgeRange
}[] = [
  {
    type: 'self_adult',
    label: 'About myself',
    sublabel: 'I am 18 or older',
    icon: <User className="w-6 h-6" />,
    ageRange: 'adult_18_plus',
  },
  {
    type: 'self_teen',
    label: 'About myself',
    sublabel: 'I am 13–17 years old',
    icon: <User className="w-6 h-6" />,
    ageRange: 'teen_13_17',
  },
  {
    type: 'parent',
    label: 'About my child',
    sublabel: 'I am a parent or caregiver',
    icon: <Baby className="w-6 h-6" />,
    ageRange: 'child_5_12',
  },
  {
    type: 'teacher',
    label: 'About a student',
    sublabel: 'I am a teacher or school professional',
    icon: <BookOpen className="w-6 h-6" />,
    ageRange: 'child_5_12',
  },
]

export default function NewAssessmentPage() {
  const router = useRouter()
  const supabase = createClient()
  const [selected, setSelected] = useState<RespondentType | null>(null)
  const [subjectName, setSubjectName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const option = RESPONDENT_OPTIONS.find((o) => o.type === selected)
  const needsName = selected === 'parent' || selected === 'teacher'

  async function start() {
    if (!selected || !option) return
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }

    const { data, error } = await supabase
      .from('assessments')
      .insert({
        user_id: user.id,
        respondent_type: selected,
        subject_name: needsName ? subjectName || null : null,
        subject_age_range: option.ageRange,
        status: 'in_progress',
      })
      .select('id')
      .single()

    setLoading(false)
    if (error || !data) {
      setError('Could not create assessment. Please try again.')
      return
    }
    router.push(`/assessment/${data.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Start a new screening</h1>
          <p className="text-gray-500 text-sm">Who is this screening about?</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          {RESPONDENT_OPTIONS.map((opt) => (
            <button
              key={opt.type}
              onClick={() => setSelected(opt.type)}
              className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                selected === opt.type
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 bg-white hover:border-indigo-300'
              }`}
            >
              <span
                className={`mt-0.5 ${selected === opt.type ? 'text-indigo-600' : 'text-gray-400'}`}
              >
                {opt.icon}
              </span>
              <span>
                <span className="block font-semibold text-gray-900 text-sm">{opt.label}</span>
                <span className="block text-gray-500 text-xs mt-0.5">{opt.sublabel}</span>
              </span>
            </button>
          ))}
        </div>

        {needsName && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {selected === 'parent' ? "Child's first name" : "Student's first name"}{' '}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="First name only"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-gray-400 mt-1">Used only to label your saved results.</p>
          </div>
        )}

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <button
          onClick={start}
          disabled={!selected || loading}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-40"
        >
          {loading ? 'Starting…' : 'Begin screening'}
          <ChevronRight className="w-4 h-4" />
        </button>

        <p className="text-xs text-gray-400 mt-4">
          Takes approximately 10 minutes · 30 questions across 7 areas
        </p>
      </main>
    </div>
  )
}
