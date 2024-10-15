import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const { cid, items, itemsSet, totalPrice, status } = await req.json()
    console.log('totalPrice:', cid)

    // 1. สร้างคำสั่งซื้อใหม่
    const order = await prisma.order.create({
      data: {
        status,
        quantity: 0,
        totalPrice: parseFloat(totalPrice),
        customer: {
          connect: { id: parseInt(cid) },
        },
        order_source: {
          connect: { id: 1 },
        },
      },
    })

    // 2. คำนวณจำนวนรวมจาก items
    const allItems = [
      ...items.map((item) => ({
        menuId: item.id,
        quantity: item.quantity,
        price: item.price,
        orderId: order.id,
      })),
      ...itemsSet.flatMap((set) =>
        set.orderdetail.map((detail) => ({
          menuId: detail.menuId,
          menusetId: set.id,
          quantity: detail.quantity,
          price: null, // ไม่มีราคาเพราะเป็น menuset
          orderId: order.id,
        }))
      ),
    ]

    // 3. สร้าง orderdetail สำหรับ items และ itemsSet
    await prisma.orderdetail.createMany({
      data: allItems,
    })

    // 4. อัปเดตจำนวนรวมในคำสั่งซื้อ
    const totalQuantity = allItems.reduce(
      (total, item) => total + item.quantity,
      0
    )
    await prisma.order.update({
      where: { id: order.id },
      data: { quantity: totalQuantity },
    })

    // 5. อัปเดต soldQuantity สำหรับ normal menu
    for (const item of items) {
      await prisma.menu.update({
        where: { id: item.id },
        data: {
          soldQuantity: {
            increment: item.quantity, // เพิ่มจำนวนตามที่สั่งซื้อ
          },
        },
      })
    }

    // 6. อัปเดต soldQuantity สำหรับ set menu ตามจำนวนเซ็ตที่ขาย
    for (const set of itemsSet) {
      await prisma.menuset.update({
        where: { id: set.id },
        data: {
          soldQuantity: {
            increment: 1, // เพิ่มจำนวนเซ็ตที่ขาย
          },
        },
      })
    }

    return new Response(
      JSON.stringify({ orderId: order.id, totalPrice: order.totalPrice }),
      { status: 200 }
    )
  } catch (err) {
    console.error(err.message)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    })
  }
}

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // ตั้งเวลาเป็น 00:00:00 เพื่อตรวจสอบตั้งแต่ต้นวัน

    const orders = await prisma.order.findMany({
      where: {
        status: {
          not: 'Cancelled',
        },
        order_source: {
          id: 1
        },
        payment: {
          status: 'Completed'
        },
        shipping: {
          status: {
            in: ['Pending']
          }
        }
        // createdAt: {
        //   gte: today, // เฉพาะคำสั่งซื้อที่ถูกสร้างในวันนี้
        // },
      },
      include: {
        customer: true,
        shipping: true,
        orderdetail: {
          include: {
            menu: {
              include: {
                discount: true
              }
            },
            menuset: {
              include: {
                menusetdetail: {
                  include: {
                    menu: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // สร้าง orders ใหม่ที่มี normalMenu และ setMenu โดยไม่รวม orderdetail
    const updatedOrders = orders.map((order) => {
      const normalMenu = [];
      const setMenu = [];
      const setIds = new Set(); // ใช้ Set เพื่อป้องกันการเพิ่มเซ็ตเมนูซ้ำ

      for (const detail of order.orderdetail) {
        if (detail) {
          if (detail.menusetId === null) {
            // เป็นเมนูปกติ
            normalMenu.push({
              id: detail.menu?.id,
              img: detail.menu?.img,
              name: detail.menu?.name,
              quantity: detail.quantity,
              price: detail.price,
            });
          } else if (!setIds.has(detail.menusetId)) {
            // เป็นเซ็ตเมนู และยังไม่ได้เพิ่มในรายการ
            setIds.add(detail.menusetId); // ป้องกันการเพิ่ม menusetId ซ้ำ

            const findeOrderDetail = order.orderdetail.filter(
              (d) => d.menusetId === detail.menusetId
            );

            const menuset = detail.menuset;
            if (menuset) {
              setMenu.push({
                setId: menuset.id,
                setName: menuset.name,
                totalMenu: menuset.totalMenu,
                setPrice: menuset.price * findeOrderDetail[0].quantity,
                orderdetail: findeOrderDetail.map((d) => ({
                  d_id: d.id,
                  id: d.menu?.id,
                  name: d.menu?.name,
                  img: d.menu?.img,
                  quantity: d.quantity,
                })),
              });
            }
          }
        }
      }

      // ลบฟิลด์ orderdetail และเพิ่ม normalMenu และ setMenu
      const { orderdetail, ...restOrder } = order;
      return {
        ...restOrder,
        normalMenu,
        setMenu,
      };
    });

    return new Response(JSON.stringify(updatedOrders), { status: 200 });
  } catch (error) {
    console.error(error.message);
    return new Response(JSON.stringify({ error: 'fail to fetch orderonline' }), {
      status: 500,
    });
  }
}



