import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono, Figtree } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});
// Body copy: a clean, Netflix Sans-style grotesque (Netflix Sans itself is proprietary)
const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: 'Teqade Technologies | Your Vision. Our Engineering.',
  description: 'Teqade is the engineering partner for startups and growing companies — we architect, build, scale, and run software across product, AI, data, and cloud, while every decision stays with you.',
  keywords: ['engineering partner', 'product engineering', 'startup development', 'AI transformation', 'agentic AI', 'data engineering', 'Apache Airflow', 'cloud migration', 'software architecture', 'MVP development'],
  authors: [{ name: 'Teqade Technologies' }],
  openGraph: {
    title: 'Teqade Technologies | Your Vision. Our Engineering.',
    description: 'The engineering partner for startups and growing companies — from architecture to scale, across product, AI, data, and cloud.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Teqade Technologies',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Teqade Technologies | Your Vision. Our Engineering.',
    description: 'The engineering partner for startups and growing companies.',
  },
  icons: {
    icon: `${basePath}/favicon.png`,
    apple: `${basePath}/favicon.png`,
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a12',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${geistMono.variable} ${figtree.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
