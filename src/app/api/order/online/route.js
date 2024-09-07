import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { customerId, items, itemsSet, totalPrice } = await req.json();
    console.log('totalPrice:', totalPrice);

    // 1. สร้างคำสั่งซื้อใหม่
    const order = await prisma.order.create({
      data: {
        status: 'อยู่ในคิว',
        quantity: 0, // จะอัปเดตหลังจากสร้าง OrderDetail
        totalPrice: parseFloat(totalPrice), // totalPrice รวมเฉพาะ items
        customer: {
          connect: { id: parseInt(customerId) },
        },
        orderSource: {
          connect: { id: 1 },
        }
      },
    });


    // 2. คำนวณจำนวนรวมจาก items
    const allItems = [
      ...items.map(item => ({
        menuId: item.id,
        quantity: item.quantity,
        price: item.price,
        orderId: order.id
      })),
      ...itemsSet.flatMap(set =>
        set.details.map(detail => ({
          menuId: detail.menuId,
          menusetId: set.id,
          quantity: detail.quantity,
          price: null, // ไม่มีราคาเพราะเป็น menuset
          orderId: order.id
        }))
      )
    ];

    // 3. สร้าง OrderDetails สำหรับ items และ itemsSet
    await prisma.orderDetail.createMany({
      data: allItems,
    });

    // 4. อัปเดตจำนวนรวมในคำสั่งซื้อ
    const totalQuantity = allItems.reduce((total, item) => total + item.quantity, 0);
    await prisma.order.update({
      where: { id: order.id },
      data: { quantity: totalQuantity },
    });

    // 5. อัปเดต soldQuantity สำหรับ normal menu
    for (const item of items) {
      await prisma.menu.update({
        where: { id: item.id },
        data: {
          soldQuantity: {
            increment: item.quantity, // เพิ่มจำนวนตามที่สั่งซื้อ
          },
        },
      });
    }

    // 6. อัปเดต soldQuantity สำหรับ set menu ตามจำนวนเซ็ตที่ขาย
    for (const set of itemsSet) {
      await prisma.menuSet.update({
        where: { id: set.id },
        data: {
          soldQuantity: {
            increment: 1, // เพิ่มจำนวนเซ็ตที่ขาย
          },
        },
      });
    }

    return new Response(
      JSON.stringify({ orderId: order.id, totalPrice: order.totalPrice }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
