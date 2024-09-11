import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
    try {
        const data = await prisma.order.findMany({
            include: {
                orderSource: true,
                customer: true
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 5
        })

        return new Response(JSON.stringify(data), { status: 200 })
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({ error: 'An error occurred' }), {
            status: 500,
        })
    }

}