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
      },
    });

    if (!data) {
      return new Response(JSON.stringify({ message: "Menu not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Menu fetched successfully", data }),
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

export async function POST(request, { params }) {
  const id = params.id;
  const { name, category, discountId, price, img } = await request.json();

  console.log(name);
  try {
    const updateMenu = await prisma.menu.update({
      where: { id: parseInt(id) },
      data: {
        name,
        categoryId: category,
        discountId,
        price,
        img,
      },
    });

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
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    const deleteMenu = await prisma.menu.delete({
      where: { id: Number(id) },
    });
    return new Response(
      JSON.stringify({ message: "Menu deleted successfully", deleteMenu }),
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
