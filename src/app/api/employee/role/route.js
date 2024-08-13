import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req) {
  const { name, wagepermonth, wageperday } = await req.json()
  const wageInt = parseInt(wagepermonth)
  try {
    const data = await prisma.role.create({
      data: {
        name,
        wagepermonth: wageInt,
        wageperday,
      },
    })

    return new Response(JSON.stringify(data), { status: 201 })
  } catch (error) {
    console.error('Error while creating new employee', error)
    return new Response(
      JSON.stringify({ error: 'Failed to create new employee' }),
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const data = await prisma.role.findMany()

    return new Response(JSON.stringify(data), { status: 200 })
  } catch (error) {
    console.error('Error', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch roles' }), {
      status: 500,
    })
  }
}
