import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import { PrismaAdapter } from "@next-auth/prisma-adapter"; 

const prisma = new PrismaClient();

export const authOptions = {
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: "aaa@example.com" },
                password: { label: 'Password', type: 'password', placeholder: "password" },
            },
            async authorize(credentials, req) {
                if (!credentials) return null;

                const user = await prisma.customer.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });

                if (user && bcrypt.compareSync(credentials.password, user.password)) {
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                    };
                } else {
                    throw new Error('Invalid email or password');
                }
            },
        }),
    ],
    adapter: PrismaAdapter(prisma),
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        session: async ({ session, token }) => {
            if (session.user) {
                session.user.id = token.id;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
