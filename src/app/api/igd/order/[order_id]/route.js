import prisma from "@/lib/prisma";

export async function PUT(request, { params }) {
    const { orderId } = params;
    const { order } = await request.json();
    const { orderDetails } = order;

    try {
        const minus = [];
        for (const detail of orderDetails) {
            const menuInMinus = minus.find(m => m.menuId === detail.menuId);
            if (menuInMinus) {
                menuInMinus.quantity += detail.quantity;
            } else {
                minus.push({ menuId: detail.menuId, quantity: detail.quantity });
            }
        }

        // ดึงข้อมูล recipe ของ menu ที่มีการสั่งทั้งหมด
        const menuRecipes = await prisma.menu.findMany({
            where: {
                id: { in: minus.map(menu => menu.menuId) }
            },
            include: {
                menurecipes: {
                    include: {
                        ingredient: true
                    }
                }
            }
        });

        // รวมข้อมูล recipe ของแต่ละ menu กับจำนวนที่สั่ง
        const allMenuRecipes = menuRecipes.map(menu => {
            const orderDetail = minus.find(m => m.menuId === menu.id);
            return {
                menuId: menu.id,
                recipes: menu.menurecipes,
                quantity: orderDetail ? orderDetail.quantity : 0
            };
        });

        // อัปเดตปริมาณ ingredient ทั้งหมดใน parallel
        await prisma.$transaction(
            allMenuRecipes.flatMap(menu =>
                menu.recipes.map(igd =>
                    prisma.ingredient.update({
                        where: { id: igd.ingredientId },
                        data: {
                            quantity: {
                                decrement: menu.quantity * igd.quantity,
                            }
                        }
                    })
                )
            )
        );

        return new Response(JSON.stringify({ message: 'Success' }), { status: 200 });
    } catch (error) {
        console.error("Error updating ingredients:", error);
        return new Response(JSON.stringify({ message: 'Error updating ingredients', error: error.message }), { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
