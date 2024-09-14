import prisma from '@/lib/prisma'

export async function PUT(request, { params }) {
    const { orderId } = params
    const { status } = await request.json()
    try {
        const updateStatus = await prisma.order.update({
            where: {
                id: parseInt(orderId)
            },
            data: {
                status
            }
        })

        return new Response(JSON.stringify(updateStatus), { status: 200 })
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({ error: 'Failed to update order status.' }), { status: 500 })
    }
}