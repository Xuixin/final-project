import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
    const { tableId } = params;
    const intId = parseInt(tableId);

    try {
        const response = await prisma.table.findUnique({
            where: {
                id: intId,
            },
            include: {
                orders: {
                    include: {
                        orderDetails: {
                            include: {
                                menu: true,
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
                    },
                },
            },
        });

        // สร้างรายการเมนูและเซ็ตเมนู
        const normalMenu = [];
        const setMenu = [];
        const setIds = new Set();

        if (response && response.orders) {
            for (const order of response.orders) {
                for (const detail of order.orderDetails) {
                    if (detail) {
                        if (detail.menusetId === null) {
                            normalMenu.push({
                                id: detail.id,
                                menuId: detail.menu?.id,
                                name: detail.menu?.name,
                                quantity: detail.quantity,
                                price: detail.price,
                            });
                        } else if (!setIds.has(detail.menusetId)) {
                            setIds.add(detail.menusetId);
                            const menuset = detail.menuset;
                            if (menuset) {
                                // หา orderDetails สำหรับ menuset นี้
                                const findeOrderDetail = await prisma.orderDetail.findMany({
                                    where: {
                                        orderId: order.id,  // ใช้ order.id แทน response.orders.id
                                        menusetId: menuset.id,
                                    },
                                    include: {
                                        menu: true,
                                    },
                                });

                                setMenu.push({
                                    setId: menuset.id,
                                    setName: menuset.name,
                                    totalMenu: menuset.totalMenu,
                                    setPrice: menuset.price,
                                    details: findeOrderDetail.map(d => ({
                                        d_id: d.id,
                                        id: d.menu?.id,
                                        name: d.menu?.name,
                                        quantity: d.quantity,
                                    })),
                                });
                            }
                        }
                    }
                }
            }
        }

        // สร้าง order object
        const orderData = response.orders.length > 0 ? {
            orderId: response.orders[0].id,
            status: response.orders[0].status,
            quantity: response.orders[0].quantity,
            totalPrice: response.orders[0].totalPrice,
            normalMenu,
            setMenu,
        } : { status: 'available' };

        // ส่งกลับข้อมูล
        return new Response(JSON.stringify({
            ...response,
            orders: orderData,
        }), { status: 200 });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: 'Error to get order with table' }), { status: 500 });
    }
}
