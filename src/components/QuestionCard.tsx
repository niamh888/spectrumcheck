'use client'

import { SCORE_LABELS } from '@/lib/scoring'

interface Props {
  questionNumber: number
  total: number
  text: string
  value: number | undefined
  onChange: (score: number) => void
}

export default function QuestionCard({ questionNumber, total, text, value, onChange }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <p className="text-xs font-medium text-indigo-500 uppercase tracking-wide mb-3">
        Question {questionNumber} of {total}
      </p>
      <p className="text-gray-900 font-medium text-base leading-relaxed mb-6">{text}</p>

      <div className="flex flex-col sm:flex-row gap-2">
        {SCORE_LABELS.map((label, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium border-2 transition-all ${
              value === i
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : 'border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
