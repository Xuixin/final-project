'use client'
import { useAppContext } from '@/app/Context/AppContext'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import axios from 'axios'

// Import UI components
import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import CheckoutButton from '@/components/menuComponant/checkout'

// Function to parse JWT token
import { parseJwt } from '@/lib/jwt'
import { Separator } from '@/components/ui/separator'

export default function Cart() {
  const [user, setUser] = useState({})
  const {
    cartCount,
    cart,
    cartSet,
    removeFromCart,
    removeFromCartSet,
    clearCart,
    clearCartSet,
    minusfromCart,
    addToCart,
  } = useAppContext()

  const handleIncreaseQuantity = (item) => {
    const updatedItem = { ...item, quantity: 1 }
    addToCart(updatedItem)
  }

  const calculateTotal = () => {
    const cartTotal = cart.reduce(
      (total, item) =>
        total +
        (item.discountId
          ? (item.price - item.discount.discount) * item.quantity
          : item.price * item.quantity),
      0
    )
    const cartSetTotal = cartSet.reduce((total, item) => total + item.price, 0)
    return (cartTotal + cartSetTotal).toFixed(2)
  }

  useEffect(() => {
    try {
      const token = localStorage.getItem('token')
      const userId = parseJwt(token).userId

      const fetchUser = async () => {
        const response = await axios.get(`/api/customer/${userId}`)
        await setUser(response.data)
      }
      fetchUser()
    } catch (error) {
      console.error(error)
    }
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
    <section className='px-32 py-5 bg-white'>
      <h3 className="w-full text-4xl font-thin">Your Cart</h3>
      <div className="hearCart flex min-h-96 space-x-5">
        <div className="flex w-full flex-col bg-white rounded-lg py-5 px-10 shadow-md">
          <div className="flex justify-between items-start pr-20 mb-6">
            <Button variant="ghost" className="underline mr-auto">
              Continue Shopping
            </Button>
            <p className="mx-10">{cartCount()} items</p>
          </div>
          <div>
            {((cart && cart.length > 0) || (cartSet && cartSet.length > 0)) ? (
              <>
                {cart.map((item) => (
                  <div key={item.id} className="mb-4">
                    <p className="font-semibold text-lg">{item.name}</p>
                    <div className="grid grid-cols-4 gap-2 items-start">
                      <div className="relative w-full h-24">
                        <Image
                          src={item.img}
                          alt={item.name}
                          layout="fill"
                          objectFit="cover"
                          className="rounded"
                        />
                      </div>
                      <div>
                        <p className="text-gray-600 text-start text-sm">Price</p>
                        <p className="text-sm font-semibold flex justify-start items-center mt-5">
                          RM {item.price.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-start text-sm">Quantity</p>
                        <div className="w-full h-full flex justify-between pr-10">
                          <p className="text-sm font-semibold flex justify-start items-center">
                            {item.quantity}
                          </p>
                          <div className="space-y-2">
                            <div
                              className="p-[2px] rounded-full bg-gray-500 cursor-pointer"
                              onClick={() => handleIncreaseQuantity(item)}
                            >
                              <Plus className="text-white" />
                            </div>
                            <div
                              className="p-[2px] rounded-full bg-gray-500 cursor-pointer"
                              onClick={() => handleDecreaseQuantity(item)}
                            >
                              <Minus className="text-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-600 text-start text-sm">Total</p>
                        <p className="text-sm font-semibold flex justify-start items-center mt-5">
                          RM {(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <Separator className='my-2' />
                  </div>
                ))}

                {cartSet.map((item) => (
                  <>
                    <div key={item.id} className="mb-4 grid grid-cols-4">
                      <div>
                        <p className="text-gray-600 text-start text-sm">Name</p>
                        <p className="text-sm font-semibold flex justify-start items-center mt-5">
                          {item.name}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-600 text-start text-sm">Items</p>
                        <p className="text-sm font-semibold mt-5">
                          {item.details.map((menu) => (
                            <p key={menu.menu.id}>
                              {menu.menu.name} X {menu.quantity}
                            </p>
                          ))}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-start text-sm">Price</p>
                        <p className="text-sm font-semibold flex justify-start items-center mt-5">
                          RM {item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <Separator className='my-2' />
                  </>
                ))}
              </>
            ) : (
              <p className="text-center">Cart is empty</p>
            )}
            {(cart && cart.length > 0) && (
              <div className="w-full flex mt-5 justify-end">
                <Button className="text-center" variant={'outline'} onClick={clearCart}>
                  Clear Cart
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-96 bg-white rounded-e-lg pb-5  max-h-[30rem] shadow-md">
          <h3 className='border h-16 flex items-center bg-orange-400 text-white px-3 font-semibold rounded-t-lg'>Order Summary</h3>
          <div className="w-full py-5 px-8 grid grid-cols-2 gap-4">
            <div>
              <Input
                type="text"
                value={user.name || ''}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            </div>
            <div>
              <Input
                type="text"
                value={user.lastname || ''}
                onChange={(e) => setUser({ ...user, lastname: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Input
                type="text"
                value={user.tel || ''}
                onChange={(e) => setUser({ ...user, tel: e.target.value })}
                placeholder="012-012-0123"
              />
            </div>
            <div className="col-span-2">
              <Textarea
                placeholder="Type your address here."
                onChange={(e) => setUser({ ...user, address: e.target.value })}
                value={user.address}
              />
            </div>
          </div>
          <div className='w-full px-5 my-2'>
            <Separator />
          </div>
          <div className="w-full grid grid-cols-2 space-x-2 items-center p-4 mb-5">
            <p className="font-semibold text-lg">Summary</p>
            <p className="text-lg font-thin text-end">RM {calculateTotal()}</p>
          </div>
          <div className='w-full px-5 my-2 '>
            <Separator />
          </div>
          <div className="w-full flex justify-center">
            <CheckoutButton
              customerId={user.id}
              userData={user}
              totalPrice={calculateTotal()}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
