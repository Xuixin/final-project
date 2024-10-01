import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';


const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const { name, lastname, email, password } = await request.json()
        const hashedPassword = await bcrypt.hash(password, 10)

        const newCustomer = await prisma.customer.create({
            data: {
                name,
                lastname,
                email,
                password: hashedPassword
            }
        })

        const token = jwt.sign(
            { userId: newCustomer.id, email: newCustomer.email },
            process.env.NEXTAUTH_SECRET,
            { expiresIn: '1h' }
        );

        return new Response(
            JSON.stringify({ token, message: 'Login successful' }),
            { status: 200 }
        );

    } catch (error) {
        console.error(error)
        return Response.json({
            error
        }, { status: 500 })
    }
}
