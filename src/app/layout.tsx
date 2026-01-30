import type { Metadata } from 'next'
import { Providers } from '@/components/Providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'DataBake.media | AI-Powered Video Content Generator',
  description: 'Generate stunning video content for your products with AI storytelling',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-databake-background dark:bg-gray-900 transition-colors">
        <Providers>
          <div className="min-h-screen">
            {/* Background decoration */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
              <div className="absolute top-1/4 -left-20 w-72 h-72 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl" />
              <div className="absolute top-1/2 -right-20 w-96 h-96 bg-pink-500/20 dark:bg-pink-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-cyan-500/20 dark:bg-cyan-500/10 rounded-full blur-3xl" />
            </div>

            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
