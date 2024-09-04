import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request, { params }) {
  const { id } = params
  try {
    const user = await prisma.customer.findUnique({
      where: {
        id: parseInt(id),
      },
    })

    return new Response(JSON.stringify(user), {
      status: 200,
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'An error occurred' }), {
      status: 500,
    })
  }
}

export async function POST(request, { params }) {
  const { id } = params
  const { name, lastname, tel, address } = request.json()

  try {
    const updateResponse = await prisma.customer.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
        lastname,
        tel,
        address,
      },
    })

    return new Response(JSON.stringify({ updateResponse, ok: true }), {
      status: 200,
    })
  } catch (err) {
    console.error(err.message)
    return new Response(
      JSON.stringify({ error: 'An error occurred', ok: false }),
      {
        status: 500,
      }
    )
  }
}
