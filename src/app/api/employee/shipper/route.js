import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const response = await prisma.employee.findMany({
            where: {
                role: {
                    name: 'Shipper'
                }
            }
        })

        return new Response(JSON.stringify(response), { status: 200 })
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({ error: 'Failed to fetch shippers' }), { status: 500 })
    }
}