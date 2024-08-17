import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
    try {
        const response = await prisma.menu.findMany({
            where: {
                discountId:{
                    not: null
                }
            }
        })

        return new Response(JSON.stringify(response));
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({ error: 'An error occurred' }), {
            status: 500,
        });
    }
}
