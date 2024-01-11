'use client'

import { SessionProvider } from "next-auth/react"
import type { Session } from "next-auth";

export default function Provider({
  children,
  session
}: {
  children: React.ReactNode
  session?: Session | null
}): React.ReactNode {
  return <>
    {<SessionProvider session={session}>
      {children}
    </SessionProvider>
    }
  </>
}