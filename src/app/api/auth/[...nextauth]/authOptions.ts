import { $Enums, Prisma } from "@prisma/client";
import { NextAuthOptions } from "next-auth"
import CredentialProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialProvider({
            name: "Credentials",
            credentials: {},
            async authorize(_, req) {
                const { email, id, photo, name, role } = req.body as Prisma.UserGetPayload<{
                    select: {
                        email: true,
                        id: true,
                        photo: true,
                        name: true,
                        role: true
                    }
                }>
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
        async session({ session, token }) {
            session.user.role = token.sub as $Enums.Role
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token = {
                    email: user.email,
                    name: user.name,
                    picture: user.image,
                    sub: (user as unknown as { role: $Enums.Role }).role
                }
            }

            return token
        }
    },

    pages: {
        signIn: "/auth",
    }
}