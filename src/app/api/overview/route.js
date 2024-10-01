import prisma from '@/lib/prisma'
import { subMonths, startOfMonth, endOfMonth } from 'date-fns'

export async function GET(request) {
    try {
        const now = new Date()
        const startOfCurrentMonth = startOfMonth(now)
        const endOfCurrentMonth = endOfMonth(now)
        const startOfThreeMonthsAgo = startOfMonth(subMonths(now, 3))

        // ดึงข้อมูลคำสั่งซื้อ (รายได้)
        const payment = await prisma.payment.findMany({
            where: {
                createdAt: {
                    gte: startOfThreeMonthsAgo,
                    lte: endOfCurrentMonth,
                },
                status: {
                    not: 'Refunded'
                }
            },
            select: {
                createdAt: true,
                amount: true,
            },
        })

        // ดึงข้อมูลรายจ่าย
        const expenses = await prisma.expense.findMany({
            where: {
                date: {
                    gte: startOfThreeMonthsAgo,
                    lte: endOfCurrentMonth,
                },
            },
            select: {
                date: true,
                amount: true,
            },
        })

        // สร้าง array สำหรับเดือนที่ต้องการ (4 เดือนล่าสุด)
        const data = [
            { name: subMonths(now, 3).toLocaleString('en-US', { month: 'short' }), income: 0, expense: 0 },
            { name: subMonths(now, 2).toLocaleString('en-US', { month: 'short' }), income: 0, expense: 0 },
            { name: subMonths(now, 1).toLocaleString('en-US', { month: 'short' }), income: 0, expense: 0 },
            { name: now.toLocaleString('en-US', { month: 'short' }), income: 0, expense: 0 },
        ]

        // รวมยอดรายได้ตามเดือน
        payment.forEach(order => {
            const orderDate = new Date(order.createdAt)
            const monthDiff = now.getMonth() - orderDate.getMonth() + (now.getFullYear() - orderDate.getFullYear()) * 12
            if (monthDiff >= 0 && monthDiff <= 3) {
                data[3 - monthDiff].income += order.amount
            }
        })

        // รวมยอดรายจ่ายตามเดือน
        expenses.forEach(expense => {
            const expenseDate = new Date(expense.date)
            const monthDiff = now.getMonth() - expenseDate.getMonth() + (now.getFullYear() - expenseDate.getFullYear()) * 12
            if (monthDiff >= 0 && monthDiff <= 3) {
                data[3 - monthDiff].expense += expense.amount
            }
        })

        return new Response(JSON.stringify(data), { status: 200 })
    } catch (error) {
        console.error(error.message)
        return new Response(JSON.stringify({ message: "An error occurred" }), { status: 500 })
    }
}
