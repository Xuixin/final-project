import prisma from '@/lib/prisma'

export async function GET(requesr) {
    try {
        const response = await prisma.order.findMany({
            include: {
                customer: true,
                orderSource: true,
                orderDetails: {
                    include: {
                        menu: true,
                    },
                },
                payment: true,
                shipping: true
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return new Response(JSON.stringify(response), { status: 200 })
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({ error: 'An error occurred' }), {
            status: 500,
        })
    }
}