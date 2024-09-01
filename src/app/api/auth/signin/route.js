import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request) {
  const { email, password } = await request.json();

  try {
    // ค้นหาผู้ใช้ในฐานข้อมูลตาม email
    const customer = await prisma.customer.findUnique({
      where: { email },
    });

    if (!customer) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
        status: 401,
      });
    }

    // ตรวจสอบรหัสผ่าน
    const passwordMatch = await bcrypt.compare(password, customer.password);

    if (!passwordMatch) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
        status: 401,
      });
    }

    // สร้าง JWT token
    const token = jwt.sign(
      { userId: customer.id, email: customer.email },
      process.env.NEXTAUTH_SECRET, 
      { expiresIn: '1h' } 
    );

    return new Response(
      JSON.stringify({ token, message: 'Login successful' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error signing in:', error);
    return new Response(JSON.stringify({ error: 'Error signing in' }), {
      status: 500,
    });
  }
}
