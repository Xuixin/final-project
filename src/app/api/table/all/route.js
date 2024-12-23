import prisma from '@/lib/prisma'

export async function GET(request, { params }) {
    try {
        // ดึงข้อมูลตารางทั้งหมด
        const tables = await prisma.table.findMany();

        // ดึงข้อมูลตารางที่มีสถานะเป็น 'occupied' และคำสั่งซื้อต้องมีสถานะเป็น 'InProgress' หรือ 'InQueue'
        const occupiedTables = await prisma.table.findMany({
            where: {
                status: 'occupied',
            },
            include: {
                order: {
                    include: {
                        customer: true,
                        orderdetail: {
                            include: {
                                menu: true,
                                menuset: {
                                    include: {
                                        menusetdetail: {
                                            include: {
                                                menu: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 1,


                }
            }
        });

        // สร้าง response object
        const response = {
            inside: [],
            outside: []
        };

        for (const table of tables) {
            const orderForTable = occupiedTables.find(t => t.id === table.id);
            const normalMenu = [];
            const setMenu = [];
            const setIds = new Set(); // ใช้ Set เพื่อตรวจสอบว่าเซ็ตเมนูซ้ำหรือไม่

            if (orderForTable) {
                for (const order of orderForTable.order) {
                    for (const detail of order.orderdetail) {
                        if (detail) {
                            if (detail.menusetId === null) {
                                // เป็นเมนูปกติ
                                normalMenu.push({
                                    id: detail.menu?.id,
                                    img: detail.menu?.img,
                                    name: detail.menu?.name,
                                    quantity: detail.quantity,
                                    price: detail.price
                                });
                            } else if (!setIds.has(detail.menusetId)) {
                                // เป็นเซ็ตเมนู และยังไม่ได้เพิ่มในรายการ
                                setIds.add(detail.menusetId); // เพิ่ม menusetId ลงใน Set เพื่อตรวจสอบซ้ำ

                                const findeOrderDetail = await prisma.orderdetail.findMany({
                                    where: {
                                        orderId: order.id,  // ใช้ order.id แทน response.order.id
                                        menusetId: detail.menusetId,
                                    },
                                    include: {
                                        menu: true,
                                    },
                                });

                                const menuset = detail.menuset;
                                if (menuset) {
                                    setMenu.push({
                                        setId: menuset.id,
                                        setName: menuset.name,
                                        totalMenu: menuset.totalMenu,
                                        setPrice: menuset.price,
                                        details: findeOrderDetail.map(d => ({
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
                }
            }

            // เพิ่มข้อมูลโต๊ะลงใน response
            const tableData = {
                id: table.id,
                table_NO: table.table_NO,
                status: table.status,
                type: table.type,
                order: orderForTable ? {
                    createAt: orderForTable.createdAt,
                    orderId: orderForTable.order[0]?.id,
                    status: orderForTable.order[0]?.status,
                    totalPrice: orderForTable.order[0]?.totalPrice,
                    source: orderForTable.order[0]?.order_sourceId,
                    table_NO: orderForTable.table_NO,
                    tableId: orderForTable.id,
                    normalMenu,
                    setMenu
                } : { status: 'available' }
            };

            if (table.type === 'inside') {
                response.inside.push(tableData);
            } else {
                response.outside.push(tableData);
            }
        }

        return new Response(JSON.stringify(response), { status: 200 });

    } catch (error) {
        console.error(error.message);
        return new Response(JSON.stringify({ message: 'Error to get tables' }), { status: 500 });
    }
}
