'use client'
import { useAppContext } from '@/app/Context/AppContext'
import Image from 'next/image'

//import ui
import { Button } from '@/components/ui/button'
export default function Cart() {
  const { cartCount } = useAppContext()
  return (
    <>
      <h3 className=' w-full  text-4xl font-thin'>Your Cart</h3>
      <section className='hearCart min-h-96 bg-white'>
        <div className='flex flex-col'>
          <div className='flex justify-between items-start pr-20 mb-6'>
            <Button
              variant='ghost'
              className='underline mr-auto'
            >
              Continue Shop
            </Button>
            <p className='mx-10'>{cartCount()} items</p>
          </div>
          <div>
            <div>
              <p className='font-semibold test-lg'>menu name</p>
              <div className='grid grid-cols-4 gap-2 items-start'>
                <div className='relative w-full h-24'>
                  <Image
                    src={'/test.png'}
                    alt={'menu name'}
                    layout='fill'
                    objectFit='cover'
                    className='rounded'
                  />
                </div>
                <div>
                  <p className='text-gray-600 text-start text-sm'>price</p>
                  <p className='text-sm font-semibold text-start'> RM 2.00</p>
                </div>
                <div>
                  <p className='text-gray-600 text-start text-sm'>Quantity</p>
                  <p className='text-sm font-semibold text-start'>2</p>
                </div>
                <div>
                  <p className='text-gray-600 text-start text-sm'>Total</p>
                  <p className='text-sm font-semibold text-start'>RM 4.00</p>
                </div>
              </div>
            </div>
            <div>
              <p className='font-semibold test-lg'>menu name</p>
              <div className='grid grid-cols-4 gap-2 items-start'>
                <div className='relative w-full h-24'>
                  <Image
                    src={'/test.png'}
                    alt={'menu name'}
                    layout='fill'
                    objectFit='cover'
                    className='rounded'
                  />
                </div>
                <div>
                  <p className='text-gray-600 text-start text-sm'>price</p>
                  <p className='text-sm font-semibold text-start'> RM 2.00</p>
                </div>
                <div>
                  <p className='text-gray-600 text-start text-sm'>Quantity</p>
                  <p className='text-sm font-semibold text-start'>2</p>
                </div>
                <div>
                  <p className='text-gray-600 text-start text-sm'>Total</p>
                  <p className='text-sm font-semibold text-start'>RM 4.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>#2</div>
      </section>
    </>
  )
}
