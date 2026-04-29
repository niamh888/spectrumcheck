import { DOMAIN_MAP, DOMAINS, QUESTIONS } from './questions'
import type { DomainKey, DomainScore, ScoreTier, RespondentType, AgeRange } from '@/types'

export const SCORE_LABELS = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']

export type ScoringMethod = 'standard' | 'age_adjusted' | 'respondent_adjusted'

interface ScoringThresholds {
  low: number      // < low = no_indicators
  high: number     // >= high = strong_indicators
  // between = some_indicators
}

// Define thresholds for different scoring methods
const THRESHOLDS: Record<ScoringMethod, ScoringThresholds | Record<string, ScoringThresholds>> = {
  standard: {
    low: 30,
    high: 55,
  },
  age_adjusted: {
    child_5_12: { low: 25, high: 50 },      // Children often show more behavioral differences
    teen_13_17: { low: 28, high: 52 },      // Teens developing masking strategies
    adult_18_plus: { low: 30, high: 55 },   // Standard for adults
  },
  respondent_adjusted: {
    self_adult: { low: 30, high: 55 },      // Self-aware adults
    self_teen: { low: 28, high: 52 },       // Teens may lack self-awareness
    parent: { low: 25, high: 50 },          // Parents observing overt behaviors
    teacher: { low: 28, high: 53 },         // Teachers seeing structured contexts
  },
}

function getTierForScore(score: number, thresholds: ScoringThresholds): ScoreTier {
  if (score < thresholds.low) {
    return 'no_indicators'
  } else if (score < thresholds.high) {
    return 'some_indicators'
  } else {
    return 'strong_indicators'
  }
}

export interface ScoringResult {
  method: ScoringMethod
  label: string
  domainScores: DomainScore[]
  totalScore: number
  tier: ScoreTier
  thresholds: ScoringThresholds
}

export function calculateResults(responses: Record<string, number>, method: ScoringMethod = 'standard', ageRange?: AgeRange, respondentType?: RespondentType): {
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

  // Get thresholds based on method
  let thresholds: ScoringThresholds = THRESHOLDS.standard as ScoringThresholds
  
  if (method === 'age_adjusted' && ageRange) {
    thresholds = (THRESHOLDS.age_adjusted as Record<string, ScoringThresholds>)[ageRange] || THRESHOLDS.standard as ScoringThresholds
  } else if (method === 'respondent_adjusted' && respondentType) {
    thresholds = (THRESHOLDS.respondent_adjusted as Record<string, ScoringThresholds>)[respondentType] || THRESHOLDS.standard as ScoringThresholds
  }

  const tier = getTierForScore(totalScore, thresholds)

  return { domainScores, totalScore, tier }
}

export function calculateAllScoringMethods(
  responses: Record<string, number>,
  ageRange: AgeRange,
  respondentType: RespondentType
): ScoringResult[] {
  const results: ScoringResult[] = []

  // Standard scoring
  const standard = calculateResults(responses, 'standard')
  results.push({
    method: 'standard',
    label: 'Standard Scoring',
    ...standard,
    thresholds: THRESHOLDS.standard as ScoringThresholds,
  })

  // Age-adjusted scoring
  const ageAdjusted = calculateResults(responses, 'age_adjusted', ageRange)
  results.push({
    method: 'age_adjusted',
    label: `Age-Adjusted (${ageRange.replace(/_/g, '-')})`,
    ...ageAdjusted,
    thresholds: (THRESHOLDS.age_adjusted as Record<string, ScoringThresholds>)[ageRange],
  })

  // Respondent-adjusted scoring
  const respondentAdjusted = calculateResults(responses, 'respondent_adjusted', undefined, respondentType)
  results.push({
    method: 'respondent_adjusted',
    label: `Respondent-Adjusted (${respondentType.replace(/_/g, ' ')})`,
    ...respondentAdjusted,
    thresholds: (THRESHOLDS.respondent_adjusted as Record<string, ScoringThresholds>)[respondentType],
  })

  return results
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
