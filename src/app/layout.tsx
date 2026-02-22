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

import { createClient } from '@/lib/supabase-server'
import { UsernameSetupModal } from '@/components/ui/username-setup-modal'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient();
  const [{ data: { session } }, { data: { user }, error }] = await Promise.all([
    supabase.auth.getSession(),
    supabase.auth.getUser()
  ]);

  let needsProfile = false;

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('global_username')
      .eq('id', user.id)
      .single();

    if (!profile || !profile.global_username) {
      needsProfile = true;
    }
  }

  console.log("SERVER SSR SESSION:", session ? "Exists" : "Null", "| ERROR:", error);

  return (
    <html lang="en" className="dark">
      <body className={`${interTight.className} bg-[#0a0a0a] text-foreground antialiased selection:bg-indigo-500/30`}>
        <Providers initialSession={session}>
          <UsernameSetupModal isOpen={needsProfile} />
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
