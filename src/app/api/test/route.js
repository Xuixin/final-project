import prisma from '@/lib/prisma'

export async function POST(request, { params }) {
    try {
        const orderId = 31;
        const response = await prisma.payment.create({
            data: {
                order: {
                    connect: {
                        id: orderId,
                    }
                },
                amount: 1,
                status: 'Completed',
                method: 'Cash',
            }
        })

        return new Response(JSON.stringify(response), { status: 200 })
    } catch (error) {
        console.error(error.message)
        return new Response(JSON.stringify({ error: '000' }), { status: 500 })
    }
}