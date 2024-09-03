import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/paypal';

export async function POST(request) {
  try {
    const { orderId, amount } = await request.json();
    const data = await createOrder(orderId, amount);

    return NextResponse.json({ id: data.id });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 });
  }
}
