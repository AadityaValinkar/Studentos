import type { Metadata } from 'next'
import { Inter_Tight } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import Sidebar from '@/components/Sidebar'
import { CommandPalette } from '@/components/ui/command-palette'

const interTight = Inter_Tight({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StudentOS | Career Intelligence',
  description: 'A comprehensive career intelligence system for students.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${interTight.className} bg-[#0a0a0a] text-foreground antialiased selection:bg-indigo-500/30`}>
        <Providers>
          {/* Noise Overlay */}
          <div className="noise-overlay"></div>
          <CommandPalette />

          <div className="flex h-screen w-full overflow-hidden relative z-10">
            <Sidebar />
            <main className="flex-1 relative focus:outline-none overflow-y-auto">
              <div className="min-h-screen">
                {children}
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
