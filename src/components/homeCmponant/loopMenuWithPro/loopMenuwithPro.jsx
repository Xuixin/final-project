'use client'

import { Button } from '@/components/ui/button'
import axios from 'axios'
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import BestSeller from '@/components/ui/bestseller'
import { useAppContext } from '@/app/Context/AppContext'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { usePathname } from 'next/navigation'


export function MenuWithPro() {
  const [menusDiscount, setMenusDiscount] = useState([])
  const [bestSeller, setBestSeller] = useState(null)
  const [discounts, setDiscounts] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const { addToCart } = useAppContext()
  const pathName = usePathname()

  useEffect(() => {
    const fetchMenuBest = async () => {
      try {
        const response = await axios.get('/api/menu/bestSeller')
        setBestSeller(response.data)
      } catch (error) {
        console.error('Error fetching best seller:', error)
      }
    }

    const fetchMenu = async () => {
      try {
        const response = await axios.get('/api/menu/withDiscount')
        setMenusDiscount(response.data)
      } catch (error) {
        console.error('Error fetching menus with discount:', error)
      }
    }

    fetchMenuBest()
    fetchMenu()
  }, [])

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const response = await axios.get('/api/promotion')
        setDiscounts(response.data)
      } catch (error) {
        console.error('Error fetching promotions:', error)
      }
    }
    fetchPromotion()
  }, [])

  const getDiscountAmount = (discountId) => {
    const discount = discounts.find((d) => d.id === discountId)
    return discount ? discount.discount : 0
  }

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 4, 0))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 4, menusDiscount.length - 4)
    )
  }

  return (
    <div className='relative bg-white'>
      <div className='flex justify-between items-center py-4 px-10'>
        <h1 className='text-lg font-bold '>
          D<span className='text-red-600'>e</span>als{' '}
        </h1>
      </div>

      <div className='relative overflow-hidden'>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 relative px-10'>
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className='absolute left-0 top-1/2 transform -translate-y-1/2 z-10'
            variant={'outline'}
          >
            <ChevronLeft />
          </Button>

          {/* Display Best Seller item */}
          {bestSeller && (
            <div className='border rounded pb-4 relative'>
              <BestSeller className='absolute top-0 left-0 w-10, h-10' />
              <div className='relative w-full h-36'>
                <Image
                  src={bestSeller.img}
                  alt={bestSeller.name}
                  layout='fill'
                  objectFit='cover'
                  className='rounded'
                />
              </div>
              <div className='w-full px-4'>
                <h2 className='text-lg font-semibold'>{bestSeller.name}</h2>
                <p className='w-full text-green-500 font-bold'>
                  RM{' '}
                  {(
                    bestSeller.price - getDiscountAmount(bestSeller.discountId)
                  ).toFixed(2)}
                </p>
              </div>
              <br />
              <div className='w-full px-4'>
                <Button
                  className='w-full text-center'
                  onClick={() => addToCart({...bestSeller, quantity: 1})}
                >
                  Add to cart
                </Button>
              </div>
            </div>
          )}

          {/* Display Discounted items */}
          {menusDiscount.slice(currentIndex, currentIndex + 4).map((item) => {
            const discountAmount = getDiscountAmount(item.discountId)
            const finalPrice = item.price - discountAmount
            return (
              <div
                key={item.id}
                className='border rounded pb-4 relative'
              >
                <div className='relative w-full h-36'>
                  <Image
                    src={item.img}
                    alt={item.name}
                    layout='fill'
                    objectFit='cover'
                    className='rounded'
                  />
                </div>
                <div className='w-full px-4'>
                  <h2 className='text-lg font-semibold'>{item.name}</h2>
                  <div className='w-full flex justify-start gap-2'>
                    <p className='text-green-500 font-bold'>
                      RM {finalPrice.toFixed(2)}
                    </p>
                    <p className='text-red-500 line-through text-center text-xs'>
                      RM {item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <br />
                <div className='w-full px-4'>
                  <Button
                    className='w-full text-center'
                    onClick={() => addToCart({ ...item, quantity: 1 })}
                  >
                    Add to cart
                  </Button>
                </div>
              </div>
            )
          })}

          <Button
            onClick={handleNext}
            disabled={currentIndex >= menusDiscount.length - 4}
            className='absolute right-0 top-1/2 transform -translate-y-1/2 z-10'
            variant={'outline'}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  )
}

export const Menuset = () => {
  const [menuSet, setMenuSet] = useState([])
  const { addToCartSet } = useAppContext() // เรียกใช้ addToCartSet จาก context

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
    <div className='w-full'>
      <h2 className='text-3xl font-semibold text-center mb-4'>Menu Set</h2>
      <div className='w-full grid grid-cols-2 gap-4 px-16'>
        {menuSet &&
          menuSet.map((item) => {
            return (
              <ScrollArea
                key={item.id}
                className='h-72 w-full  rounded-md border bg-white'
              >
                <div>
                  <div className='sticky top-0 flex bg-white justify-between items-center px-4 h-14 mb-15'>
                    <h4 className='mb-4 text-lg font-semibold leading-none'>
                      {item.name}
                    </h4>
                    <div className='flex items-center'>
                      <Button
                        className='ml-2'
                        onClick={() => addToCartSet(item)} // เรียกใช้ฟังก์ชันเพิ่ม MenuSet เข้า cartSet
                      >
                        Add to cart {'( RM ' + item.price.toFixed(2) + ' )'}
                      </Button>
                    </div>
                  </div>
                  <div className='space-y-2 px-3 mt-2'>
                    {item.details.map((menu, index) => {
                      return (
                        <div key={index} className='max-h-16 border-2 border-orange-100 rounded-lg'>
                          <div className='grid grid-cols-4 gap-2 px-2'>
                            <Image
                              src={menu.menu.img}
                              alt={menu.menu.name}
                              width={48}
                              height={48}
                              className='rounded'
                            />
                            <h6 className='text-sm font-medium leading-none flex items-center'>
                              {menu.menu.name}
                            </h6>
                            <p className='text-sm flex items-center'>
                              {menu.quantity} unit
                            </p>
                            <p className='text-sm flex justify-center items-center'>
                              RM {(menu.quantity * menu.menu.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <Separator className='my-2' />
                  <div className='text-sm'>hi</div>
                </div>
              </ScrollArea>
            )
          })}
      </div>
    </div>
  )
}