'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useToast } from '@/components/ui/use-toast'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { OrderDetails } from '@/components/menuComponant/ordereDetails'
import { fetchUserInfo } from '@/lib/userInfo'
import Link from 'next/link'

export default function OrderPage() {
  const [orders, setOrders] = useState([])
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchOrders = async (userId) => {
    try {
      setIsLoading(true)
      const response = await axios.get(`/api/order/online/${userId}`)
      setOrders(response.data)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      toast({
        title: "Error",
        description: "Failed to load orders. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const getUserAndFetchOrders = async () => {
      try {
        const userData = await fetchUserInfo()
        setUser(userData)
        if (userData?.id) {
          fetchOrders(userData.id)
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error)
        setIsLoading(false)
      }
    }
    getUserAndFetchOrders()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Finished': return 'bg-green-500 hover:bg-green-600';
      case 'Cancelled': return 'bg-red-500 hover:bg-red-600';
      case 'InQueue': return 'bg-yellow-500 hover:bg-yellow-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  }

  if (isLoading) {
    return (
      <section className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        <OrderSkeleton />
      </section>
    )
  }

  if (!user) {
    return (
      <section className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        <Card className="text-center p-8">
          <CardContent className="space-y-4">
            <div className="text-4xl mb-4">🔐</div>
            <h2 className="text-2xl font-semibold">Sign in to view your orders</h2>
            <p className="text-gray-500 mb-4">Please sign in to view your order history and manage your orders</p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <section className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Dialog key={order.orderId}>
              <DialogTrigger asChild>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between py-4">
                    <p className="font-semibold">OL{order.orderId}</p>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">Order details...</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p className="font-medium">RM {order.totalPrice.toFixed(2)}</p>
                  </CardFooter>
                </Card>
              </DialogTrigger>
              <OrderDetails
                order={order}
                fetchOrder={() => fetchOrders(user.id)}
              />
            </Dialog>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-gray-500">No orders available.</p>
          </CardContent>
        </Card>
      )}
    </section>
  )
}

function OrderSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-5 w-[80px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[100px]" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}