import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
    const { id } = params
    try {
        const user = await prisma.customer.findUnique({
            where:{
                id: parseInt(id)
            }
        })

        return new Response(JSON.stringify(user), {
            status: 200,
        })
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({ error: 'An error occurred' }), {
            status: 500,
        })
    }
}