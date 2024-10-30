import { useState } from 'react'
import { useAppContext } from '@/app/Context/AppContext'
import { Button } from '../ui/button'
import axios from 'axios'

export default function CheckoutButton({ customerId, userData, totalPrice }) {
  const [error, setError] = useState(null)
  const { cart, cartSet } = useAppContext()



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

  const tt = totalPrice()

  const handleCheckout = async () => {
    try {
      // 1. อัปเดตข้อมูลที่อยู่ลูกค้า
      const response = await axios.post(`/api/customer/${customerId}`, userData)
      const customer = response.data

      // 2. สร้าง Order และ Order Detail
      const orderResponse = await axios.post('/api/order/online', {
        cid: customer.id,
        items,
        itemsSet,
        totalPrice: tt,
        status: 'InQueue',
      }
      )
      console.log(orderResponse);

      const { orderId, totalPrice: orderTotalPrice } = orderResponse.data

      if (!orderId) throw new Error('Failed to create order.')

      localStorage.setItem('orderId', orderId)

      const paymentCreate = await axios.post('/api/payment/create', {
        orderId,
        amount: orderTotalPrice,
        status: 'InComplete',
      })

      const createShipping = await axios.post(`/api/shipping`, {
        orderId,
        status: 'Pending',
      })

      console.log('orderId', orderId);

      const paymentResponse = await fetch('/api/payment/paypal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, amount: orderTotalPrice }),
      })



      const { id: paypalOrderId } = await paymentResponse.json()



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
