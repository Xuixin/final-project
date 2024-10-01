import prisma from "@/lib/prisma";


export async function POST(request, { params }) {
    const { id } = params
    const { order, paymentMethod, emp } = await request.json()
    try {
        if (order.source === 3) {
            Promise.all([
                await prisma.order.update({
                    where: {
                        id: parseInt(id)
                    },
                    data: {
                        employee: { connect: { id: emp } }
                    }
                }),
                await prisma.payment.create({
                    data: {
                        order: {
                            connect: {
                                id: parseInt(id)
                            }
                        },
                        amount: order.totalPrice,
                        status: 'Completed',
                        method: paymentMethod
                    }
                })
            ])

            return new Response(JSON.stringify({ message: 'Payment created successfully' }), { status: 200 })
        } else {
            Promise.all([
                await prisma.payment.create({
                    data: {
                        order: {
                            connect: {
                                id: parseInt(id)
                            }
                        },
                        amount: order.totalPrice,
                        status: 'Completed',
                        method: paymentMethod
                    }
                }),
                await prisma.table.update({
                    where: {
                        id: parseInt(order.tableId)
                    },
                    data: {
                        status: 'available'
                    }
                }),

                await prisma.order.update({
                    where: {
                        id: parseInt(id)
                    },
                    data: {
                        employee: { connect: { id: emp } }
                    }
                }),


            ])
            return new Response(JSON.stringify({ message: 'Payment created successfully' }), { status: 200 })
        }
    } catch (error) {
        console.error('error', error.message)
        return new Response(JSON.stringify({ error: "Error payment" }), { status: 500 })
    }
}



export async function PUT(request, { params }) {
    const { id } = params
    const { status } = await request.json()
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