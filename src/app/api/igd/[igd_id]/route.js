import prisma from '@/lib/prisma'

// GETWITHID

export async function GET(request, { params }) {
    const { igd_id } = params
    const intId = parseInt(igd_id)
    try {
        const igd = await prisma.ingredient.findUnique({
            where: {
                id: intId,
            }
        })

        return new Response(JSON.stringify(igd), { status: 200 })
    } catch (error) {
        console.error(error.message)
        return new Response(error.message, { status: 500 })
    }
}

export async function PUT(request, { params }) {
    const { igd_id } = params
    const intId = parseInt(igd_id)
    const formData = await request.json()

    try {
        const updatedIgd = await prisma.ingredient.update({
            where: {
                id: intId,
            },
            data: {
                name: formData.name,
                min_quantity: parseFloat(formData.min_quantity),
                unit: formData.unit
            },
        })
        return new Response(JSON.stringify(updatedIgd), { status: 200 })

    } catch (error) {
        console.error(error.message)
        return new Response(error.message, { status: 500 })
    }

}

export async function DELETE(request, { params }) {
    const { igd_id } = params
    const intId = parseInt(igd_id)

    try {
        const del = await prisma.ingredient.delete({
            where: {
                id: intId,
            },
        })

        return new Response(JSON.stringify({ message: true }), { status: 200 })

    } catch (error) {
        console.error(error.message)
        return new Response(JSON.stringify({ message: 'error delete igd' }), { status: 500 })
    }

}

