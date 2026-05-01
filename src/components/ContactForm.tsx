'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('sending')
    const form = e.currentTarget
    const data = new FormData(form)

    const res = await fetch('https://formspree.io/f/xlgabrqj', {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' },
    })

    if (res.ok) {
      setState('sent')
      form.reset()
    } else {
      setState('error')
    }
  }

  if (state === 'sent') {
    return (
      <div className="bg-green-50 border border-green-100 rounded-xl p-5 text-sm text-green-800">
        Message sent — thanks for getting in touch. I&#39;ll get back to you soon.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      {state === 'error' && (
        <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
      )}

      <button
        type="submit"
        disabled={state === 'sending'}
        className="bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
      >
        {state === 'sending' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
