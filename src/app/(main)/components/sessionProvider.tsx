"use client"

import { Session } from "next-auth"
import { ReactNode } from "react"
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"

const SessionProvider = ({ children, session }: { children: ReactNode, session: Session }) => {
    return <NextAuthSessionProvider session={session} refetchInterval={0}>
        { children }
    </NextAuthSessionProvider>
}

export default SessionProvider