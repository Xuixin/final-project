import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const data = await prisma.order.findMany({
      include: {
        order_source: true,
        customer: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    })

    // เปลี่ยนชื่อ order_source เป็น orderSource
    const newData = data.map(({ order_source, ...oldData }) => {
      return {
        ...oldData,
        orderSource: order_source,
      }
    })

    return new Response(JSON.stringify(newData), { status: 200 })  // ใช้ newData แทน data
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'An error occurred' }), {
      status: 500,
    })
  }
}
