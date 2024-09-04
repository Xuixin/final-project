
import { NextResponse } from 'next/server';
import { captureOrder } from '@/lib/paypal'; // ฟังก์ชันจับยอดเงิน
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
    const url = new URL(request.url);
    const token = url.searchParams.get('token'); // รับ token จาก query parameter

    if (!token) {
        return NextResponse.json({ error: 'Token is missing' }, { status: 400 });
    }

    try {
        // เรียกใช้ฟังก์ชัน captureOrder เพื่อจับยอดเงิน
        const captureId = await captureOrder(token);

        // อัปเดตสถานะคำสั่งซื้อในฐานข้อมูล
        await prisma.payment.updateMany({
            where: {
                orderId: token,
            },
            data: {
                status: 'completed',
                transactionId: captureId,
            },
        });

        return NextResponse.redirect('/menu'); // เปลี่ยนเส้นทางไปที่ /menu
    } catch (error) {
        console.error('Payment completion error:', error.message);
        return NextResponse.json({ error: 'Failed to complete payment' }, { status: 500 });
    }
}
