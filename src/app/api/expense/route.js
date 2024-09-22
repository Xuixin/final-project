import { PrismaClient } from "@prisma/client";
import { format, startOfDay, endOfDay } from "date-fns";

const prisma = new PrismaClient();

export async function POST(request) {
    const { category, amount } = await request.json();
    try {
        const todayStart = startOfDay(new Date());
        const todayEnd = endOfDay(new Date());

        const findExpense = await prisma.expense.findFirst({
            where: {
                category,
                date: {
                    gte: todayStart,
                    lte: todayEnd,
                }
            }
        });

        let responseExpense;
        if (findExpense) {
            responseExpense = await prisma.expense.update({
                where: {
                    id: findExpense.id
                },
                data: {
                    amount: findExpense.amount + amount,
                }
            });
        } else {
            responseExpense = await prisma.expense.create({
                data: {
                    category,
                    amount,
                    date: new Date() // ต้องเพิ่มวันที่ในกรณีที่สร้างใหม่
                }
            });
        }

        return new Response(JSON.stringify(responseExpense), { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({
            error: 'An unexpected error occurred'
        }), { status: 500 });
    }
}
