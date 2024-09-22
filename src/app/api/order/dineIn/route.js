import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req) {
    try {
        // รับข้อมูลจาก request
        const { items, itemsSet, totalPrice, status, source_id, table_id } = await req.json();
        console.log('totalPrice:', totalPrice);

        // อัปเดตสถานะโต๊ะถ้าเป็น dine-in และมี table_id
        if (source_id === 2 && table_id) {
            await prisma.table.update({
                where: { id: parseInt(table_id) },
                data: { status: 'occupied' },
            });
        }

        // สร้างคำสั่งซื้อใหม่
        const orderData = {
            status,
            quantity: 0,
            totalPrice: parseFloat(totalPrice),
            orderSource: { connect: { id: source_id } },
        };

        // ถ้ามี table_id ให้เชื่อมโยง table ด้วย
        if (table_id) {
            orderData.table = { connect: { id: parseInt(table_id) } };
        }

        const order = await prisma.order.create({
            data: orderData,
        });

        // คำนวณจำนวนรวมจาก items
        const allItems = [
            ...items.map(item => ({
                menuId: item.id,
                quantity: item.quantity,
                price: item.price,
                orderId: order.id,
            })),
            ...itemsSet.flatMap(set =>
                set.details.map(detail => ({
                    menuId: detail.menuId,
                    menusetId: set.id,
                    quantity: detail.quantity,
                    price: null, // ไม่มีราคาเพราะเป็น menuset
                    orderId: order.id,
                }))
            ),
        ];

        // สร้าง OrderDetails สำหรับ items และ itemsSet
        await prisma.orderDetail.createMany({ data: allItems });

        // อัปเดตจำนวนรวมในคำสั่งซื้อ
        const totalQuantity = allItems.reduce((total, item) => total + item.quantity, 0);
        await prisma.order.update({ where: { id: order.id }, data: { quantity: totalQuantity } });

        // อัปเดต soldQuantity สำหรับ normal menu
        await Promise.all(items.map(item =>
            prisma.menu.update({
                where: { id: item.id },
                data: { soldQuantity: { increment: item.quantity } },
            })
        ));

        // อัปเดต soldQuantity สำหรับ set menu
        await Promise.all(itemsSet.map(set =>
            prisma.menuSet.update({
                where: { id: set.id },
                data: { soldQuantity: { increment: 1 } },
            })
        ));

        return new Response(
            JSON.stringify({ orderId: order.id, totalPrice: order.totalPrice }),
            { status: 200 }
        );
    } catch (err) {
        console.error(err.message);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
