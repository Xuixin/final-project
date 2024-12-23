import prisma from '@/lib/prisma'
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
                    id: 3
                },
                payment: {
                    is: null
                }

                // createdAt: {
                //   gte: today, // เฉพาะคำสั่งซื้อที่ถูกสร้างในวันนี้
                // },
            },
            include: {
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
                                menusetdetail: findeOrderDetail.map((d) => ({
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
                source: restOrder.order_sourceId,
                orderId: restOrder.id,
                normalMenu,
                setMenu,
            };
        });

        return new Response(JSON.stringify(updatedOrders), { status: 200 });
    } catch (error) {
        console.error(error.message);
        return new Response(JSON.stringify({ error: 'fail to fetch order takeaway' }), {
            status: 500,
        });
    }
}