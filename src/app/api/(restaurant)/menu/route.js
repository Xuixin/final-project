import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
const prisma = new PrismaClient()
export async function POST(req) {
  const { menu, category, price } = await req.json()

  const newData = await prisma.menu.create({
    data: {
      name: menu,
      categoryId: category,
      price,
      img: 'ok',
    },
  })

  return NextResponse.json({
    status: true,
  })
}

export async function GET() {
  try {
    const data = await prisma.menu.findMany({
      include: {
        category: true,
      },
    })
    return new Response(
      JSON.stringify({
        message: 'Ok',
        data,
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error(error) // Use console.error for logging errors
    return new Response(
      JSON.stringify({
        message: `Error: ${error.message || error}`,
      }),
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
