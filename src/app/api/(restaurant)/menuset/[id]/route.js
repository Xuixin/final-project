import { PrismaClient } from '@prisma/client'

// Initialize Prisma client

const prisma = new PrismaClient()

// Define the type of the function
export async function GET(request, { params }) {
  // Extract the `id` from request parameters
  const id = await params.id
  try {
    // Fetch the restaurant by ID
    const data = await prisma.menuSet.findUnique({
      where: { id: Number(id) },
      include: {
        details: {
          include: {
            menu: true,
          },
        },
      },
    })
    return new Response(JSON.stringify(data), {
      status: 200,
    })
  } catch (err) {
    console.error('Error fetching menu:', err)
    return new Response(JSON.stringify({ message: 'Error fetching menu' }), {
      status: 500,
    })
  } finally {
    await prisma.$disconnect()
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const { name, totalMenu, price, menu } = await request.json()

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Menu set ID is required.' }),
        { status: 400 }
      )
    }

    const parseIntID = parseInt(id)
    const floatprice = parseFloat(price)

    // Update the menuSet
    const menuset = await prisma.menuSet.update({
      where: { id: parseIntID },
      data: {
        name,
        totalMenu,
        price: floatprice,
      },
    })

    // Delete existing menuSetDetails
    await prisma.menuSetDetail.deleteMany({
      where: { menusetId: menuset.id },
    })

    // Insert updated menuSetDetails for each menu item
    for (const menuItem of menu) {
      await prisma.menuSetDetail.create({
        data: {
          menusetId: menuset.id, // Connect to the existing menuSet
          menuId: menuItem.id,
          quantity: menuItem.quantity,
        },
      })
    }

    // Return success response
    return new Response(
      JSON.stringify({ message: 'Menuset update successfully!' }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating menu set:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to update menu set.' }),
      { status: 500 }
    )
  }
}

//delete

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Menu set ID is required.' }),
        { status: 400 }
      )
    }
    const parseIntID = parseInt(id)
    // Delete the menuSet
    await prisma.menuSetDetail.deleteMany({ where: { menusetId: parseIntID } })

    await prisma.menuSet.delete({ where: { id: parseIntID } })
    return new Response(
      JSON.stringify({ message: 'Menu set deleted successfully!' }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting menu set:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to delete menu set.' }),
      { status: 500 }
    )
  } finally {
    prisma.$disconnect()
  }
}
