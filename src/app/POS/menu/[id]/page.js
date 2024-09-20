'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { usePos } from '../../context'

// import componant
import { Loader } from './componants/loading'

//import ui
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardFooter, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from 'framer-motion';
import { Posmenu_details } from './componants/details'




export default function Menu({ params }) {
    const { id } = params
    const [loading, setLoading] = useState(true)  // สถานะ��หลด
    const [menu, setMenu] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [showMoreCategories, setShowMoreCategories] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const { addToCart } = usePos()
    const [tableId, setTableId] = useState(id)

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
                // เลือกหมวดหมู่แรกเป็นค่าเริ่มต้น
                setSelectedCategory(categoriesWithMenu[0]?.id || null)
            } catch (error) {
                console.error('Error fetching menu:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchMenu()
    }, [])

    // ฟังก์ชันกรองเมนูตามคำที่ค้นหา
    const handleSearch = (event) => {
        setSearchTerm(event.target.value)
    }

    // ฟิลเตอร์ข้อมูลเมนูตามคำค้นหาและหมวดหมู่ที่เลือก
    const filteredItems = menu
        .filter((category) => category.id === selectedCategory)
        .map((category) => ({
            ...category,
            menu: category.menu.filter((item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        }))
        .filter((category) => category.menu.length > 0)

    return (
        <>
            <section className='grid flex-1 items-start gap-4 p-4 bg-primary-foreground h-screen sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3'>
                <div className='grid auto-rows-max items-start pt-2 gap-4 md:gap-8 lg:col-span-2'>
                    <Card className='h-[30rem]'>
                        <CardHeader>
                            <CardTitle className='flex'>
                                Menu
                                <div className='ml-auto'>
                                    <Input
                                        type='text'
                                        placeholder='Search menu...'
                                        className='border p-2 rounded'
                                        value={searchTerm}
                                        onChange={handleSearch}
                                    />
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <Separator className='mb-5' />

                        <CardContent className='flex-grow'>
                            <ScrollArea className="h-64">
                                {loading ? (
                                    <Loader />
                                ) : (
                                    <div className='grid grid-cols-3 gap-5 justify-items-center'>
                                        {filteredItems.length === 0 ? (
                                            <p className='text-sm text-gray-500'>No menu found.</p>
                                        ) : (
                                            filteredItems[0]?.menu.map((item) => (
                                                <motion.div
                                                    key={item.id}
                                                    className="w-48 rounded-lg overflow-hidden bg-gray-100 text-center shadow-md"
                                                    whileTap={{ scale: 0.95, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)" }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                                    onClick={() => console.log(`Item clicked ${item.id}`)}  // คุณสามารถใส่ฟังก์ชันที่ต้องการเรียกใช้เมื่อคลิก
                                                >
                                                    <div className="relative w-full h-32">
                                                        <Image
                                                            src={item.img} // เปลี่ยนเป็น path ของรูปที่คุณใช้
                                                            alt={item.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="py-2 bg-gray-200">
                                                        <p className="text-black text-sm font-semibold">{item.name}</p>
                                                    </div>
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </ScrollArea>
                        </CardContent>

                        <Separator className='my-5' />
                        <CardFooter className='mb-4 flex items-center'>
                            {menu.map((category) => (
                                <Button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`ml-2 rounded-lg ${selectedCategory === category.id ? ' text-white' : ''}`}
                                    variant={selectedCategory === category.id ? '' : 'outline'}
                                >
                                    {category.name}
                                </Button>
                            ))}
                        </CardFooter>
                    </Card>
                </div>
                <div className="py-5">
                    <Posmenu_details id={tableId} />
                </div>
            </section>
        </>
    )
}
