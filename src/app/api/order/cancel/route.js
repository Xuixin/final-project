import prisma from "@/lib/prisma";

// cancel order 
export async function POST(request, { params }) {
    const { orderId, empId } = await request.json();

    try {
        // อัปเดตสถานะออเดอร์เป็น "Canceled" และเชื่อมกับพนักงาน
        const cancelOrder = await prisma.order.update({
            where: {
                id: parseInt(orderId),
            },
            data: {
                status: "Cancelled",
                employee: {
                    connect: {
                        id: empId,
                    },
                },
            },
        });

        // อัปเดตข้อมูลตาราง (สามารถระบุข้อมูลเพิ่มเติมหากต้องการ)
        await prisma.table.update({
            where: {
                id: cancelOrder.tableId,
            },
            data: {
                status: "available", // เปลี่ยนสถานะตารางเป็นว่าง (หรือข้อมูลอื่นที่คุณต้องการ)
            },
        });

        // ส่ง Response กลับหากการยกเลิกสำเร็จ
        return new Response(JSON.stringify({ message: "Order canceled successfully" }), {
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Failed to cancel order" }), {
            status: 500,
        });
    }
}
