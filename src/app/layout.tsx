import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Footer from '@/components/Footer'

const geist = Geist({ subsets: ['latin'] })

const BASE_URL = 'https://spectrumcheck-iota.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'SpectrumCheck — Free Asperger\'s & ASD Screening Tool',
    template: '%s | SpectrumCheck',
  },
  description:
    'A free screening tool to help individuals, families, teachers, and professionals identify signs of Asperger\'s Syndrome and Autism Spectrum Disorder across seven key domains.',
  keywords: [
    'autism screening', 'aspergers test', 'ASD screening tool', 'autism spectrum disorder',
    'neurodiversity assessment', 'aspergers syndrome', 'autism self assessment', 'free autism test',
  ],
  authors: [{ name: 'St John Lynch & Co. Ltd', url: 'https://www.stjohnlynch.com' }],
  openGraph: {
    type: 'website',
    url: BASE_URL,
    siteName: 'SpectrumCheck',
    title: 'SpectrumCheck — Free Asperger\'s & ASD Screening Tool',
    description:
      'A free screening tool to help individuals, families, teachers, and professionals identify signs of Asperger\'s Syndrome and Autism Spectrum Disorder.',
  },
  twitter: {
    card: 'summary',
    title: 'SpectrumCheck — Free Asperger\'s & ASD Screening Tool',
    description:
      'A free screening tool to identify signs of Asperger\'s Syndrome and Autism Spectrum Disorder across seven key domains.',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'AnygURn0o2s7I0DZraYHHaoNPwtFWD9Uxov7BNNbhUY',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.className} h-full`}>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900 antialiased">
        {children}
        <Footer />
      </body>
    </html>
  )
}
