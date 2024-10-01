import prisma from '@/lib/prisma';
import { subMonths, startOfMonth, endOfMonth } from 'date-fns';

export async function GET(request, { params }) {
    try {
        const now = new Date();
        const endOfCurrentMonth = endOfMonth(now);
        const startOfCurrentMonth = startOfMonth(now);
        const startOfLastMonth = startOfMonth(subMonths(now, 1));
        const endOfLastMonth = endOfMonth(subMonths(now, 1));

        // นับลูกค้าใหม่ในเดือนปัจจุบัน
        const currentMonthNewCustomerCount = await prisma.customer.count({
            where: {
                createdAt: {
                    gte: startOfCurrentMonth,
                    lte: endOfCurrentMonth,
                },
            },
        });

        // นับลูกค้าใหม่ในเดือนก่อนหน้า
        const lastMonthNewCustomerCount = await prisma.customer.count({
            where: {
                createdAt: {
                    gte: startOfLastMonth,
                    lte: endOfLastMonth,
                },
            },
        });

        // คำนวณเปอร์เซ็นต์การเปลี่ยนแปลง
        let percentageChange;
        if (lastMonthNewCustomerCount === 0) {
            // ถ้าเดือนก่อนหน้าไม่มีลูกค้าใหม่เลย (ป้องกันหารด้วยศูนย์)
            percentageChange = currentMonthNewCustomerCount > 0 ? 100 : 0;
        } else {
            percentageChange = ((currentMonthNewCustomerCount - lastMonthNewCustomerCount) / lastMonthNewCustomerCount) * 100;
        }

        // ส่งผลลัพธ์กลับในรูปแบบ JSON
        return new Response(JSON.stringify({
            currentMonthNewCustomers: currentMonthNewCustomerCount,
            lastMonthNewCustomers: lastMonthNewCustomerCount,
            percentageChange: percentageChange.toFixed(2) + '%'
        }), { status: 200 });

    } catch (error) {
        console.error(error.message);
        return new Response(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
    }
}
