import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req) {
  const { name, lastname, email, address, roleId, image } = await req.json()

  try {
    const newEmployee = await prisma.employee.create({
      data: {
        name,
        lastname,
        email,
        address,
        roleId,
        image,
        password: '1111',
      },
    })

    return new Response(JSON.stringify(newEmployee), { status: 201 })
  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({ error: 'Failed to create employee' }),
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const data = await prisma.employee.findMany({
      where: {
        roleId: { not: 5 }
      },
      include: {
        role: true,
      },
    })

    return new Response(JSON.stringify(data), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch employees' }),
      { status: 500 }
    )
  }
}
