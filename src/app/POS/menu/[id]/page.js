'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { usePos } from '../../context'

// import components
import Image from 'next/image'
import { Loader } from './components/loading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardFooter, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from "@/components/ui/scroll-area"
import { AnimatePresence, motion } from 'framer-motion'
import { Posmenu_details } from './components/details'

export default function Menu({ params }) {
    const { id } = params
    const [loading, setLoading] = useState(true)
    const [isSet, setIsSet] = useState(false)
    const [menu, setMenu] = useState([])
    const [menuSet, setMenuSet] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [selectedMenuSet, setSelectedMenuSet] = useState(null)  // ใช้สำหรับเก็บ menuSet ที่ถูกเลือก
    const [searchTerm, setSearchTerm] = useState('')
    const { addToCart, addToCartSet } = usePos()
    const [tableId, setTableId] = useState(id)

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await axios.get('/api/menu')
                const data = response.data

                const publishedMenu = data.filter((item) => item.status === 'Published')

                const categoriesWithMenu = publishedMenu.reduce((acc, item) => {
                    const category = acc.find((c) => c.id === item.categoryId)

                    if (category) {
                        category.menu.push(item)
                    } else {
                        acc.push({
                            id: item.category.id,
                            name: item.category.name,
                            menu: [item],
                        })
                    }

                    return acc
                }, [])

                setMenu(categoriesWithMenu)
                setSelectedCategory(categoriesWithMenu[0]?.id || null)
            } catch (error) {
                console.error('Error fetching menu:', error)
            } finally {
                setLoading(false)
            }
        }

        const fetchMenuSet = async () => {
            try {
                const response = await axios.get('/api/menuset')
                setMenuSet(response.data)
            } catch (error) {
                console.error('Error fetching menu set:', error)
            }
        }
        fetchMenuSet()
        fetchMenu()
    }, [])

    const handleSearch = (event) => {
        setSearchTerm(event.target.value)
    }

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
        <section className='grid flex-1 items-start gap-4 p-4 bg-primary-foreground h-screen sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3'>
            <div className='grid auto-rows-max items-start pt-2 gap-4 md:gap-8 lg:col-span-2'>
                <Card className='h-[45rem]'>
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
                        <ScrollArea className="h-[30rem]">
                            {loading ? (
                                <Loader />
                            ) : (
                                isSet ? (
                                    <div className='grid grid-cols-3 gap-5 justify-items-center'>
                                        {menuSet.map((set) => (
                                            <motion.div
                                                key={set.id}
                                                className="w-48 rounded-lg overflow-hidden bg-gray-100 text-center shadow-md pt-2"
                                                whileTap={{ scale: 0.95, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)" }}
                                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                                onClick={() => addToCartSet({ ...set, quantity: 1 })}
                                            >
                                                <div className="font-semibold text-md flex justify-between px-5 w-full" >
                                                    <h1 className='font-semibold text-lg text-start'>{set.name} </h1>
                                                    <h3 className="font-semibold text-lg ">{set.price.toFixed(2)}</h3>
                                                </div>

                                                {/* AnimatePresence และ motion.div ใช้สำหรับแสดง/ซ่อน details */}

                                                <ScrollArea className='w-full h-48 py-2 px-5 bg-white mt-2'>
                                                    <ul
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="overflow-hidden"
                                                    >
                                                        {set.details.map((m) => (
                                                            <li key={m.id} className='py-2 text-start flex justify-between'>
                                                                <p>{m.menu.name} </p>
                                                                <p className="text-end">
                                                                    <span className="text-sm font-semibold">X</span>
                                                                    {m.quantity}
                                                                </p>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </ScrollArea>

                                            </motion.div>
                                        ))}
                                    </div>
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
                                                    onClick={() => addToCart({ ...item, quantity: 1 })}
                                                >
                                                    <div className="relative w-full h-32">
                                                        <Image
                                                            src={item.img}
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
                                )
                            )}
                        </ScrollArea>
                    </CardContent>

                    <Separator className='my-5' />
                    <CardFooter className='mb-4 flex items-center'>
                        <Button
                            variant={isSet ? 'default' : 'outline'} className='mx-2'
                            onClick={() => {
                                setIsSet(true)
                                setSelectedCategory(null)
                            }}
                        >
                            Set
                        </Button>
                        {menu.map((category) => (
                            <Button
                                key={category.id}
                                onClick={() => {
                                    setSelectedCategory(category.id)
                                    setIsSet(false)
                                }}
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
    )
}
