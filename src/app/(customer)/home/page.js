'use client'
import axios from 'axios'
import Image from 'next/image'
import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Import componants
import MenuWithPro from '@/components/homeCmponant/loopMenuWithPro/loopMenuwithPro'

export default function Home() {
  const [banners, setBanners] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get('/api/banner') // Ensure the endpoint is correct
        setBanners(response.data)
      } catch (error) {
        console.error('Error fetching banners:', error)
      }
    }

    fetchBanners()
  }, [])

  useEffect(() => {
    console.log('Banners updated:', banners)
    // console.log(banners[currentIndex].image)
  }, [banners])

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)
  }

  const handlePrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + banners.length) % banners.length
    )
  }

  return (
    <div className='w-full flex flex-col space-y-8'>
      {banners.length > 0 ? (
        <div className='w-full max-h-48 relative lg:h-80 lg:max-h-96 overflow-hidden rounded'>
        <Button
          className='absolute left-0 top-1/2 transform -translate-y-1/2 z-10'
          onClick={handlePrevious}
        >
          <ChevronLeft />
        </Button>

        {banners.length > 0 && (
          <Image
            src={banners[currentIndex].Image} // Ensure your API response has an 'image' field
            alt={banners[currentIndex].altText || 'Banner image'} // Use the correct field if 'altText' is not available
            width={1024}
            height={1024}
            layout='responsive'
          />
        )}

        <Button
          className='absolute right-0 top-1/2 transform -translate-y-1/2 z-10'
          onClick={handleNext}
        >
          <ChevronRight />
        </Button>
      </div>
      ): (
        ''
      )}
      <hr/>
      <div className={'w-full'}>
        <h1><strong className="text-2xl">Discount</strong></h1>
        <MenuWithPro />
      </div>
    </div>
  )
}
