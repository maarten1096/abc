'use client'

import './globals.css'
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'

import { ThemeProvider } from '@/components/ThemeProvider'
import { Database } from '@/lib/db_types'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [supabase] = useState(() => createClientComponentClient<Database>())

  return (
    <html lang="en">
      <body>
        <SessionContextProvider supabaseClient={supabase}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </SessionContextProvider>
      </body>
    </html>
  )
}
