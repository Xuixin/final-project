import prisma from '@/lib/prisma'

export async function GET(requesr) {
    try {
        const response = await prisma.order.findMany({
            include: {
                customer: true,
                order_source: true,
                orderdetail: {
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


        const newdata = response.map(({ order_source, orderdetail, ...oldResponse }) => {
            return {
                orderSource: order_source,
                orderDetails: orderdetail,
                ...oldResponse
            }
        })

        return new Response(JSON.stringify(newdata), { status: 200 })
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({ error: 'An error occurred' }), {
            status: 500,
        })
    }
}
