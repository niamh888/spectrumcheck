export type RespondentType = 'self_adult' | 'self_teen' | 'parent' | 'teacher'
export type AgeRange = 'child_5_12' | 'teen_13_17' | 'adult_18_plus'
export type AssessmentStatus = 'in_progress' | 'completed'
export type ScoreTier = 'no_indicators' | 'some_indicators' | 'strong_indicators'

export interface Question {
  id: string
  domain: DomainKey
  // text variants keyed by respondent type
  text: Record<RespondentType, string>
}

export type DomainKey =
  | 'social_communication'
  | 'restricted_interests'
  | 'sensory'
  | 'routines'
  | 'communication_style'
  | 'emotional_regulation'
  | 'motor_learning'

export interface Domain {
  key: DomainKey
  label: string
  description: string
  color: string
}

export interface Assessment {
  id: string
  user_id: string
  respondent_type: RespondentType
  subject_name: string | null
  subject_age_range: AgeRange
  status: AssessmentStatus
  created_at: string
  completed_at: string | null
}

export interface Response {
  id: string
  assessment_id: string
  question_id: string
  score: number
}

export interface DomainScore {
  domain: DomainKey
  label: string
  score: number
  color: string
}

export interface Result {
  id: string
  assessment_id: string
  domain_scores: DomainScore[]
  total_score: number
  tier: ScoreTier
  created_at: string
}
