import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export async function GET(request, { params }) {
    const { id } = await params.id
    try {
        const data = await prisma.employee.findUnique({
            where: {
                id
            }
        })

        return new Response(JSON.stringify({
            data
        }))

    } catch (error) {
        return new Response(
            JSON.stringify({ error: 'Failed to get employee' }),
            { status: 500 }
        )
    }
}

export async function UPDATE(request, {params}){
    const { id } = await params.id
    try {
        const { name, lastname, email, address, password, roleId} = await request.json()
        const data = await prisma.employee.update({
            where:{id},
            data:{
                name,
                lastname,
                email,
                password,
                address,
                roleId
            }
        })

        return new Response(JSON.stringify(data))
    } catch (error) {
        return new Response(
            JSON.stringify({ error: 'Failed to update employee' }),
            { status: 500 }
          )
    }
}

export async function DELETE(request , {params}){
    const { id } = await params.id
    try {
        const response = await prisma.employee.delete({
            where:{
                id
            }
        })

        return new Response({ message: 'employee deleted successfuly' })   
    } catch (error) {
        return new Response(
            JSON.stringify({ error: 'Failed to delete employee' }),
            { status: 500 }
          )
    }
 }