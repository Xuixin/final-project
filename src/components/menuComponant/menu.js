'use client'

import { Button } from '@/components/ui/button'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useAppContext } from '@/app/Context/AppContext'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

export function Menu() {
  const [menu, setMenu] = useState([])
  const [discounts, setDiscounts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 16
  const { addToCart } = useAppContext()

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get('/api/menu')

        setMenu(response.data.data)
      } catch (error) {
        console.error('Error fetching menu:', error)
      }
    }

    const fetchDiscount = async () => {
      try {
        const response = await axios.get('/api/promotion')
        setDiscounts(response.data)
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching discount:', error)
      }
    }
    fetchMenu()
    fetchDiscount()
  }, [])

  const getDiscountAmount = (discountId) => {
    const discount = discounts.find((d) => d.id === discountId)
    return discount ? discount.discount : 0
  }

  const paginatedMenu = menu.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(menu.length / itemsPerPage)

  return (
    <div className='relative bg-white'>
      <div className='flex justify-between items-center py-4 px-10'>
        <h1 className='text-4xl font-bold '>
          D<span className='text-red-600'>e</span>als{' '}
        </h1>
      </div>
      <div className='relative overflow-hidden'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 p-4 relative px-10'>
          {/* Display Paginated Menu Items */}
          {paginatedMenu.map((item) => {
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
                    {item.discountId && (
                      <p className='text-red-500 line-through text-center text-xs'>
                        RM {item.price.toFixed(2)}
                      </p>
                    )}
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
        </div>
      </div>

      {/* Pagination */}
      <div className='py-4 px-10'>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href='#'
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              />
            </PaginationItem>
            {[...Array(totalPages).keys()].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href='#'
                  isActive={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href='#'
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
