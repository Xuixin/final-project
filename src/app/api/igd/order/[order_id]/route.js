import prisma from "@/lib/prisma";

export async function PUT(request, { params }) {
    const { orderId } = params;
    const { order } = await request.json();
    try {
        const ok = true
        return new Response(JSON.stringify(order), { status: 200 })
    } catch (error) {
        console.error(error.message)
        return new Response(JSON.stringify({ message: ' error ' }), { status: 500 })
    }
}