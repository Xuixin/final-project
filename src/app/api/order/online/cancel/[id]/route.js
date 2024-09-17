import prisma from "@/lib/prisma";

export async function POST(request, { params }) {
    const { id } = params;
    try {
        const orderId = parseInt(id);

        // ตรวจสอบว่า order, payment, และ shipping มีอยู่ในฐานข้อมูลหรือไม่
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order) {
            return new Response(JSON.stringify({ message: 'Order not found' }), { status: 404 });
        }

        const payment = await prisma.payment.findUnique({ where: { orderId } });
        if (!payment) {
            return new Response(JSON.stringify({ message: 'Payment not found' }), { status: 404 });
        }

        const shipping = await prisma.shipping.findUnique({ where: { orderId } });
        if (!shipping) {
            return new Response(JSON.stringify({ message: 'Shipping not found' }), { status: 404 });
        }

        // ทำงานพร้อมกันโดยใช้ Promise.all
        await Promise.all([
            prisma.order.update({
                where: { id: orderId },
                data: { status: 'Cancelled' }
            }),
            prisma.payment.update({
                where: { orderId },
                data: { status: 'Refunded' }
            }),
            prisma.shipping.update({
                where: { orderId },
                data: { status: 'Cancelled' }
            })
        ]);

        return new Response(JSON.stringify({ status: true }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: 'Error cancelling order' }), { status: 500 });
    }
}
