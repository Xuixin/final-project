import { useState } from 'react'
import { useAppContext } from '@/app/Context/AppContext'
import { Button } from '../ui/button'
import axios from 'axios'

export default function CheckoutButton({ customerId, userData }) {
  const [error, setError] = useState(null)
  const { cart } = useAppContext()
  const items = cart.map(({ id, name, price, quantity }) => ({
    id,
    name,
    price,
    quantity,
  }))

  const handleCheckout = async () => {
    try {
      // 1. อัปเดตข้อมูลที่อยู่ลูกค้า
      const updateAddressResponse = await axios.post(
        `/api/customer/${customerId}`,
        { userData }
      )

      if (updateAddressResponse.status !== 200) {
        throw new Error('Failed to update address.')
      } else {
        console.log('User data updated successfully')
      }

      // 2. สร้าง Order และ Order Detail
      const orderResponse = await fetch('/api/order/online', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, items }),
      })

      const { orderId, totalPrice } = await orderResponse.json()

      if (!orderId) throw new Error('Failed to create order.')

      // 3. เพิ่มข้อมูลใน model Payment โดยให้ status เป็นยังไม่ชำระ
      const paymentCreationResponse = await axios.post('/api/payment/create', {
        orderId,
        amount: totalPrice,
        status: 'ยังไม่ชำระ',
      })

      // 4. เรียกใช้ PayPal Payment Response
      const paymentResponse = await fetch('/api/payment/paypal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, amount: totalPrice }),
      })

      const { id } = await paymentResponse.json()

      // Redirect ผู้ใช้ไปยังหน้า PayPal
      if (id) {
        window.location.href = `https://www.sandbox.paypal.com/checkoutnow?token=${id}`
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
