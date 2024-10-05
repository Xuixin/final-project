import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request, { params }) {
  try {
    const { name, totalMenu, price, status, menu } = await request.json();

    console.log({ name, totalMenu, price, menu });
    const floatprice = parseFloat(price)

    // Create the menuSet
    const menuset = await prisma.menuset.create({
      data: {
        name,
        totalMenu,
        status,
        price: floatprice,
      },
    });

    // Insert menuSetDetails for each menu item
    for (const menuItem of menu) {
      await prisma.menusetdetail.create({
        data: {
          menusetId: menuset.id, // Connect to the newly created menuSet
          menuId: menuItem.id,
          quantity: menuItem.quantity,
        },
      });
    }

    // Return success response
    return new Response(
      JSON.stringify({ message: "Menu set created successfully!" }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error creating menu set:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create menu set." }),
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const data = await prisma.menuset.findMany({
      include: {
        menusetdetail: {
          include: {
            menu: true,
          },
        },
      },
    });

    const newData = data.map(({ menusetdetail, ...eachData }) => ({
      ...eachData,
      details: menusetdetail, // ใช้ชื่อใหม่
    }));

    return new Response(JSON.stringify(newData), { status: 200 });
  } catch (error) {
    console.error("Error fetching menu sets:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch menu sets." }),
      { status: 500 }
    );
  }
}
