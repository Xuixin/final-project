import prisma from "@/lib/prisma";

export async function GET(request) {
    try {
        const response = await prisma.order.findMany({
            where: {
                OR: [
                    { status: 'InQueue' },
                    { status: 'InProgress' }
                ]
            },
            include: {
                orderDetails: {
                    include: {
                        menu: {
                            include: {
                                menuRecipes: true
                            }
                        },
                    },
                },
                orderSource: true,

            },
            take: 2 // จำกัดจำนวนผลลัพธ์ที่ได้
        });



        // อัพเดตสถานะของออเดอร์เป็น 'InProgress'
        await Promise.all(
            response.map(order =>
                prisma.order.update({
                    where: { id: order.id },
                    data: { status: 'InProgress' }
                })
            )
        );

        return new Response(JSON.stringify(response), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Error fetching orders" }), { status: 500 });
    }
}
