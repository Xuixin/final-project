'use client'

import { useAppContext } from '@/app/Context/AppContext'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Minus, Plus, ShoppingBag, ArrowLeft, Package2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { parseJwt } from '@/lib/jwt'
import axios from 'axios'
import CheckoutButton from '@/components/menuComponant/checkout'

export default function Cart() {
  const [user, setUser] = useState({})
  const {
    cartCount,
    cart,
    cartSet,
    removeFromCart,
    clearCart,
    minusfromCart,
    addToCart,
  } = useAppContext()

  // ... existing functions remain the same ...
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
        setUser(response.data)
      }
      fetchUser()
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    console.log(user);
  }, [user])

  const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1) {
      const updatedItem = { ...item, quantity: item.quantity - 1 }
      minusfromCart(updatedItem)
    } else {
      removeFromCart(item.id)
    }
  }

  useEffect(() => {
    console.log(calculateTotal);
  }, [cart])


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
            <Badge variant="secondary" className="text-sm">
              {cartCount()} items
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-md">
              <CardContent className="p-6">
                {((cart && cart.length > 0) || (cartSet && cartSet.length > 0)) ? (
                  <div className="space-y-6">
                    {cart.map((item) => (
                      <div key={item.id} className="group">
                        <div className="flex space-x-4">
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                            <Image
                              src={item.img}
                              alt={item.name}
                              layout="fill"
                              objectFit="cover"
                              className="group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>

                          <div className="flex-1 space-y-2">
                            <div className="flex justify-between">
                              <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-red-500"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <Badge variant="outline" className="px-2 py-1">
                                  RM {item.price.toFixed(2)}
                                </Badge>

                                <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleDecreaseQuantity(item)}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <span className="w-8 text-center">{item.quantity}</span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleIncreaseQuantity(item)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              <p className="font-semibold text-lg">
                                RM {(item.quantity * item.price).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                        <Separator className="my-6" />
                      </div>
                    ))}

                    {cartSet.map((item) => (
                      <div key={item.id} className="group">
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900">
                                {item.name}
                                <Badge variant="secondary" className="ml-2">Set Menu</Badge>
                              </h3>
                              <div className="mt-2 space-y-1">
                                {item.details.map((menu) => (
                                  <p key={menu.menu.id} className="text-sm text-gray-600">
                                    • {menu.menu.name} × {menu.quantity}
                                  </p>
                                ))}
                              </div>
                            </div>
                            <p className="font-semibold text-lg">
                              RM {item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <Separator className="my-6" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
                    <p className="mt-1 text-gray-500">Start adding some items to your cart</p>
                  </div>
                )}

                {(cart && cart.length > 0) && (
                  <div className="mt-6 flex justify-end">
                    <Button
                      variant="outline"
                      onClick={clearCart}
                      className="flex items-center text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear Cart
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-white shadow-md sticky top-4">
              <CardHeader className="bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <Package2 className="h-5 w-5" />
                  <span>Order Summary</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="text"
                      placeholder="First Name"
                      value={user.name || ''}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                      className="focus:ring-orange-500"
                    />
                    <Input
                      type="text"
                      placeholder="Last Name"
                      value={user.lastname || ''}
                      onChange={(e) => setUser({ ...user, lastname: e.target.value })}
                      className="focus:ring-orange-500"
                    />
                  </div>

                  <Input
                    type="tel"
                    placeholder="Phone Number (012-012-0123)"
                    value={user.tel || ''}
                    onChange={(e) => setUser({ ...user, tel: e.target.value })}
                    className="focus:ring-orange-500"
                  />

                  <Textarea
                    placeholder="Delivery Address"
                    value={user.address || ''}
                    onChange={(e) => setUser({ ...user, address: e.target.value })}
                    className="focus:ring-orange-500"
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">RM {calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <Badge>Free</Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-orange-600">
                      RM {calculateTotal()}
                    </span>
                  </div>
                </div>

                <CheckoutButton userData={user} customerId={user.id} totalPrice={calculateTotal} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}