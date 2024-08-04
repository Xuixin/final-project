import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  // Extract the `id` from request parameters
  const id = params.id;

  try {
    // Fetch the category by ID
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    });

    if (!category) {
      return new Response(JSON.stringify({ message: "Category not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Category fetched successfully", category }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching category:", error);
    return new Response(
      JSON.stringify({
        message: "Error fetching category",
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
  const { name } = await request.json();

  console.log(name);
  try {
    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name },
    });

    return new Response(
      JSON.stringify({
        message: "Category updated successfully",
        updatedCategory,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating category:", error);
    return new Response(
      JSON.stringify({
        message: "Error updating category",
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
    const response = await prisma.category.delete({
      where:{
        id:Number(id),
      } 
    });
    return new Response(
      JSON.stringify({ message: "Category deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating category:", error);
    return new Response(
      JSON.stringify({
        message: "Error deleting category",
        error: error.message,
      }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
