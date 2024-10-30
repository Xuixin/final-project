'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { usePos } from '../../context'
import Image from 'next/image'
import { Loader } from './components/loading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardFooter, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from "@/components/ui/scroll-area"
import { AnimatePresence, motion } from 'framer-motion'
import { Posmenu_details } from './components/details'
import { Search, Package, Utensils } from 'lucide-react'

export default function Menu({ params }) {
    const { id } = params
    const [loading, setLoading] = useState(true)
    const [isSet, setIsSet] = useState(false)
    const [menu, setMenu] = useState([])
    const [menuSet, setMenuSet] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)
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
        <section className='grid flex-1 items-start gap-4 p-4 bg-primary-foreground min-h-screen sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3'>
            <div className='grid auto-rows-max items-start pt-2 gap-4 md:gap-8 lg:col-span-2'>
                <Card className='h-[calc(100vh-5rem)]'>
                    <CardHeader>
                        <CardTitle className='flex items-center'>
                            <Utensils className="mr-2" />
                            Menu
                            <div className='ml-auto relative'>
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <Input
                                    type='text'
                                    placeholder='Search menu...'
                                    className='pl-8 pr-4 py-2 border rounded-full'
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <Separator className='mb-5' />

                    <CardContent className='flex-grow overflow-hidden'>
                        <ScrollArea className="h-[calc(100vh-20rem)]">
                            <AnimatePresence mode="wait">
                                {loading ? (
                                    <Loader />
                                ) : (
                                    <motion.div
                                        key={isSet ? 'set' : 'menu'}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 justify-items-center'
                                    >
                                        {isSet ? (
                                            menuSet.map((set) => (
                                                <motion.div
                                                    key={set.id}
                                                    className="w-full max-w-xs rounded-lg overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => addToCartSet({ ...set, quantity: 1 })}
                                                >
                                                    <div className="p-4">
                                                        <h2 className="text-xl font-bold mb-2">{set.name}</h2>
                                                        <p className="text-gray-600 mb-4">RM {set.price.toFixed(2)}</p>
                                                        <ScrollArea className="h-32 w-full">
                                                            <ul className="space-y-2">
                                                                {set.details.map((m) => (
                                                                    <li key={m.id} className="flex justify-between items-center">
                                                                        <span>{m.menu.name}</span>
                                                                        <span className="text-sm font-semibold">x{m.quantity}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </ScrollArea>
                                                    </div>
                                                </motion.div>
                                            ))
                                        ) : (
                                            filteredItems[0]?.menu.map((item) => (
                                                <motion.div
                                                    key={item.id}
                                                    className="w-full max-w-xs rounded-lg overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => addToCart({ ...item, quantity: 1 })}
                                                >
                                                    <div className="relative w-full h-48">
                                                        <Image
                                                            src={item.img}
                                                            alt={item.name}
                                                            layout="fill"
                                                            objectFit="cover"
                                                        />
                                                    </div>
                                                    <div className="p-4">
                                                        <h2 className="text-lg font-semibold">{item.name}</h2>
                                                        <p className="text-gray-600">RM {item.price.toFixed(2)}</p>
                                                    </div>
                                                </motion.div>
                                            ))
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </ScrollArea>
                    </CardContent>

                    <Separator className='my-5' />
                    <CardFooter className='mb-4 flex items-center overflow-x-auto'>
                        <Button
                            variant={isSet ? 'default' : 'outline'}
                            className='mx-2 whitespace-nowrap'
                            onClick={() => {
                                setIsSet(true)
                                setSelectedCategory(null)
                            }}
                        >
                            <Package className="mr-2 h-4 w-4" />
                            Set Menu
                        </Button>
                        {menu.map((category) => (
                            <Button
                                key={category.id}
                                onClick={() => {
                                    setSelectedCategory(category.id)
                                    setIsSet(false)
                                }}
                                className={`ml-2 rounded-lg whitespace-nowrap ${selectedCategory === category.id ? 'text-white' : ''}`}
                                variant={selectedCategory === category.id ? 'default' : 'outline'}
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