import { DOMAIN_MAP, DOMAINS, QUESTIONS } from './questions'
import type { DomainKey, DomainScore, ScoreTier } from '@/types'

export const SCORE_LABELS = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']

export function calculateResults(responses: Record<string, number>): {
  domainScores: DomainScore[]
  totalScore: number
  tier: ScoreTier
} {
  const domainTotals: Record<DomainKey, { sum: number; count: number }> = {} as never
  for (const d of DOMAINS) {
    domainTotals[d.key] = { sum: 0, count: 0 }
  }

  for (const q of QUESTIONS) {
    const score = responses[q.id]
    if (score !== undefined) {
      domainTotals[q.domain].sum += score
      domainTotals[q.domain].count += 1
    }
  }

  const domainScores: DomainScore[] = DOMAINS.map((d) => {
    const { sum, count } = domainTotals[d.key]
    const raw = count > 0 ? sum / count : 0
    // scale 0-4 → 0-100
    return {
      domain: d.key,
      label: d.label,
      score: Math.round((raw / 4) * 100),
      color: d.color,
    }
  })

  const totalScore = Math.round(
    domainScores.reduce((acc, d) => acc + d.score, 0) / domainScores.length
  )

  let tier: ScoreTier
  if (totalScore < 30) {
    tier = 'no_indicators'
  } else if (totalScore < 55) {
    tier = 'some_indicators'
  } else {
    tier = 'strong_indicators'
  }

  return { domainScores, totalScore, tier }
}

export const TIER_CONFIG: Record<
  ScoreTier,
  { label: string; color: string; bg: string; border: string; message: string }
> = {
  no_indicators: {
    label: 'No significant indicators',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    message:
      'The responses do not show significant indicators associated with Asperger\'s / ASD. If you still have concerns, speaking with a GP or educational psychologist is always a valid next step.',
  },
  some_indicators: {
    label: 'Some indicators present',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    message:
      'The responses show some indicators worth exploring further. This does not mean a diagnosis is certain, but a conversation with a GP, educational psychologist, or specialist is recommended.',
  },
  strong_indicators: {
    label: 'Strong indicators — professional assessment recommended',
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    message:
      'The responses show a number of strong indicators. A formal assessment by a qualified clinician is strongly recommended. This screening tool is not a diagnosis — only a professional can make that determination.',
  },
}

export function domainForQuestion(questionId: string): DomainKey | undefined {
  return QUESTIONS.find((q) => q.id === questionId)?.domain
}

export function questionsForDomain(domainKey: DomainKey) {
  return QUESTIONS.filter((q) => q.domain === domainKey)
}
