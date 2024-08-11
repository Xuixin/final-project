import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request, { params }) {
  try {
    const { name, totalMenu, price, menu } = await request.json();

    console.log({ name, totalMenu, price, menu });
    const floatprice = parseFloat(price)

    // Create the menuSet
    const menuset = await prisma.menuSet.create({
      data: {
        name,
        totalMenu,
        price: floatprice,
      },
    });

    // Insert menuSetDetails for each menu item
    for (const menuItem of menu) {
      await prisma.menuSetDetail.create({
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
      const data = await prisma.menuSet.findMany({
        include: {
          details: {
            include: {
              menu: true, // This assumes there's a relation between menuSetDetail and menu
            },
          },
        },
      });
      console.log(data)
      return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
      console.error("Error fetching menu sets:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch menu sets." }),
        { status: 500 }
      );
    }
  }
