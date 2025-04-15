import { $Enums } from "@prisma/client";
import NextAuth from "next-auth"
import { authOptions } from "./authOptions";

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

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }