import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
    try {
        const id = await params.id
        const intId = parseInt(id)

        const response = await prisma.discount.findUnique({
            where: {
                id: intId
            },
        })

        return new Response(JSON.stringify(response), { status: 200 })

    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), {
            status: 500
        })
    }
}


export async function POST(request, { params }) {
    const { name, discount } = await request.json();
    const floatDiscount = parseFloat(discount);
    const id = await params.id
    const intId = parseInt(id)
    console.log("id", intId)
  
    try {
      const data = await prisma.discount.update({
        where: { id: intId }, 
        data: {
          name,
          discount: floatDiscount,
        },
      });
      return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
      console.error(error);
      return new Response(
        JSON.stringify({
          message: "An error occurred while update the discount.",
        }),
        { status: 500 }
      );
    }
  }
  