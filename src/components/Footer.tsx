import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white py-4 text-center text-sm text-gray-500">
      &copy; {new Date().getFullYear()}{' '}
      <a
        href="https://www.stjohnlynch.com"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-indigo-600 transition-colors"
      >
        St John Lynch &amp; Co. Ltd
      </a>
      . All rights reserved.{' '}
      <span className="mx-1 text-gray-300">·</span>
      <Link href="/contact" className="hover:text-indigo-600 transition-colors">
        Contact
      </Link>
    </footer>
  )
}
