import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req) {
  try {
    const response = await prisma.discount.findMany({
      include: {
        menus: true,
      },
    })
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify(`faile to get prrmotion :  ${error}`), {
      status: 500,
    })
  }
}

export async function POST(request) {
  const { name, discount } = await request.json()
  const floatDiscount = parseFloat(discount)

  try {
    const data = await prisma.discount.create({
      data: {
        name,
        discount: floatDiscount,
      },
    })
    return new Response(JSON.stringify(data), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({
        message: 'An error occurred while creating the discount.',
      }),
      { status: 500 }
    )
  }
}
