import prisma from "@/lib/prisma";

export async function GET(request) {
    try {
        const response = await prisma.$queryRaw`
                        SELECT * 
                        FROM ingredient`;


        const result = response.map((rp) => {
            const pc = rp.quantity - rp.min_quantity
            const unittext = rp.unit === 'gram(g)' ? pc / 1000 : pc
            return {
                id: rp.id,
                name: rp.name,
                puchase: rp.quantity > rp.min_quantity
                    ? 0
                    : rp.unit === 'gram(g)'
                        ? (rp.min_quantity - rp.quantity) / 1000
                        : rp.min_quantity - rp.quantity,
                quantity: rp.unit === 'gram(g)'
                    ? rp.quantity / 1000
                    : rp.quantity,
                unit: rp.unit === 'gram(g)' ? 'kg' : rp.unit
            }
        })


        return new Response(JSON.stringify(result), { status: 200 })
    } catch (error) {
        console.error(error.message);
        return new Response(JSON.stringify({ message: "fail to fetch pucahse igd" }), { status: 200 })
    }
}