import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const InsertData = await req.json()
    const { name, category, price, image, status, discountId, ingredientIds } = InsertData
    console.log({
      name,
      category,
      price,
      image,
      status,
      discountId,
      ingredientIds
    });

    // ตรวจสอบว่าข้อมูลสำคัญไม่เป็นค่าว่าง
    if (!name || !category || !price || !image || !status) {
      return NextResponse.json(
        { status: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // เตรียมข้อมูลสำหรับ Prisma
    const data = {
      name,
      price,
      img: image,
      status,
      category: {
        connect: {
          id: category,
        },
      },
    }

    // ตรวจสอบว่า discountId มีค่าหรือไม่ก่อนเชื่อมต่อ discount
    if (discountId) {
      data.discount = {
        connect: {
          id: discountId,
        }
      }
    }

    // สร้างเมนูใหม่ในฐานข้อมูล
    const newData = await prisma.menu.create({
      data: data,
    })

    if (newData.id) {
      ingredientIds.map(async (i) => {
        await prisma.menuRecipes.create({
          data: {
            menu: {
              connect: {
                id: parseInt(newData.id),
              }
            },
            ingredient: {
              connect: {
                id: parseInt(i.id),
              }
            },
            quantity: parseFloat(i.qty),
            unit: i.unit
          }
        })
      })
    }

    return NextResponse.json({
      status: true,
      message: 'Menu created successfully',
      data: newData,  // ส่งข้อมูลที่สร้างกลับไปด้วย
    })

  } catch (error) {
    console.error('Error creating menu:', error)

    // จัดการข้อผิดพลาดด้วยการส่ง response กลับไปยัง client
    return NextResponse.json(
      { status: false, message: 'Failed to create menu' },
      { status: 500 }
    )
  }
}



export async function GET() {
  try {
    const data = await prisma.menu.findMany({
      include: {
        category: true,
        discount: true,
      },
    })
    return new Response(
      JSON.stringify(data),
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
