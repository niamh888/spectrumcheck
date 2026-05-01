import Navbar from '@/components/Navbar'
import ContactForm from '@/components/ContactForm'
import { createClient } from '@/lib/supabase/server'

export default async function ContactPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userEmail={user?.email} />
      <main className="max-w-lg mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Contact</h1>
        <p className="text-sm text-gray-500 mb-8">
          Have a question or feedback about SpectrumCheck? Send a message and I&#39;ll get back to you.
        </p>
        <ContactForm />
      </main>
    </div>
  )
}
