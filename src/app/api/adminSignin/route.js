import prisma from "@/lib/prisma";
import bcrypt from 'bcrypt';


export async function POST(request, { params }) {
    const formData = await request.json()
    try {
        const admin = await prisma.employee.findUnique({
            where: { email: formData.email },
            include: {
                role: true
            }
        });

        if (!admin) {
            return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
                status: 401,
            });
        }

        // ตรวจสอบรหัสผ่าน
        const passwordMatch = await bcrypt.compare(formData.password, admin.password);

        if (!passwordMatch) {
            return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
                status: 401,
            });
        }

        return new Response(JSON.stringify({ role: admin.role.name }))

    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify(error));
    }
}