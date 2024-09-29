'use client'

import { Button } from "@/components/ui/button"
import { ChevronLeft, ShoppingCart, Plus, Minus } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState, useEffect } from "react"
import axios from "axios"
import { useQr } from "../qrContext"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SetMenuCom } from './components/set'
import { Loader_orderQr } from "./components/loader"
import { motion, AnimatePresence, } from "framer-motion"
import { CartPage, OrderPage } from "./components/allPage"

const MenuCard = ({ menu, add }) => {
    const newPrice = menu.discount ? (menu.price - menu.discount.discount).toFixed(2) : menu.price.toFixed(2)
    return (
        <Card key={menu.id} className="w-40 rounded-lg shadow-sm">
            <CardHeader className="p-0">
                {/* Image Section */}
                <div className="relative w-full h-24 overflow-hidden rounded-t-lg">
                    <Image
                        src={menu.img}
                        alt={menu.name}
                        fill
                        className="object-cover"
                    />
                </div>
            </CardHeader>

            <CardContent className="px-4 py-2">
                {/* Title and Description */}
                <CardTitle className="text-md font-bold">{menu.name}</CardTitle>
                <CardDescription><p className="text-green-600 font-bold">RM {newPrice}</p></CardDescription>
            </CardContent>

            {/* Price Section */}
            <CardFooter className="px-4 py-2 flex justify-between">
                <Button className="w-full text-white text-sm font-bold" onClick={() => add({ ...menu, quantity: 1 })}>
                    Order
                </Button>
            </CardFooter>
        </Card>
    )
}

export default function OrderTableWithId({ params }) {
    const { tableId } = params
    const [isLoading, setIsLoading] = useState(false)
    const [categories, setCategories] = useState([]) // Store the categories
    const [normalMenu, setNormalMenu] = useState([]) // Store all menu items
    const [filteredMenu, setFilteredMenu] = useState([]) // Store filtered menu items
    const [selectedCategory, setSelectedCategory] = useState('all') // Track selected category
    const [pages, setPages] = useState('menu')


    const { addToCart, cartCount, } = useQr()

    // Fetch menu and menu sets data
    const fetchMenu = async () => {
        try {
            const response = await axios.get('/api/menu')
            setNormalMenu(response.data)
            setFilteredMenu(response.data) // initially display all menus
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

    // Fetch data when component mounts
    useEffect(() => {
        setIsLoading(true);
        Promise.all([fetchMenu(), fetchCategories()])
            .finally(() => {
                setIsLoading(false);
            });
    }, []);


    // Filter menus by category and search term
    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId)
        let filtered = normalMenu
        if (categoryId !== 'all' && categoryId !== 'setmenu') {
            filtered = normalMenu.filter((menu) => menu.categoryId === Number(categoryId))
        } else if (categoryId === 'setmenu') {
            // ถ้าเลือก "setmenu" แสดงเฉพาะเมนูเซต
            filtered = []; // หรือสามารถตั้งค่าให้แสดงเมนูเซตที่คุณต้องการ
        }

        setFilteredMenu(filtered)
    }

    // Filter categories to show only those with menus
    const filteredCategories = categories.filter(category =>
        normalMenu.some(menu => menu.categoryId === category.id)
    );

    return (
        <main className='bg-gray-200 h-screen p-2'>
            <header className="w-full shadow-md h-24 rounded-t-lg bg-black flex items-center justify-between px-5">
                <Image src={'/tomyum.png'} alt={'logo'} width={75} height={75} />
                <h1 className="text-white text-xl font-semibold">Order Table {tableId}</h1>
            </header>

            {pages === 'menu' && (

                isLoading ? (
                    <div className='flex justify-center items-center h-screen border-green-800' >
                        <Loader_orderQr />
                    </div>
                ) : (
                    <section className='w-full bg-secondary rounded-b-lg mb-5 py-5'>
                        <div className='w-full flex justify-between items-center px-3 mb-5'>
                            {/* Category selection */}
                            <Select onValueChange={handleCategoryChange}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {filteredCategories && filteredCategories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                        ))}
                                        <SelectItem value="setmenu">SetMenu</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <Button variant='outline' onClick={() => setPages('order')}>
                                order
                            </Button>

                            {/* Cart Button with animated cart count */}
                            <Button className='rounded-full p-3 relative' onClick={() => setPages('cart')}>
                                {cartCount() > 0 && (
                                    <span className="bg-white text-primary rounded-full absolute top-1 right-1 h-4 w-4 flex items-center justify-center">
                                        {cartCount()}
                                    </span>
                                )}
                                <ShoppingCart className='text-white h-5 w-5' strokeWidth={2.5} />
                            </Button>
                        </div>

                        {/* Scrollable Menu Area */}
                        <ScrollArea className='w-full h-[40rem]'>
                            {selectedCategory === 'setmenu' ? (
                                <SetMenuCom />
                            ) : (
                                <div className='grid grid-cols-2 gap-5 justify-items-center px-5'>
                                    {filteredMenu.map((menu) => (
                                        <MenuCard key={menu.id} menu={menu} add={addToCart} />
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </section>
                )

            )}
            {pages === 'cart' && (
                <CartPage setPage={setPages} tableId={tableId} />
            )}
            {pages === 'order' && (
                <OrderPage setPage={setPages} tableId={tableId} />
            )}
        </main>
    )
}
