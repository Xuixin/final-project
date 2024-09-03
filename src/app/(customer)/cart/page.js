'use client'
import { useAppContext } from '@/app/Context/AppContext'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import axios from 'axios'

//import ui
import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

//import

function parseJwt(token) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )

  return JSON.parse(jsonPayload)
}
export default function Cart() {
  const [user, setUser] = useState([])
  const {
    cartCount,
    cart,
    removeFromCart,
    clearCart,
    minusfromCart,
    addToCart,
  } = useAppContext()

  const handleIncreaseQuantity = (item) => {
    const updatedItem = { ...item, quantity: 1 }
    addToCart(updatedItem)
  }

  const calculateTotal = () => {
    return cart
      .reduce((total, item) => total + item.quantity * item.price, 0)
      .toFixed(2)
  }

  useEffect(() => {
    try {
      const token = localStorage.getItem('token')
      console.log(token)
      const userId = parseJwt(token).userId

      const fetchUser = async () => {
        const response = await axios.get(`/api/customer/${userId}`)
        setUser(response.data)
      }
      fetchUser()
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    console.log(user)
  }, [])

  const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1) {
      const updatedItem = { ...item, quantity: item.quantity - 1 }
      minusfromCart(updatedItem)
    } else {
      removeFromCart(item.id)
    }
  }

  return (
    <>
      <h3 className='w-full text-4xl font-thin'>Your Cart</h3>
      <section className='hearCart min-h-96 bg-white space-x-5'>
        <div className='flex flex-col'>
          <div className='flex justify-between items-start pr-20 mb-6'>
            <Button
              variant='ghost'
              className='underline mr-auto'
            >
              Continue Shopping
            </Button>
            <p className='mx-10'>{cartCount()} items</p>
          </div>
          <div>
            {cart && cart.length > 0 ? (
              cart.map((item) => (
                <div
                  key={item.id}
                  className='mb-4'
                >
                  <p className='font-semibold text-lg'>{item.name}</p>
                  <div className='grid grid-cols-4 gap-2 items-start'>
                    <div className='relative w-full h-24'>
                      <Image
                        src={item.img}
                        alt={item.name}
                        layout='fill'
                        objectFit='cover'
                        className='rounded'
                      />
                    </div>
                    <div>
                      <p className='text-gray-600 text-start text-sm'>Price</p>
                      <p className='text-sm font-semibold flex justify-start items-center mt-5'>
                        RM {item.price.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className='text-gray-600 text-start text-sm'>
                        Quantity
                      </p>
                      <div className='w-full h-full flex justify-between pr-10'>
                        <p className='text-sm font-semibold flex justify-start items-center'>
                          {item.quantity}
                        </p>
                        <div className='space-y-2'>
                          <div
                            className='p-[2px] rounded-full bg-gray-500 cursor-pointer'
                            onClick={() => handleIncreaseQuantity(item)}
                          >
                            <Plus className='text-white' />
                          </div>
                          <div
                            className='p-[2px] rounded-full bg-gray-500 cursor-pointer'
                            onClick={() => handleDecreaseQuantity(item)}
                          >
                            <Minus className='text-white' />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className='text-gray-600 text-start text-sm'>Total</p>
                      <p className='text-sm font-semibold flex justify-start items-center mt-5'>
                        RM {(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-center'>Cart is empty</p>
            )}
            {cart && cart.length > 0 && (
              <div className='w-full flex justify-end'>
                <Button
                  className='text-center'
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
            )}
          </div>
        </div>
        <div>
          <h3>Order Summary</h3>
          <div className='w-full py-5 px-8 grid grid-cols-2 gap-4'>
            <div>
              <Input
                type='text'
                value={user.name || ''}
              />
            </div>
            <div>
              <Input
                type='text'
                value={user.lastname || ''}
              />
            </div>
            <div>
              <Input
                type='text'
                value={user.tel || ''}
                placeholder='012-012-0123'
              />
            </div>
            <div></div>
            <div className='col-span-2'>
              <Textarea placeholder='Type your address here.' />
            </div>
          </div>
          <div className='w-full grid grid-cols-2 space-x-2 items-center p-4 mb-5'>
            <p className='font-semibold text-lg'>Summary</p>
            <p className='textlg font-thin text-end'>RM {calculateTotal()}</p>
          </div>
          <div className='w-full flex justify-center'>
            <Button className='uppercase '>Checkout</Button>
          </div>
        </div>
      </section>
    </>
  )
}
