import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'

const prisma = new PrismaClient();

export async function POST(request) {
    //add new admin
    const { name, lastname, email, address, roleId } = await request.json();
    const startPassword = '1234'
    const hashedPassword = await bcrypt.hash(startPassword, 10)
    try {
        const response = await prisma.employee.create({
            data: {
                name,
                lastname,
                email,
                address,
                password: hashedPassword,
                roles: {
                    connect: { id: parseInt(roleId) }
                }
            }
        })

        return new Response(JSON.stringify(response), { status: 200 })
    } catch (err) {
        console.log(err);
        return new Response(JSON.stringify({ error: 'error to creating admin' }))
    }

}