'use client'
import { useAppContext } from '@/app/Context/AppContext'
import Image from 'next/image'

//import ui
import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Cart() {
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
      <section className='hearCart min-h-96 bg-white'>
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
      </section>
    </>
  )
}
