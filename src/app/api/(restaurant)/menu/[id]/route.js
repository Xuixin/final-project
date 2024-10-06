import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const id = params.id;

  try {
    const data = await prisma.menu.findUnique({
      where: { id: Number(id) },
      include: {
        category: true,
        menurecipes: {
          include: {
            ingredient: true
          }
        }
      },

    });

    if (!data) {
      return new Response(JSON.stringify({ message: "Menu not found" }), {
        status: 404,
      });
    }

    const result = {
      menuRecipes: data.menurecipes,
      ...data
    }

    return new Response(
      JSON.stringify(result),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching menu:", error);
    return new Response(
      JSON.stringify({
        message: "Error fetching menu",
        error: error.message,
      }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request, { params }) {
  const id = params.id;
  const data = await request.json();
  const { name, category, discountId, price, image, status, ingredientIds } = data;


  try {
    // Prepare data for update
    const dataToUpdate = {
      name,
      price,
      img: image,
      status,
      category: {
        connect: {
          id: category,
        },
      },
    };

    // Check if discountId is provided
    if (discountId) {
      dataToUpdate.discount = {
        connect: {
          id: discountId,
        },
      };
    } else {
      // Disconnect discount if none provided
      dataToUpdate.discount = {
        disconnect: true,
      };
    }

    // Update the menu
    const updateMenu = await prisma.menu.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
    });

    // Update associated ingredients if the menu update succeeds
    if (updateMenu.id) {
      // Clear existing ingredients first
      await prisma.menurecipes.deleteMany({ where: { menuId: parseInt(updateMenu.id) } });

      // Add new ingredients
      ingredientIds.map(async (ingredient) => {
        await prisma.menurecipes.create({
          data: {
            menu: {
              connect: {
                id: parseInt(updateMenu.id),
              },
            },
            ingredient: {
              connect: {
                id: parseInt(ingredient.ingredientId),
              },
            },
            quantity: parseFloat(ingredient.quantity),
            unit: ingredient.unit,
          },
        });
      });
    }

    // Return success response
    return new Response(
      JSON.stringify({
        message: "Menu updated successfully",
        updateMenu,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating menu:", error);
    return new Response(
      JSON.stringify({
        message: "Error updating menu",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}


export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    await prisma.menurecipes.deleteMany({
      where: { menuId: Number(id) }
    })
    await prisma.menu.delete({
      where: { id: Number(id) },
    });

    return new Response(
      JSON.stringify({ message: "Menu deleted successfully", }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting menu:", error);
    return new Response(
      JSON.stringify({
        message: "Error deleting menu",
        error: error.message,
      }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
