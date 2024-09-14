import { useState } from 'react'
import { useAppContext } from '@/app/Context/AppContext'
import { Button } from '../ui/button'
import axios from 'axios'

export default function CheckoutButton({ customerId, userData, totalPrice }) {
  const [error, setError] = useState(null)
  const { cart, cartSet, setOrderId } = useAppContext()

  const items = cart.map(({ id, name, price, quantity }) => ({
    id,
    name,
    price,
    quantity,
  }))

  const itemsSet = cartSet.map(({ id, details }) => ({
    id,
    details,
  }))

  const handleCheckout = async () => {
    try {
      // 1. อัปเดตข้อมูลที่อยู่ลูกค้า
      await axios.post(`/api/customer/${customerId}`, { userData })

      // 2. สร้าง Order และ Order Detail
      const orderResponse = await fetch('/api/order/online', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          items,
          itemsSet,
          totalPrice,
          status: 'InQueue',
        }),
      })

      const { orderId, totalPrice: orderTotalPrice } =
        await orderResponse.json()

      if (!orderId) throw new Error('Failed to create order.')

      const paymentCreate = await axios.post('/api/payment/create', {
        orderId,
        amount: orderTotalPrice,
        status: 'Completed',
      })

      const createShipping = await axios.post(`/api/shipping`, {
        orderId,
        status: 'Pending',
      })

      // 3. สร้างการชำระเงินกับ PayPal
      const paymentResponse = await fetch('/api/payment/paypal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, amount: orderTotalPrice }),
      })

      const { id: paypalOrderId } = await paymentResponse.json()

      // 4. รีไดเร็กผู้ใช้ไปยัง PayPal
      if (paypalOrderId) {
        window.location.href = `https://www.sandbox.paypal.com/checkoutnow?token=${paypalOrderId}`
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <Button onClick={handleCheckout}>Checkout</Button>
      {error && <div>{error}</div>}
    </div>
  )
}
