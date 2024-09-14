'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { useAppContext } from '@/app/Context/AppContext'

//import ui
import { Button } from '@/components/ui/button'
import { Input } from '../ui/input'
import { Menuset } from '../homeCmponant/loopMenuWithPro/loopMenuwithPro'

export function Menu() {
  const [menu, setMenu] = useState([]) // ข้อมูลเมนูทั้งหมด
  const [selectedCategory, setSelectedCategory] = useState(null) // หมวดหมู่ที่ถูกเลือก
  const [showMoreCategories, setShowMoreCategories] = useState(false) // จัดการ dropdown
  const [visibleCategories, setVisibleCategories] = useState([]) // หมวดหมู่ที่ต้องการแสดง
  const [searchTerm, setSearchTerm] = useState('') // จัดการการค้นหา
  const { addToCart } = useAppContext()

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get('/api/menu')
        const data = response.data

        // กรองเฉพาะเมนูที่มีสถานะเป็น 'Published'
        const publishedMenu = data.filter((item) => item.status === 'Published')

        // จัดการกับหมวดหมู่ซ้ำและรวมเมนู
        const categoriesWithMenu = publishedMenu.reduce((acc, item) => {
          const category = acc.find((c) => c.id === item.categoryId)

          if (category) {
            category.menu.push(item) // ถ้าหมวดหมู่ซ้ำให้เพิ่มเมนูเข้าไปในหมวดหมู่เดิม
          } else {
            acc.push({
              id: item.category.id,
              name: item.category.name,
              menu: [item], // สร้างหมวดหมู่ใหม่ถ้ายังไม่มีใน list
            })
          }

          return acc
        }, [])

        setMenu(categoriesWithMenu)
        setVisibleCategories(categoriesWithMenu.slice(0, 3)) // ตั้งหมวดหมู่ที่จะแสดงเริ่มต้น
      } catch (error) {
        console.error('Error fetching menu:', error)
      }
    }

    fetchMenu()
  }, [])

  // ฟังก์ชันการกรองหมวดหมู่
  const filteredMenu = selectedCategory
    ? menu.filter((category) => category.id === selectedCategory)
    : menu

  // ฟังก์ชันสำหรับการสลับหมวดหมู่จาก dropdown
  const handleCategorySwap = (category) => {
    const updatedVisibleCategories = [...visibleCategories]
    updatedVisibleCategories[2] = category // เอาหมวดหมู่ใหม่มาแทนที่ตัวสุดท้าย
    setVisibleCategories(updatedVisibleCategories) // อัปเดตหมวดหมู่ที่แสดง
    setSelectedCategory(category.id) // ตั้งค่าให้เป็นหมวดหมู่ที่ถูกเลือก
    setShowMoreCategories(false) // ปิด dropdown
  }

  // ฟังก์ชันกรองเมนูตามคำที่ค้นหา
  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  // ฟิลเตอร์ข้อมูลเมนูตามคำค้นหา
  const filteredItems = filteredMenu
    .map((category) => ({
      ...category,
      menu: category.menu.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.menu.length > 0)

  return (
    <div>
      <div className='mb-4 flex justify-between'>
        {/* ปุ่มกรองหมวดหมู่ */}
        <div className='mb-4 flex items-center'>
          <Button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full`}
            variant={selectedCategory ? 'outline' : ''}
          >
            All Categories
          </Button>
          {visibleCategories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`ml-2 rounded-full`}
              variant={selectedCategory === category.id ? '' : 'outline'}
            >
              {category.name}
            </Button>
          ))}

          {/* Dropdown สำหรับหมวดหมู่ที่เหลือ */}
          {menu.length > visibleCategories.length && (
            <div className='ml-2 relative'>
              <Button
                onClick={() => setShowMoreCategories(!showMoreCategories)}
                className='rounded-full'
                variant='outline'
              >
                ...
              </Button>

              {showMoreCategories && (
                <div className='absolute mt-2 bg-white shadow-lg rounded-lg z-10'>
                  {menu.slice(visibleCategories.length).map((category) => (
                    <Button
                      key={category.id}
                      onClick={() => handleCategorySwap(category)} // เรียกใช้ฟังก์ชันสลับหมวดหมู่
                      className={`block px-4 py-2 text-left w-full ${selectedCategory === category.id
                          ? 'bg-blue-500 text-white'
                          : ''
                        }`}
                      variant='ghost'
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input สำหรับการค้นหา */}
        <Input
          type='text'
          placeholder='Search menu...'
          className='border p-2 rounded w-[25%] '
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* แสดงหมวดหมู่และเมนูที่ผ่านการกรอง */}
      {filteredItems.length === 0 ? (
        <p>No menu items found.</p>
      ) : (
        filteredItems.map((category) => (
          <div
            key={category.id}
            className='bg-white mb-2 rounded-xl px-8 py-5 shadow-lg'
          >
            <h2 className='text-2xl font-semibold'>{category.name}</h2>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 p-4'>
              {category.menu.map((item) => {
                const finalPrice = item.price - (item.discount?.discount || 0)
                return (
                  <div
                    key={item.id}
                    className='border rounded pb-4 px-4 py-2'
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
                      <h3 className='text-lg font-semibold'>{item.name}</h3>
                      <div className='flex gap-2'>
                        <p className='text-green-500 font-bold'>
                          RM {finalPrice.toFixed(2)}
                        </p>
                        {item.discount && (
                          <p className='text-red-500 line-through'>
                            RM {item.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      className='w-full mt-2'
                      onClick={() => addToCart({ ...item, quantity: 1 })}
                    >
                      Add to Cart
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>
        ))
      )}

      {/* อยากให้มี filter ส่วนนี้ด้วย ส่วน menuset*/}

      <div className='bg-white mb-2 rounded-xl px-8 py-5 shadow-lg'>
        <Menuset />
      </div>
    </div>
  )
}
