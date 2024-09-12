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
      JSON.stringify(data),
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
  const { name, category, discountId, price, img, status } = await request.json();

  try {
    // เตรียมข้อมูลที่จะอัปเดต
    const dataToUpdate = {
      name,
      price,
      img,
      status,
      category: {
        connect: {
          id: category,
        },
      },
    };

    // ตรวจสอบว่า discountId มีค่าหรือไม่
    if (discountId) {
      dataToUpdate.discount = {
        connect: {
          id: discountId,
        },
      };
    } else {
      // ถ้าไม่มี discountId ให้ทำการลบ discount ที่เชื่อมต่ออยู่ก่อนหน้าออก
      dataToUpdate.discount = {
        disconnect: true,
      };
    }

    // ทำการอัปเดตเมนู
    const updateMenu = await prisma.menu.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
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
