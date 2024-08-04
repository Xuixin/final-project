import { PrismaClient } from '@prisma/client';
import { stringify } from 'postcss';

const prisma = new PrismaClient();


export async function POST(req) {
    const { name } = await req.json();
    const response = new Response()

    try {
        const newCategory = await prisma.category.create({
            data: {
                name,
            },
        });
        return new Response(JSON.stringify({ message: "Add new Category successfully", newCategory }), { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: 'Error creating catergory', error: error.message }), { status: 500 });
    } finally {
        await prisma.$disconnect(); 
    }
}

export async function GET() {
    try {
        const data = await prisma.category.findMany();
        return new Response(
            JSON.stringify({
                message: 'Ok',
                data,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error(error); // Use console.error for logging errors
        return new Response(
            JSON.stringify({
                message: `Error: ${error.message || error}`,
            }),
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

