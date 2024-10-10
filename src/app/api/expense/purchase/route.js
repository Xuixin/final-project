import prisma from "@/lib/prisma";

export async function POST(request) {
    const { expense, expense_details } = await request.json();
    try {
        // สร้าง expense record ใหม่
        const expenseUpdate = await prisma.expense.create({
            data: {
                category: expense.category,
                amount: parseFloat(expense.amount),
            },
        });

        const expenseUpdateId = expenseUpdate.id;

        // สร้างรายการ expense_details และอัปเดตปริมาณ ingredient
        const promises = expense_details.map(async (igd) => {
            // สร้าง expense_detail
            const createExpenseDetail = prisma.expense_detail.create({
                data: {
                    expense: {
                        connect: {
                            id: expenseUpdateId,
                        },
                    },
                    ingredient: {
                        connect: {
                            id: igd.id,
                        },
                    },
                    quantity: parseFloat(igd.newValue),
                    unit: igd.unit,
                },
            });

            let updatedQuantity = igd.newValue;
            // ตรวจสอบหน่วยของวัตถุดิบ
            if (igd.unit === 'kg') {
                updatedQuantity = igd.newValue * 1000; // แปลงจาก kg เป็น g
            }

            // อัปเดตปริมาณ ingredient
            const updateIngredient = prisma.ingredient.update({
                where: { id: igd.id },
                data: {
                    quantity: {
                        increment: parseFloat(updatedQuantity),
                    },
                },
            });

            // รอให้คำสั่งทั้งสองเสร็จสิ้นพร้อมกัน
            return Promise.all([createExpenseDetail, updateIngredient]);
        });

        // รอให้คำสั่งทั้งหมดเสร็จสิ้น
        await Promise.all(promises);

        return new Response(JSON.stringify({ message: 'Expense and details created successfully' }), { status: 201 });
    } catch (error) {
        console.error(error.message);
        return new Response(JSON.stringify({ message: 'Error creating expense' }), { status: 500 });
    }
}
