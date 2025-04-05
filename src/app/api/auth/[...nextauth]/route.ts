import { Prisma } from "@prisma/client";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialProvider({
            name: "Credentials",
            credentials: {},
            async authorize(_, req) {
                const { email, id, photo, name, role } = req.body as Prisma.UserGetPayload<{}>
                return {
                    id: id,
                    email: email,
                    image: photo,
                    name: name,
                    role: role
                }
            }
        })
    ],

    callbacks: {
        async signIn() {
            return true
        },
        async session({ session }) {
            return session
        },
        async jwt({ token }) {
            return token
        }
    },

    pages: {
        signIn: "/auth",
    }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }