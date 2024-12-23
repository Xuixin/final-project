import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function POST(req) {
    const { name, lastname, email, password } = await req.json();

    try {
        const newCustomer = await prisma.customer.create({
            data: {
                name,
                lastname,
                email,
                password,
            },
        });
        return new Response(JSON.stringify({ message: "Register success", newCustomer }), { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: 'Error creating customer', error: error.message }), { status: 500 });
    } finally {
        await prisma.$disconnect(); // Disconnect Prisma Client
    }
}

export async function GET(req, res) {
    try {
        const customers = await prisma.customer.findMany()
        return new Response(JSON.stringify(customers))
    } catch (error) {
        console.log('error', error.message);
        return new Response(JSON.stringify({ message: 'error'.error.message }))
    }
}
