'use client'
import { useToast } from '@/components/ui/use-toast'
import { useState, useEffect } from 'react'
import { useAppContext } from '@/app/Context/AppContext'
import axios from 'axios'

// ui
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'

// component
import { OrderDetails } from '@/components/menuComponant/ordereDetails'

export default function OrderPage() {
  const { toast } = useToast()
  const [order, setOrder] = useState([]) // ตั้งค่าเริ่มต้นเป็น array ว่าง
  const { user } = useAppContext()

  // Fetch order data from API
  const fetchOrder = async () => {
    try {
      const response = await axios.get(`/api/order/online/${user.id}`)
      setOrder(response.data)
      console.log(response.data)
    } catch (error) {
      console.log('Fail to fetch order: ', error)
    }
  }

  useEffect(() => {
    if (user?.id) {
      fetchOrder()
    }
  }, [user])

  return (
    <section>
      <h1 className='font-semibold text-2xl mb-5'>My Orders</h1>
      <div className='w-full min-h-10 px-6'>
        {order.length > 0 ? ( // ตรวจสอบว่า order มีข้อมูลหรือไม่
          order.map((item) => (
            <Dialog key={item.orderId}>
              <DialogTrigger asChild>
                <div className='w-full px-12 bg-white cursor-pointer rounded-sm shadow-sm py-2 mb-3'>
                  <div className='grid grid-cols-4 py-5'>
                    <a className='cursor-pointer hover:underline'>
                      OL{item.orderId}
                    </a>
                    <h1
                      className={`text-md font-medium text-end
                        ${item.status === 'Finished' && 'text-green-500'}
                        ${item.status === 'Cancelled' && 'text-red-500'}
                        ${item.status === 'InQueue' && 'text-yellow-500'}
                      }`}
                    >
                      {item.status}
                    </h1>
                    <p className='text-end text-sm font-light '>
                      {' '}
                      RM {item.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent>
                {/* ส่ง fetchOrder ไปที่ OrderDetails */}
                <OrderDetails
                  order={item}
                  setOrder={setOrder}
                  fetchOrder={fetchOrder}
                />
              </DialogContent>
            </Dialog>
          ))
        ) : (
          <p>No orders available.</p>
        )}
      </div>
    </section>
  )
}
