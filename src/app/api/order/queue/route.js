import prisma from '@/lib/prisma'
export async function GET() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // ตั้งเวลาเป็น 00:00:00 เพื่อตรวจสอบตั้งแต่ต้นวัน

        const orders = await prisma.order.findMany({
            where: {
                status: {
                    in: ['InQueue', 'InProgress'],
                },
                // createdAt: {
                //   gte: today, // เฉพาะคำสั่งซื้อที่ถูกสร้างในวันนี้
                // },
            },
            include: {
                orderDetails: {
                    include: {
                        menu: {
                            include: {
                                discount: true
                            }
                        },
                        menuset: {
                            include: {
                                details: {
                                    include: {
                                        menu: true,
                                    },
                                },
                            },
                        },
                    },
                },
                orderSource: true,
            },
            orderBy: [
                { status: 'desc' },  // เรียงลำดับตามสถานะ InQueue ก่อน, InProgress หลัง
                { createdAt: 'asc' } // เรียงตามวันที่สร้าง (จากเก่าสุดไปใหม่สุด)
            ],
        });

        // สร้าง orders ใหม่ที่มี normalMenu และ setMenu โดยไม่รวม orderDetails
        const updatedOrders = orders.map((order) => {
            const normalMenu = [];
            const setMenu = [];
            const setIds = new Set(); // ใช้ Set เพื่อป้องกันการเพิ่มเซ็ตเมนูซ้ำ

            for (const detail of order.orderDetails) {
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

                        const findeOrderDetail = order.orderDetails.filter(
                            (d) => d.menusetId === detail.menusetId
                        );

                        const menuset = detail.menuset;
                        if (menuset) {
                            setMenu.push({
                                setId: menuset.id,
                                setName: menuset.name,
                                totalMenu: menuset.totalMenu,
                                setPrice: menuset.price * findeOrderDetail[0].quantity,
                                details: findeOrderDetail.map((d) => ({
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

            // ลบฟิลด์ orderDetails และเพิ่ม normalMenu และ setMenu
            const { orderDetails, ...restOrder } = order;
            return {
                ...restOrder,
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
