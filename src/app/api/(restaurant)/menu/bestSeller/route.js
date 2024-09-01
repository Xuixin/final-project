import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
    try {
        const bestSeller = await prisma.menu.findFirst({
            orderBy: {
                soldQuantity: 'desc',
            },
        });

        return new Response(JSON.stringify(bestSeller));
    } catch (error) {
        console.error("Failed to fetch best seller menu:", error);
        return new Response(JSON.stringify({ error: 'An error occurred while fetching the best seller menu' }), {
            status: 500,
        });
    }
}
