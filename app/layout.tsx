import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
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

export const metadata: Metadata = {
  title: 'Teqade Technologies | Product Engineering for Startups',
  description: 'We build startup dreams into scalable products. From idea to architecture to production — we design, build, and scale world-class software products.',
  keywords: ['product engineering', 'startup development', 'AI systems', 'software architecture', 'MVP development', 'scalable products'],
  authors: [{ name: 'Teqade Technologies' }],
  openGraph: {
    title: 'Teqade Technologies | Product Engineering for Startups',
    description: 'We build startup dreams into scalable products. From idea to architecture to production.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Teqade Technologies',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Teqade Technologies | Product Engineering for Startups',
    description: 'We build startup dreams into scalable products.',
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
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
