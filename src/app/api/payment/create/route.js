import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request, { params }) {
  const { orderId, amount, status } = await request.json()
  console.log(orderId)
  try {
    const newPayment = await prisma.payment.create({
      data: {
        amount,
        status,
        order: {
          connect: {
            id: orderId,
          },
        },
      },
    })

    return new Response(
      JSON.stringify({
        message: 'Payment created successfully',
        paymentId: newPayment.id,
      }),
      {
        status: 201,
      }
    )
  } catch (error) {
    console.error(error.message)
    return new Response(JSON.stringify({ error: 'An error occurred' }), {
      status: 500,
    })
  }
}
