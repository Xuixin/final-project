import prisma from '@/lib/prisma'

export async function POST(request, { params }) {
    const { type } = await request.json()
    try {
        const newTable = await prisma.table.create({
            data: {
                type
            }
        })

        return new Response(JSON.stringify(newTable), { status: 200 })
    } catch (error) {
        console.error(error.massege)
        return new Response(JSON.stringify({ message: 'Error to creating new table' }), { status: 500 })
    }
}


export async function GET(request, { params }) {
    try {
        // ดึงข้อมูลตารางทั้งหมด
        const tables = await prisma.table.findMany();

        // ดึงข้อมูลตารางที่มีสถานะเป็น 'occupied' และคำสั่งซื้อต้องมีสถานะเป็น 'InProgress' หรือ 'InQueue'
        const occupiedTables = await prisma.table.findMany({
            where: {
                status: 'occupied',
                orders: {
                    some: {
                        status: {
                            in: ['InProgress', 'InQueue']
                        }
                    }
                }
            },
            include: {
                orders: {
                    where: {
                        status: {
                            in: ['InProgress', 'InQueue']
                        }
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
                        }
                    }
                }
            }
        });

        // สร้าง response object
        const response = {
            inside: [],
            outside: []
        };

        tables.forEach(table => {
            const ordersForTable = occupiedTables.find(t => t.id === table.id);
            const normalMenu = [];
            const setMenu = [];
            const setIds = new Set(); // ใช้ Set เพื่อตรวจสอบว่าเซ็ตเมนูซ้ำหรือไม่

            if (ordersForTable) {
                ordersForTable.orders.forEach(order => {
                    order.orderDetails.forEach(detail => {
                        if (detail) {
                            if (detail.menusetId === null) {
                                // เป็นเมนูปกติ
                                normalMenu.push({
                                    id: detail.menu?.id,
                                    name: detail.menu?.name,
                                    quantity: detail.quantity,
                                    price: detail.price
                                });
                            } else if (!setIds.has(detail.menusetId)) {
                                // เป็นเซ็ตเมนู และยังไม่ได้เพิ่มในรายการ
                                setIds.add(detail.menusetId); // เพิ่ม menusetId ลงใน Set เพื่อตรวจสอบซ้ำ
                                const menuset = detail.menuset;
                                if (menuset) {
                                    setMenu.push({
                                        setId: menuset.id,
                                        setName: menuset.name,
                                        totalMenu: menuset.totalMenu,
                                        setPrice: detail.price,
                                        details: menuset.details?.map(d => ({
                                            id: d.menu?.id,
                                            name: d.menu?.name,
                                            quantity: detail.quantity // ปรับ quantity ตาม orderDetail
                                        })) || []
                                    });
                                }
                            }
                        }
                    });
                });
            }

            // เพิ่มข้อมูลโต๊ะลงใน response
            const tableData = {
                id: table.id,
                table_NO: table.table_NO,
                status: table.status,
                type: table.type,
                order: ordersForTable ? {
                    orderId: ordersForTable.orders[0]?.id,
                    status: ordersForTable.orders[0]?.status,
                    totalPrice: ordersForTable.orders[0]?.totalPrice,
                    normalMenu,
                    setMenu
                } : { status: 'available' }
            };

            if (table.type === 'inside') {
                response.inside.push(tableData);
            } else {
                response.outside.push(tableData);
            }
        });

        return new Response(JSON.stringify(response), { status: 200 });

    } catch (error) {
        console.error(error.message);
        return new Response(JSON.stringify({ message: 'Error to get tables' }), { status: 500 });
    }
}


