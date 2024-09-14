import prisma from "@/lib/prisma";


export async function PUT(request, { params }) {
    const { id } = params
    const { status } = request.json()
    try {
        const updatePayment = await prisma.payment.update({
            where: {
                orderId: parseInt(id)
            },
            data: {
                status
            }
        })

        return new Response(JSON.stringify(updatePayment), { status: 200 })
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({ error: "Error updating status" }), { status: 500 })
    }
}