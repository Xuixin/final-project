import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
    const { id } = params;
    try {
        const orders = await prisma.order.findMany({
            where: {
                customerId: parseInt(id),
            },
            include: {
                customer: true,
                orderDetails: {
                    include: {
                        menu: true,
                        menuset: {
                            include: {
                                details: {
                                    include: {
                                        menu: true
                                    }
                                }
                            }
                        }
                    }
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // แยกเมนูปกติและเซ็ตเมนู
        const response = orders.map(order => {
            const normalmenu = [];
            const setmenu = [];
            const setIds = new Set(); // ใช้ Set เพื่อตรวจสอบว่าเซ็ตเมนูซ้ำหรือไม่

            order.orderDetails.forEach(detail => {
                if (detail.menusetId === null) {
                    // เป็นเมนูปกติ
                    normalmenu.push({
                        id: detail.menu.id,
                        name: detail.menu.name,
                        quantity: detail.quantity,
                        price: detail.price
                    });
                } else if (!setIds.has(detail.menusetId)) {
                    // เป็นเซ็ตเมนู และยังไม่ได้เพิ่มในรายการ
                    setIds.add(detail.menusetId); // เพิ่ม menusetId ลงใน Set เพื่อตรวจสอบซ้ำ
                    setmenu.push({
                        setId: detail.menuset.id,
                        setName: detail.menuset.name,
                        totalMenu: detail.menuset.totalMenu,
                        setPrice: detail.price,
                        details: detail.menuset.details.map(d => ({
                            id: d.menu.id,
                            name: d.menu.name,
                            quantity: detail.quantity
                        }))
                    });
                }
            });

            return {
                orderId: order.id,
                status: order.status,
                createdAt: order.createdAt,
                totalPrice: order.totalPrice,
                userId: order.customer.id,
                normalmenu,
                setmenu
            };
        });

        return new Response(JSON.stringify(response), { status: 200 });
    } catch (err) {
        console.error(err.message);
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
        });
    } finally {
        await prisma.$disconnect();
    }
}

//Delete
export async function DELETE(request, { params }) {
    const { id } = params;

    try {
        // ลบ orderDetail ที่เกี่ยวข้องกับ order
        const orderDetail = await prisma.orderDetail.deleteMany({
            where: {
                orderId: parseInt(id),
            },
        });

        const paymentOrder = await prisma.payment.delete({
            where: {
                orderId: parseInt(id),
            },
        })

        // ลบ order
        const order = await prisma.order.delete({
            where: {
                id: parseInt(id),
            },
        });

        return new Response(JSON.stringify({ message: 'Order and order details deleted successfully' }), {
            status: 200,
        });
    } catch (err) {
        console.error(err.message);
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
        });
    }
}
