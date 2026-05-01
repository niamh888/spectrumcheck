'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { saveFeedback } from '@/app/results/[id]/actions'

export default function FeedbackWidget({
  assessmentId,
  initialRating,
  initialComment,
}: {
  assessmentId: string
  initialRating: number | null
  initialComment: string | null
}) {
  const [rating, setRating] = useState<number>(initialRating ?? 0)
  const [hovered, setHovered] = useState<number>(0)
  const [comment, setComment] = useState(initialComment ?? '')
  const [state, setState] = useState<'idle' | 'saving' | 'saved'>(
    initialRating ? 'saved' : 'idle'
  )

  async function handleSubmit() {
    if (rating === 0) return
    setState('saving')
    await saveFeedback(assessmentId, rating, comment)
    setState('saved')
  }

  if (state === 'saved') {
    return (
      <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-sm text-green-800 print:hidden">
        Thank you for your feedback — it helps us improve SpectrumCheck.
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 print:hidden">
      <h3 className="font-semibold text-gray-900 mb-1">Rate your experience</h3>
      <p className="text-sm text-gray-500 mb-4">How useful did you find SpectrumCheck?</p>

      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="focus:outline-none"
            aria-label={`${star} star`}
          >
            <Star
              className="w-7 h-7 transition-colors"
              fill={(hovered || rating) >= star ? '#6366f1' : 'none'}
              stroke={(hovered || rating) >= star ? '#6366f1' : '#d1d5db'}
            />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Any comments? (optional)"
        rows={3}
        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 mb-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />

      <button
        onClick={handleSubmit}
        disabled={rating === 0 || state === 'saving'}
        className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-40"
      >
        {state === 'saving' ? 'Submitting…' : 'Submit feedback'}
      </button>
    </div>
  )
}
