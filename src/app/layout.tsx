import type { Metadata } from 'next'
import { Inter, Outfit, Space_Grotesk, Inter_Tight } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { CommandPalette } from '@/components/ui/command-palette'

const interTight = Inter_Tight({ subsets: ['latin'] })

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-heading',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-accent',
})

export const metadata: Metadata = {
  title: 'StudentOS | Career Intelligence',
  description: 'A comprehensive career intelligence system for students.',
}

import { createClient } from '@/lib/supabase-server'
import { UsernameSetupModal } from '@/components/ui/username-setup-modal'
import ResponsiveNavWrapper from '@/components/ResponsiveNavWrapper'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  // Since we are using getUser for security, we can derive a mock session or just pass user if Providers allows.
  // Actually, for Supabase Auth, session usually comes from getSession but getUser is the secure way to verify.
  // I'll keep getUser and remove getSession. 
  // If Providers needs a full session object, I might need to construct it or check if SupabaseProvider can handle just user.

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

  console.log("SERVER SSR USER:", user ? "Exists" : "Null", "| ERROR:", error);

  return (
    <html lang="en" className="dark">
      <body className={`${interTight.className} ${inter.variable} ${outfit.variable} ${spaceGrotesk.variable} bg-[#0a0a0a] text-foreground antialiased selection:bg-indigo-500/30`}>
        <Providers initialSession={null}>
          <UsernameSetupModal isOpen={needsProfile} />
          {/* Noise Overlay */}
          <div className="noise-overlay"></div>
          <CommandPalette />

          <ResponsiveNavWrapper>
            {children}
          </ResponsiveNavWrapper>
        </Providers>
      </body>
    </html>
  )
}
