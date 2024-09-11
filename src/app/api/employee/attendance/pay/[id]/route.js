import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request, { params }) {
    const { id } = params
    const { amount } = await request.json();

    try {
        // ตรวจสอบว่ามีข้อมูลการเข้าร่วมที่ตรงตาม ID หรือไม่
        const attendance = await prisma.attendance.findUnique({
            where: { id: parseInt(id) },
            include: { wages: true }
        });

        if (!attendance) {
            return new Response(JSON.stringify({ error: 'Attendance record not found' }), {
                status: 404,
            });
        }

        // ตรวจสอบว่าสำหรับการเข้าร่วมนี้ได้จ่ายเงินแล้วหรือไม่
        if (attendance.wages.length > 0) {
            return new Response(JSON.stringify({ error: 'Payment already made' }), {
                status: 400,
            });
        }

        // บันทึกการจ่ายเงิน
        await prisma.wages.create({
            data: {
                amount,
                attendance: {
                    connect: {
                        id: parseInt(id),
                    },
                }
            },
        });


        return new Response(JSON.stringify({ success: true }), {
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'An error occurred' }), {
            status: 500,
        });
    }
}
