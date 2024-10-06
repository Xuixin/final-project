import prisma from '@/lib/prisma'

export async function GET(request, {
    params
}) {
    try {
        const igd = await prisma.ingredient.findMany({
            include: {
                _count: {
                    select: {
                        menurecipes: true  // This will count the related menurecipes entries
                    }
                },
                menurecipes: true  // Include the actual menurecipes records if needed
            }
        })

        const newData = igd.map(({ menurecipes, ...oldData }) => {
            return {
                ...oldData,
                menuRecipes: menurecipes
            }
        })

        return new Response(JSON.stringify(newData), {
            status: 200
        })
    } catch (error) {
        console.error(error.message)
        return new Response(JSON.stringify({ error: 'Failed to get ingredient group details' }), {
            status: 500
        })
    }
}

export async function POST(request, {
    params
}) {
    const formData = await request.json()
    console.log(formData);
    try {
        const newIGD = await prisma.ingredient.create({
            data: {
                name: formData.name,
                min_quantity: parseFloat(formData.min_quantity),
                quantity: 0,
                unit: formData.unit,

            }
        })

        return new Response(JSON.stringify(newIGD), {
            status: 201
        })

    } catch (error) {
        console.error(error.message)
        return new Response(JSON.stringify({ error: 'Failed to add new ingredient group' }), {
            status: 500
        })
    }
}