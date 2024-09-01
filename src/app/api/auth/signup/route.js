import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'


const prisma = new PrismaClient();

export async function POST(request){
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
        
        return Response.json(newCustomer, {status: 201})
    } catch (error) {
        console.error(error)
        return Response.json({
            error
        }, {status: 500})
    }
}
