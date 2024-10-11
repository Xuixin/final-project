import { PrismaClient } from '@prisma/client'

// Initialize Prisma client

const prisma = new PrismaClient()

// Define the type of the function
export async function GET(request, { params }) {
  // Extract the `id` from request parameters
  const id = await params.id
  try {
    // Fetch the restaurant by ID
    const data = await prisma.menuset.findUnique({
      where: { id: Number(id) },
      include: {
        menusetdetail: {
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

    // Update the menuset
    const menuset = await prisma.menuset.update({
      where: { id: parseIntID },
      data: {
        name,
        totalMenu,
        price: floatprice,
      },
    })

    // Delete existing menusetdetails
    await prisma.menusetdetail.deleteMany({
      where: { menusetId: menuset.id },
    })

    // Insert updated menusetdetails for each menu item
    for (const menuItem of menu) {
      await prisma.menusetdetail.create({
        data: {
          menusetId: menuset.id, // Connect to the existing menuset
          menuId: menuItem.id,
          quantity: menuItem.quantity,
        },
      })
    }

    // Return success response
    return new Response(
      JSON.stringify({ message: 'menuset update successfully!' }),
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
    // Delete the menuset
    await prisma.menusetdetail.deleteMany({ where: { menusetId: parseIntID } })

    await prisma.menuset.delete({ where: { id: parseIntID } })
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
