'use client'

import { Button } from '@/components/ui/button'
import axios from 'axios'
import { Flame, ShoppingCart, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import BestSeller from '@/components/ui/bestseller'
import { useAppContext } from '@/app/Context/AppContext'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { usePathname } from 'next/navigation'


import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';




export function MenuWithPro() {
  const [menusDiscount, setMenusDiscount] = useState([])
  const [bestSeller, setBestSeller] = useState(null)
  const [discounts, setDiscounts] = useState([])
  const { addToCart } = useAppContext()
  const pathName = usePathname()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bestSellerResponse, menusResponse, promotionsResponse] = await Promise.all([
          axios.get('/api/menu/bestSeller'),
          axios.get('/api/menu/withDiscount'),
          axios.get('/api/promotion')
        ])
        setBestSeller(bestSellerResponse.data)
        setMenusDiscount(menusResponse.data)
        setDiscounts(promotionsResponse.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const getDiscountAmount = (discountId) => {
    const discount = discounts.find((d) => d.id === discountId)
    return discount ? discount.discount : 0
  }

  const MenuItem = ({ item, isBestSeller = false }) => {
    const discountAmount = getDiscountAmount(item.discountId)
    const finalPrice = item.price - discountAmount

    return (
      <Card className="w-full h-full flex flex-col">
        <CardHeader className="relative p-0 flex-grow">
          <div className="aspect-w-16 aspect-h-9 relative">
            <Image
              src={item.img}
              alt={item.name}
              width={200}
              height={100}
              layout="responsive"
              className="rounded-t-lg"
            />
          </div>
          {isBestSeller && (
            <Badge className="absolute top-2 left-2 bg-yellow-400 text-black">
              <Flame className="mr-1 h-4 w-4" /> Best Seller
            </Badge>
          )}
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg mb-2">{item.name}</CardTitle>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-green-600 font-bold">RM {finalPrice.toFixed(2)}</span>
            {discountAmount > 0 && (
              <span className="text-red-500 line-through text-sm">RM {item.price.toFixed(2)}</span>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => addToCart({ ...item, quantity: 1 })}>
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to cart
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">
          D<span className="text-red-600">e</span>als
        </h1>
        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent className="-ml-2 md:-ml-4">
            {bestSeller && (
              <CarouselItem key={bestSeller.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <MenuItem item={bestSeller} isBestSeller={true} />
              </CarouselItem>
            )}
            {menusDiscount.map((item) => (
              <CarouselItem key={item.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <MenuItem item={item} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  )
}

export const Menuset = () => {
  const [menuSet, setMenuSet] = useState([])
  const { addToCartSet } = useAppContext()

  useEffect(() => {
    const fetchMenuSet = async () => {
      try {
        const response = await axios.get('/api/menuset')
        setMenuSet(response.data)
      } catch (error) {
        console.error('Error fetching menu set:', error)
      }
    }
    fetchMenuSet()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-8 space-x-2">
          <Sparkles className="w-8 h-8 text-yellow-400" />
          <h2 className="text-4xl font-bold text-white tracking-tight">Special Menu Sets</h2>
          <Sparkles className="w-8 h-8 text-yellow-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:px-16">
          {menuSet?.map((item) => (
            <Card
              key={item.id}
              className="bg-white/95 backdrop-blur-lg border-2 border-gray-200/20 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <CardHeader className="relative pb-2">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-bold text-gray-800">
                      {item.name}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-red-100 text-red-600 hover:bg-red-200">
                      Save {(item.details.reduce((total, m) => total + (m.menu.price * m.quantity), 0) - item.price).toFixed(2)} RM
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl font-bold text-red-600">
                      RM {item.price.toFixed(2)}
                    </div>
                    <Button
                      onClick={() => addToCartSet(item)}
                      className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <ScrollArea className="h-64 w-full pr-4">
                  <div className="space-y-4">
                    {item.details.map((menu, index) => (
                      <div key={index} className="group">
                        <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                            <Image
                              src={menu.menu.img}
                              alt={menu.menu.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-200"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-800">
                              {menu.menu.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Quantity: {menu.quantity}
                            </p>
                          </div>
                          <Badge variant="outline" className="bg-gray-50">
                            RM {(menu.menu.price * menu.quantity).toFixed(2)}
                          </Badge>
                        </div>
                        {index < item.details.length - 1 && (
                          <Separator className="my-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}