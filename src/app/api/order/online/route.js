import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { customerId, items } = await req.json();
    console.log("ctmid" , parseInt(customerId))

    // สร้างคำสั่งซื้อใหม่ในตาราง Order
    const order = await prisma.order.create({
      data: {
        status: 'pending',
        quantity: items.length,
        totalPrice: items.reduce((total, item) => total + item.price * item.quantity, 0),
        orderDetails: {
          create: items.map(item => ({
            menuId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
        customer: {
            connect: {
              id: parseInt(customerId),
            },
        },
        orderSource:{
            connect:{
                id: 1
            }
        }
      },
    });

    return new Response(JSON.stringify({ orderId: order.id, totalPrice: order.totalPrice * 0.25 }), {
      status: 200,
    });
  } catch (err) {
    console.log(err.message)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
