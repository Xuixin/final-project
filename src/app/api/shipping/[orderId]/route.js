import prisma from "@/lib/prisma";

export async function PUT(request, { params }) {
    const { orderId } = params
    const { status, employeeId } = await request.json()


    try {
        const updatePayment = await prisma.shipping.update({
            where: {
                orderId: parseInt(orderId)
            },
            data: {
                status,
                employee: {
                    connect: {
                        id: employeeId
                    }
                }
            }
        })

        return new Response(JSON.stringify(updatePayment), { status: 200 })
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({ error: "Error updating status" }), { status: 500 })
    }
}