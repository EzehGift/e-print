import type { Metadata } from 'next'
import { Montserrat, Karla } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/layout/providers'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

const lora = Montserrat({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
})

const inter = Karla({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'GOREPO',
    template: '%s | GOREPO',
  },
  description:
    'The institutional research repository of Godfrey Okoye University, Enugu, Nigeria. Open access to theses, articles, and research outputs.',
  metadataBase: new URL('https://eprints.gouni.edu.ng'),
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`} suppressHydrationWarning>
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
