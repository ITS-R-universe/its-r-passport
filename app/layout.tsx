import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ITS-R Passport — Your Universal Identity',
  description: 'One identity for all ITS-R Universe services. Register your Passport today.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
