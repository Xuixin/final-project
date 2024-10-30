'use client'

import { useState, useEffect } from "react"
import axios from "axios"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useQr } from "../qrContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Plus, Minus, ChevronLeft } from "lucide-react"
import { SetMenuCom } from './components/set'
import { Loader_orderQr } from "./components/loader"
import { CartPage, OrderPage } from "./components/allPage"

const MenuCard = ({ menu, add }) => {
    const hasDiscount = menu.discount && menu.discount.discount > 0;
    const newPrice = hasDiscount ? (menu.price - menu.discount.discount).toFixed(2) : menu.price.toFixed(2);
    const discountPercentage = hasDiscount ? Math.round((menu.discount.discount / menu.price) * 100) : 0;

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <Card className="w-full overflow-hidden shadow-md">
                <div className="relative h-40">
                    <Image
                        src={menu.img}
                        alt={menu.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-lg"
                    />
                    {hasDiscount && (
                        <Badge className="absolute top-2 right-2 bg-red-500">
                            {discountPercentage}% OFF
                        </Badge>
                    )}
                </div>
                <CardContent className="p-4">
                    <CardTitle className="text-sm font-bold line-clamp-2 mb-2">{menu.name}</CardTitle>
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            {hasDiscount && (
                                <CardDescription className="text-xs line-through text-gray-500">
                                    RM {menu.price.toFixed(2)}
                                </CardDescription>
                            )}
                            <CardDescription className="text-sm font-bold text-green-600">
                                RM {newPrice}
                            </CardDescription>
                        </div>
                        {hasDiscount && (
                            <Badge variant="outline" className="text-xs text-orange-500 border-orange-500">
                                Save RM {menu.discount.discount.toFixed(2)}
                            </Badge>
                        )}
                    </div>
                    <Button
                        className="w-full bg-black hover:bg-gray-800 text-white text-xs"
                        onClick={() => add({ ...menu, quantity: 1 })}
                    >
                        <ShoppingCart className="mr-2 h-3 w-3" /> Add to Cart
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default function OrderTableWithId({ params }) {
    const { tableId } = params
    const [isLoading, setIsLoading] = useState(false)
    const [categories, setCategories] = useState([])
    const [normalMenu, setNormalMenu] = useState([])
    const [filteredMenu, setFilteredMenu] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [pages, setPages] = useState('menu')

    const { addToCart, cartCount } = useQr()

    const fetchMenu = async () => {
        try {
            const response = await axios.get('/api/menu')
            setNormalMenu(response.data)
            setFilteredMenu(response.data)
        } catch (err) {
            console.error('Error fetching menu:', err)
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/menutype')
            setCategories(response.data.data)
        } catch (err) {
            console.error('Error fetching categories:', err)
        }
    }

    useEffect(() => {
        setIsLoading(true)
        Promise.all([fetchMenu(), fetchCategories()]).finally(() => setIsLoading(false))
    }, [])

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId)
        let filtered = normalMenu
        if (categoryId !== 'all' && categoryId !== 'setmenu') {
            filtered = normalMenu.filter((menu) => menu.categoryId === Number(categoryId))
        } else if (categoryId === 'setmenu') {
            filtered = []
        }
        setFilteredMenu(filtered)
    }

    const filteredCategories = categories.filter(category =>
        normalMenu.some(menu => menu.categoryId === category.id)
    )

    return (
        <main className='bg-gray-100 min-h-screen flex flex-col'>
            <header className="bg-black text-white p-4 flex items-center justify-between sticky top-0 z-50">
                <Image src={'/tomyum.png'} alt={'logo'} width={50} height={50} />
                <h1 className="text-lg font-semibold">Table {tableId}</h1>
                <Button variant="ghost" className="p-2 relative" onClick={() => setPages('cart')}>
                    <ShoppingCart className='h-6 w-6' />
                    {cartCount() > 0 && (
                        <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                            {cartCount()}
                        </Badge>
                    )}
                </Button>
            </header>

            <AnimatePresence mode="wait">
                {pages === 'menu' && (
                    <motion.div
                        key="menu"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-grow flex flex-col"
                    >
                        {isLoading ? (
                            <div className='flex justify-center items-center h-full'>
                                <Loader_orderQr />
                            </div>
                        ) : (
                            <>
                                <div className='sticky top-[72px] bg-white z-40 p-4 shadow-md'>
                                    <Select onValueChange={handleCategoryChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="all">All Categories</SelectItem>
                                                {filteredCategories.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                                ))}
                                                <SelectItem value="setmenu">Set Menu</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <ScrollArea className='flex-grow p-4'>
                                    {selectedCategory === 'setmenu' ? (
                                        <SetMenuCom />
                                    ) : (
                                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                                            {filteredMenu.map((menu) => (
                                                <MenuCard key={menu.id} menu={menu} add={addToCart} />
                                            ))}
                                        </div>
                                    )}
                                </ScrollArea>

                                <div className="sticky bottom-0 bg-white p-4 shadow-md">
                                    <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => setPages('order')}>
                                        View Orders
                                    </Button>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
                {pages === 'cart' && (
                    <motion.div
                        key="cart"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween' }}
                        className="absolute inset-0 top-5 bg-white"
                    >
                        <CartPage setPage={setPages} tableId={tableId} />
                    </motion.div>
                )}
                {pages === 'order' && (
                    <motion.div
                        key="order"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween' }}
                        className="absolute inset-0 bg-white"
                    >
                        <OrderPage setPage={setPages} tableId={tableId} />
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    )
}