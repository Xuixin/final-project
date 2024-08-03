// app/api/login/route.js (or app/api/login/route.ts if using TypeScript)

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
    const { email, password } = await req.json(); // Properly parse JSON from the request body

    try {
        const user = await prisma.customer.findUnique({
            where: { email },
        });

        if (!user) {
            return new Response(
                JSON.stringify({ message: "Invalid email or password." }),
                { status: 401 }
            );
        }
        if (password !== user.password) {
            return new Response(
                JSON.stringify({ message: "Invalid email or password." }),
                { status: 401 }
            );
        }

        const { password: _, ...userData } = user;

        return new Response(
            JSON.stringify({ message: "Login successful", user: userData }),
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ message: "An error occurred during login", error: error.message }),
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect(); // Disconnect Prisma Client
    }
}
