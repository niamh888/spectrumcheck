import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Footer from '@/components/Footer'
import { Analytics } from '@vercel/analytics/next'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SpectrumCheck — Asperger\'s & ASD Screening',
  description:
    'A free screening tool to help individuals, families, and educators identify signs of Asperger\'s Syndrome / Autism Spectrum Disorder.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.className} h-full`}>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900 antialiased">
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
