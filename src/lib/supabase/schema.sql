-- Run this in your Supabase SQL editor after creating your project

-- Profiles (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own profile"
  ON public.profiles FOR ALL USING (auth.uid() = id);

-- Auto-create profile on sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Assessments
CREATE TABLE public.assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  respondent_type TEXT NOT NULL,
  subject_name TEXT,
  subject_age INTEGER,
  subject_age_range TEXT NOT NULL,
  diagnostic_awareness TEXT,
  status TEXT DEFAULT 'in_progress' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own assessments"
  ON public.assessments FOR ALL USING (auth.uid() = user_id);

-- Responses
CREATE TABLE public.responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE NOT NULL,
  question_id TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 4),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (assessment_id, question_id)
);
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage responses for own assessments"
  ON public.responses FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.assessments
    WHERE assessments.id = responses.assessment_id
    AND assessments.user_id = auth.uid()
  ));

-- Results
CREATE TABLE public.results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE NOT NULL UNIQUE,
  domain_scores JSONB NOT NULL,
  total_score NUMERIC NOT NULL,
  tier TEXT NOT NULL,
  validation_consent BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration: run this if the table already exists
-- ALTER TABLE public.results ADD COLUMN IF NOT EXISTS validation_consent BOOLEAN;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read results for own assessments"
  ON public.results FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.assessments
    WHERE assessments.id = results.assessment_id
    AND assessments.user_id = auth.uid()
  ));
