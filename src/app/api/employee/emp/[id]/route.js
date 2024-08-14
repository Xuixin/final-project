import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { id } = await params;
  const intId = parseInt(id);
  try {
    const data = await prisma.employee.findUnique({
      where: {
        id: intId,
      },
    });

    return new Response(
      JSON.stringify({
        data,
      })
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to get employee" }), {
      status: 500,
    });
  }
}

export async function POST(request, { params }) {
  const { id } = params;
  const intId = parseInt(id);
  try {
    const { name, lastname, email, address, password, roleId } =
      await request.json();
    const data = await prisma.employee.update({
      where: { id: intId },
      data: {
        name,
        lastname,
        email,
        password,
        address,
        roleId,
      },
    });

    return new Response(JSON.stringify(data));
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to update employee" }),
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const intId = parseInt(id);
  try {
    const response = await prisma.employee.delete({
      where: {
        id:intId, 
      },
    });

    return new Response({ message: "employee deleted successfuly" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete employee" }),
      { status: 500 }
    );
  }
}
