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
            response.orders.forEach(order => {
                order.orderDetails.forEach(detail => {
                    if (detail) {
                        if (detail.menusetId === null) {
                            normalMenu.push({
                                id: detail.menu?.id,
                                name: detail.menu?.name,
                                quantity: detail.quantity,
                                price: detail.price,
                            });
                        } else if (!setIds.has(detail.menusetId)) {
                            setIds.add(detail.menusetId);
                            const menuset = detail.menuset;
                            if (menuset) {
                                setMenu.push({
                                    setId: menuset.id,
                                    setName: menuset.name,
                                    totalMenu: menuset.totalMenu,
                                    setPrice: menuset.price,
                                    details: menuset.details?.map(d => ({
                                        id: d.menu?.id,
                                        name: d.menu?.name,
                                        quantity: detail.quantity,
                                    })) || [],
                                });
                            }
                        }
                    }
                });
            });
        }

        // สร้าง order object
        const orderData = response.orders.length > 0 ? {
            orderId: response.orders[0].id,
            status: response.orders[0].status,
            totalPrice: response.orders[0].totalPrice,
            normalMenu,
            setMenu
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

