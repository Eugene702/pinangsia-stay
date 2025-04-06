import { $Enums, Prisma } from "@prisma/client";
import NextAuth, { NextAuthOptions, Session } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials"

declare module "next-auth" {
    interface Session {
        user: {
            name?: string | null;
            email?: string | null;
            image?: string | null;
            role: $Enums.Role;
        };
    }
}

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
        async session({ session, token }) {
            session.user.role = token.sub as $Enums.Role
            return session
        },
        async jwt({ token, user }) {
            if(user){
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

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }