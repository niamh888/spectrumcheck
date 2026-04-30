'use client'

import { useState } from 'react'
import { saveValidationConsent } from '@/app/results/[id]/actions'

export default function ValidationConsent({
  assessmentId,
  initialConsent,
}: {
  assessmentId: string
  initialConsent: boolean | null
}) {
  const [state, setState] = useState<'pending' | 'accepted' | 'declined'>(
    initialConsent === true ? 'accepted' : initialConsent === false ? 'declined' : 'pending'
  )
  const [saving, setSaving] = useState(false)

  async function handleChoice(consent: boolean) {
    setSaving(true)
    await saveValidationConsent(assessmentId, consent)
    setState(consent ? 'accepted' : 'declined')
    setSaving(false)
  }

  if (state === 'accepted') {
    return (
      <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-sm text-green-800">
        Thank you for contributing. Your anonymised data will help improve SpectrumCheck&#39;s accuracy.
      </div>
    )
  }

  if (state === 'declined') {
    return (
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-gray-500">
        No problem. Your data will not be used for validation.
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 print:hidden">
      <h3 className="font-semibold text-gray-900 mb-2">Help improve SpectrumCheck</h3>
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
        Would you like to contribute your anonymised responses to our validation dataset?
        This helps improve SpectrumCheck&#39;s accuracy. Your data will be stored securely
        and never linked to your identity.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => handleChoice(true)}
          disabled={saving}
          className="flex-1 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          Yes, contribute my data
        </button>
        <button
          onClick={() => handleChoice(false)}
          disabled={saving}
          className="flex-1 bg-white text-gray-600 text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          No thanks
        </button>
      </div>
    </div>
  )
}
