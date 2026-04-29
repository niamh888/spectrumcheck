import Link from 'next/link'
import { Users, School, ClipboardCheck, TrendingUp, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar userEmail={user?.email} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <ShieldCheck className="w-4 h-4" />
            Free · Private · Not a diagnosis
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Understanding yourself or someone you care about
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto">
            SpectrumCheck is a free screening tool for Asperger&apos;s Syndrome and Autism Spectrum
            Disorder. Designed for individuals, families, and education professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={user ? '/assessment/new' : '/auth/signup'}
              className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Start a free screening
            </Link>
            <Link
              href="#how-it-works"
              className="border border-gray-300 text-gray-700 px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors"
            >
              How it works
            </Link>
          </div>
        </div>
      </section>

      {/* Who is it for */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Who is this for?</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50">
              <Users className="w-8 h-8 text-indigo-600 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Individuals &amp; Families</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Adults, teenagers, and parents wondering if they or their child may be on the spectrum.
                Get a clear picture across seven key areas.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50">
              <School className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Teachers &amp; Schools</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Complete a structured screening for a student and generate a printable summary to
                share with parents or a specialist.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50">
              <ClipboardCheck className="w-8 h-8 text-teal-600 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Clinical Professionals</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Use as a structured pre-assessment intake tool. Track multiple clients and compare
                results over time (enhanced professional view coming soon).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 px-4 bg-indigo-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">How it works</h2>
          <div className="space-y-6">
            {[
              {
                step: '1',
                title: 'Choose who you are screening',
                desc: 'Yourself (adult or teen), your child, or a student — the questions adapt to the respondent.',
              },
              {
                step: '2',
                title: 'Answer 30 questions',
                desc: 'Questions cover seven domains: social communication, focused interests, sensory sensitivity, routines, communication style, emotional regulation, and motor/learning profile.',
              },
              {
                step: '3',
                title: 'Get a detailed profile',
                desc: 'See a domain-by-domain score chart, an overall indicator level, and plain-language guidance on next steps.',
              },
              {
                step: '4',
                title: 'Save and track over time',
                desc: 'Create a free account to save results and retake the screening to track changes — useful for monitoring progress or preparing for a clinical appointment.',
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4 items-start">
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">
                  {step}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-10 px-4 bg-amber-50 border-t border-amber-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-amber-800 text-sm leading-relaxed">
            <strong>Important:</strong> SpectrumCheck is a <em>screening tool</em>, not a diagnostic
            instrument. Results cannot and do not constitute a diagnosis. Only a qualified clinician
            can diagnose Asperger&apos;s Syndrome or Autism Spectrum Disorder. If you have concerns,
            please speak with your GP, a psychologist, or a specialist.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-xl mx-auto text-center">
          <TrendingUp className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-gray-600 mb-6">
            The screening takes about 10 minutes. Create a free account to save your results.
          </p>
          <Link
            href={user ? '/assessment/new' : '/auth/signup'}
            className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-colors"
          >
            Begin screening
          </Link>
        </div>
      </section>

      <footer className="mt-auto py-6 px-4 border-t border-gray-100 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} SpectrumCheck · Not a medical service · For informational purposes only
      </footer>
    </div>
  )
}
