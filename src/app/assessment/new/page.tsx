'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Baby, BookOpen, ChevronRight, ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { RespondentType, AgeRange, DiagnosticAwareness } from '@/types'
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

const DIAGNOSTIC_AWARENESS_OPTIONS: {
  value: DiagnosticAwareness
  label: string
  description: string
}[] = [
  {
    value: 'no_diagnosis_seeking',
    label: 'No diagnosis yet, seeking assessment',
    description: 'Never diagnosed with ASD/Asperger\'s, exploring whether a diagnosis might apply',
  },
  {
    value: 'suspected_undiagnosed',
    label: 'Suspected but not formally diagnosed',
    description: 'May have traits suggestive of ASD but no formal diagnosis',
  },
  {
    value: 'diagnosed',
    label: 'Already diagnosed with ASD/Asperger\'s',
    description: 'Have a formal diagnosis',
  },
  {
    value: 'exploring',
    label: 'Just exploring or unsure',
    description: 'Not sure yet, interested in learning more',
  },
]

type Step = 'respondent' | 'age' | 'awareness' | 'name'

export default function NewAssessmentPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [step, setStep] = useState<Step>('respondent')
  const [selected, setSelected] = useState<RespondentType | null>(null)
  const [subjectAge, setSubjectAge] = useState<number | null>(null)
  const [subjectName, setSubjectName] = useState('')
  const [diagnosticAwareness, setDiagnosticAwareness] = useState<DiagnosticAwareness | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const option = RESPONDENT_OPTIONS.find((o) => o.type === selected)
  const needsName = selected === 'parent' || selected === 'teacher'

  function handleNextStep() {
    if (step === 'respondent' && selected) {
      setStep('age')
    } else if (step === 'age' && subjectAge !== null) {
      setStep('awareness')
    } else if (step === 'awareness' && diagnosticAwareness) {
      if (needsName) {
        setStep('name')
      } else {
        submit()
      }
    } else if (step === 'name') {
      submit()
    }
  }

  function handlePrevStep() {
    if (step === 'age') setStep('respondent')
    else if (step === 'awareness') setStep('age')
    else if (step === 'name') setStep('awareness')
  }

  async function submit() {
    if (!selected || subjectAge === null || !diagnosticAwareness) return
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
        subject_age: subjectAge,
        subject_age_range: option!.ageRange,
        diagnostic_awareness: diagnosticAwareness,
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

  const canProceed = 
    (step === 'respondent' && selected) ||
    (step === 'age' && subjectAge !== null) ||
    (step === 'awareness' && diagnosticAwareness) ||
    (step === 'name' && true)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12">
        
        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            {(['respondent', 'age', 'awareness', needsName ? 'name' : null].filter(Boolean) as Step[]).map((s, i) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  step === s ? 'bg-indigo-600' : i < ['respondent', 'age', 'awareness', needsName ? 'name' : null].filter(Boolean).indexOf(step) ? 'bg-indigo-300' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {step === 'respondent' && 'Who is this screening about?'}
            {step === 'age' && `What is the age of the person being screened?`}
            {step === 'awareness' && 'Are they aware of ASD/Asperger\'s diagnosis or traits?'}
            {step === 'name' && `${selected === 'parent' ? "Child's" : "Student's"} name (optional)`}
          </h1>
          <p className="text-gray-500 text-sm">
            {step === 'respondent' && 'Select who will be completing the screening'}
            {step === 'age' && 'This helps adjust the scoring to be age-appropriate'}
            {step === 'awareness' && 'This provides important context for interpretation'}
            {step === 'name' && 'Used only to label your saved results'}
          </p>
        </div>

        {/* Content */}
        {step === 'respondent' && (
          <div className="grid sm:grid-cols-2 gap-3">
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
        )}

        {step === 'age' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {selected === 'self_adult' || selected === 'self_teen' ? 'Your age' : `${selected === 'parent' ? "Child's" : "Student's"} age`} (years)
            </label>
            <input
              type="number"
              value={subjectAge === null ? '' : subjectAge}
              onChange={(e) => setSubjectAge(e.target.value ? parseInt(e.target.value) : null)}
              placeholder="Enter age"
              min="3"
              max="100"
              className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            <p className="text-xs text-gray-400 mt-2">Enter a number between 3 and 100</p>
          </div>
        )}

        {step === 'awareness' && (
          <div className="space-y-3">
            {DIAGNOSTIC_AWARENESS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setDiagnosticAwareness(opt.value)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  diagnosticAwareness === opt.value
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-indigo-300'
                }`}
              >
                <div className="font-semibold text-gray-900 text-sm">{opt.label}</div>
                <div className="text-gray-500 text-xs mt-1">{opt.description}</div>
              </button>
            ))}
          </div>
        )}

        {step === 'name' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {selected === 'parent' ? "Child's first name" : "Student's first name"}
            </label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="First name only"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            <p className="text-xs text-gray-400 mt-1">Optional – used only to label your saved results.</p>
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-6">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={handlePrevStep}
            disabled={step === 'respondent' || loading}
            className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={handleNextStep}
            disabled={!canProceed || loading}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-40"
          >
            {step === 'name' || (step === 'awareness' && !needsName) ? (
              loading ? 'Starting…' : 'Begin screening'
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  )
}
          <ChevronRight className="w-4 h-4" />
        </button>

        <p className="text-xs text-gray-400 mt-4">
          Takes approximately 10 minutes · 30 questions across 7 areas
        </p>
      </main>
    </div>
  )
}
