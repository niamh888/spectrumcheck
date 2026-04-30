'use server'

import { createClient } from '@/lib/supabase/server'

export async function saveValidationConsent(assessmentId: string, consent: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  await supabase
    .from('results')
    .update({ validation_consent: consent })
    .eq('assessment_id', assessmentId)
}
