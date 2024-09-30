import prisma from '@/lib/prisma'

export async function PUT(request, { params }) {
    const { orderId } = params
    const { menu, menuSet, order, status, totalPrice, newItemCount } = await request.json()

    try {
        // อัปเดตคำสั่งซื้อหลัก
        const updateOrder = await prisma.order.update({
            where: {
                id: parseInt(orderId)
            },
            data: {
                quantity: parseInt(order.quantity + newItemCount),
                totalPrice: order.totalPrice + totalPrice,
                status
            }
        })


        if (menu.length > 0) {
            const menuPromise = menu.map(async (m) => {
                const existingMenuDetail = order.normalMenu.find((existmenu) => existmenu.menuId === m.id);

                if (existingMenuDetail) {
                    // ถ้ามีอยู่แล้ว ให้คำนวณราคาใหม่
                    const newQuantity = existingMenuDetail.quantity + m.quantity;


                    await prisma.orderDetail.update({
                        where: {
                            id: existingMenuDetail.id,
                            orderId: parseInt(orderId)
                        },
                        data: {
                            quantity: newQuantity,
                        }
                    });
                } else {
                    // ถ้าไม่มี ให้สร้างรายการใหม่
                    await prisma.orderDetail.create({
                        data: {
                            orderId: parseInt(orderId),
                            menuId: m.id,
                            quantity: m.quantity,
                            price: m.price * m.quantity,
                        }
                    });
                }
            });

            await Promise.all(menuPromise); // รอให้การอัปเดตทั้งหมดเสร็จสิ้น
        }


        // จัดการกับ menuSet
        if (menuSet.length > 0) {
            const menuSetPromise = menuSet.map(async (ms) => {
                const existingDetailSet = order.setMenu.find((msD) => msD.setId === ms.id)
                if (existingDetailSet) {
                    // ใช้ Promise.all สำหรับ map ภายในนี้
                    await Promise.all(ms.details.map(async (d) => {
                        await prisma.orderDetail.update({
                            where: {
                                orderId_menuId_menusetId: {
                                    orderId: parseInt(orderId),
                                    menuId: d.menuId,
                                    menusetId: existingDetailSet.setId,
                                },
                            },
                            data: {
                                quantity: { increment: d.quantity }
                            }
                        });
                    }));
                } else {
                    // ใช้ Promise.all สำหรับ map ภายในนี้
                    await Promise.all(ms.details.map(async (d) => {
                        await prisma.orderDetail.create({
                            data: {
                                orderId: parseInt(orderId),
                                menusetId: ms.id,
                                menuId: d.menuId,
                                quantity: d.quantity,
                                price: null, // เพราะคิดราคาตามเซ็ต
                            }
                        });
                    }));
                }
            });

            // รอให้ทุก menuSetPromise เสร็จสิ้น
            await Promise.all(menuSetPromise);
        }




        return new Response(JSON.stringify({ message: 'Order updated successfully' }));

    } catch (error) {
        console.error(error.message);
        return new Response(JSON.stringify({ message: 'Failed to update order' }), { status: 500 });
    }
}
