import prisma from "@/lib/prisma";

export async function GET(request) {
    try {
        const response = await prisma.$queryRaw`
                        SELECT * 
                        FROM ingredient 
                        WHERE quantity < min_quantity`;


        const result = response.map((rp) => {
            const pc = (rp.min_quantity - rp.quantity) * 1.5
            const unittext = rp.unit === 'gram(g)' ? `${pc / 1000}` : `${pc}`
            return {
                id: rp.id,
                name: rp.name,
                puchase: Number(unittext),
                unit: rp.unit === 'gram(g)' ? 'kg' : rp.unit
            }
        })


        return new Response(JSON.stringify(result), { status: 200 })
    } catch (error) {
        console.error(error.message);
        return new Response(JSON.stringify({ message: "fail to fetch pucahse igd" }), { status: 200 })
    }
}