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
                order: {
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
                        createdAt: 'desc',
                    },
                    take: 1
                },

            },
        });

        // สร้างรายการเมนูและเซ็ตเมนู
        const normalMenu = [];
        const setMenu = [];
        const setIds = new Set();

        if (response && response.order) {
            for (const order of response.order) {
                for (const detail of order.orderdetail) {
                    if (detail) {
                        if (detail.menusetId === null) {
                            normalMenu.push({
                                id: detail.id,
                                img: detail.menu?.img,
                                menuId: detail.menu?.id,
                                name: detail.menu?.name,
                                quantity: detail.quantity,
                                price: detail.price,
                                discount: detail.menu?.discount,
                            });
                        } else if (!setIds.has(detail.menusetId)) {
                            setIds.add(detail.menusetId);
                            const menuset = detail.menuset;
                            if (menuset) {
                                // หา orderdetail สำหรับ menuset นี้
                                const findeorderdetail = await prisma.orderdetail.findMany({
                                    where: {
                                        orderId: order.id,  // ใช้ order.id แทน response.order.id
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
                                    menusetdetail: findeorderdetail.map(d => ({
                                        d_id: d.id,
                                        id: d.menu?.id,
                                        name: d.menu?.name,
                                        quantity: d.quantity,
                                        img: d.menu?.img
                                    })),
                                });
                            }
                        }
                    }
                }
            }
        }

        // สร้าง order object
        const orderData = response.status === 'available' ?
            { status: 'available' } : response.order.length > 0 && {
                orderId: response.order[0].id,
                status: response.order[0].status,
                type: response.order[0].order_sourceId,
                quantity: response.order[0].quantity,
                totalPrice: response.order[0].totalPrice,
                normalMenu,
                setMenu,
            };

        // ส่งกลับข้อมูล
        const { order, ...resorder } = response
        return new Response(JSON.stringify({
            ...resorder,
            order: orderData,
        }), { status: 200 });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: 'Error to get order with table' }), { status: 500 });
    }
}
