import prisma from '@/lib/prisma'
import { subMonths, startOfMonth, endOfMonth } from 'date-fns'

export async function GET(request) {
    try {
        const now = new Date()
        const endOfCurrentMonth = endOfMonth(now)
        const startOfCurrentMonth = startOfMonth(now)
        const startOfLastMonth = startOfMonth(subMonths(now, 1))
        const endOfLastMonth = endOfMonth(subMonths(now, 1))

        // ดึงข้อมูลคำสั่งซื้อเดือนนี้
        const currentMonthOrders = await prisma.payment.findMany({
            where: {
                createdAt: {
                    gte: startOfCurrentMonth,
                    lte: endOfCurrentMonth,
                },
                status: {
                    not: 'Refunded'
                }
            },
            select: {
                amount: true,
            },
        })

        // ดึงข้อมูลคำสั่งซื้อเดือนที่แล้ว
        const lastMonthOrders = await prisma.payment.findMany({
            where: {
                createdAt: {
                    gte: startOfLastMonth,
                    lte: endOfLastMonth,
                },
                status: {
                    not: 'Refunded'
                }
            },
            select: {
                amount: true,
            },
        })

        // คำนวณรายได้และจำนวนคำสั่งซื้อของเดือนนี้และเดือนที่แล้ว
        const currentMonthIncome = currentMonthOrders.reduce((sum, order) => sum + order.amount, 0)
        const lastMonthIncome = lastMonthOrders.reduce((sum, order) => sum + order.amount, 0)

        const currentMonthOrderCount = currentMonthOrders.length
        const lastMonthOrderCount = lastMonthOrders.length

        // คำนวณเปอร์เซ็นต์การเปลี่ยนแปลงของรายได้และจำนวนคำสั่งซื้อจากเดือนที่แล้ว
        let percentageIncomeChange = 0
        let percentageOrderChange = 0

        if (lastMonthIncome > 0) {
            percentageIncomeChange = ((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100
        }

        if (lastMonthOrderCount > 0) {
            percentageOrderChange = ((currentMonthOrderCount - lastMonthOrderCount) / lastMonthOrderCount) * 100
        }

        const data = {
            income: currentMonthIncome,
            percentageIncomeChange: percentageIncomeChange.toFixed(2),
            orderCount: currentMonthOrderCount,
            percentageOrderChange: percentageOrderChange.toFixed(2),
        }

        return new Response(JSON.stringify(data), { status: 200 })
    } catch (error) {
        console.error(error.message)
        return new Response(JSON.stringify({ message: "An error occurred" }), { status: 500 })
    }
}
