import { useState } from 'react';
import { useAppContext } from '@/app/Context/AppContext';

import { Button } from '../ui/button';

export default function CheckoutButton({ customerId }) {
  const [error, setError] = useState(null);
  const { cart } = useAppContext();
  const items = cart.map(({ id, name, price, quantity }) => ({ id, name, price, quantity }));


  const handleCheckout = async () => {
    try {
      // เรียกใช้ API เพื่อเพิ่มคำสั่งซื้อในฐานข้อมูล
      const orderResponse = await fetch('/api/order/online', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, items }),
      });


      const { orderId, totalPrice } = await orderResponse.json();
      console.log("total", orderId)

      if (!orderId) throw new Error('Failed to create order.');

      // เรียกใช้ API เพื่อสร้างการชำระเงินใน PayPal
      const paymentResponse = await fetch('/api/payment/paypal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, amount:totalPrice }),
      });

      const { id } = await paymentResponse.json();

      // Redirect ผู้ใช้ไปยังหน้า PayPal
      if (id) {
        window.location.href = `https://www.sandbox.paypal.com/checkoutnow?token=${id}`;
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <Button onClick={handleCheckout}>Checkout</Button>
      {error && <div>{error}</div>}
    </div>
  );
}
