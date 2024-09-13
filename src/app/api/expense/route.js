import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request, { params }) {
    const { category, amount } = await request.json()
    try {
        const newExpense = await prisma.expense.create({
            data: {
                category,
                amount,
            }
        })

        return new Response(JSON.stringify(newExpense), { status: 201 })
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({
            error: 'An unexpected error occurred'
        }), { status: 500 })
    }
}
