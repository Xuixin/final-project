import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
    const { orderId, status } = await request.json()

    try {
        const newShipping = await prisma.shipping.create({
            data: {
                orderId,
                status,
            },
        })

        return new Response(JSON.stringify(newShipping), {
            status: 200,
        })
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({ error: 'An error occurred' }), {
            status: 500,
        })
    }
}