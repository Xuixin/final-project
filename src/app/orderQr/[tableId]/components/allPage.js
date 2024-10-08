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

import { motion, AnimatePresence, } from "framer-motion"
import { useQr } from "../../qrContext"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"


export function CartPage({ setPage, tableId }) {
    const { toast } = useToast()
    const {
        clearCart,
        calculateTotalPrice,
        cart,
        cartSet,
        addToCartSet,
        minusFromCart,
        minusFromCartSet,
        removeFromCart,
        removeFromCartSet,
        cartCount
    } = useQr()
    const [expandedSetId, setExpandedSetId] = useState(null);
    const [isCreate, setIsCreate] = useState(false)
    const [order, setOrder] = useState(null)

    const togglemenusetdetail = (setId) => {
        setExpandedSetId(prevId => (prevId === setId ? null : setId));
    };

    const fetchingOrder = async () => {
        try {
            const response = await axios.get(`/api/table/${tableId}`)
            if (response.data.status === 'available') {
                setIsCreate(true)
            } else {
                setIsCreate(false)
                setOrder(response.data.order)
            }

        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchingOrder()
    }, [])

    useEffect(() => {
        console.log(order);
    }, [order])

    const onsubmit = async () => {
        const Data = {
            items: cart,
            itemsSet: cartSet,
            totalPrice: calculateTotalPrice(),
            status: 'InQueue',
            source_id: 2,
            table_id: tableId
        }

        await axios.post('/api/order/dineIn', Data)
            .then((response) => {
                toast({
                    variant: 'success',
                    title: 'Order Placed',
                    description: 'Your order has been placed successfully',
                })
                clearCart()
                setPage('order')
            })
            .catch((error) => {
                toast({
                    variant: 'destructive',
                    title: 'Error Placing Order',
                    description: 'Failed to place order',
                })
                console.error(error)
            })

        setPage('order')
    }

    const onUpdate = async () => {
        const response = await axios.put(`/api/order/orderTable/${order.orderId}`, {
            menu: [...cart],
            menuSet: [...cartSet],
            order: order,
            status: 'InQueue',
            totalPrice: calculateTotalPrice(),
            newItemCount: cartCount()
        })

        clearCart()

        toast({
            variant: "success",
            title: "Success",
            description: "updating success"
        });

        setPage('order')
    }


    if (cartCount() === 0) {
        return (
            <>
                <Button className='rounded-full p-3 relative' onClick={() => setPage('menu')}>
                    <ChevronLeft className='text-white h-5 w-5' strokeWidth={2.5} />
                </Button>
                <h1>no menu select</h1>

            </>
        )
    }
    return (
        <section className='w-full bg-secondary rounded-b-lg mb-5 py-5 space-y-5 bg-white '>
            <div className='w-full flex justify-between items-center px-3 mb-5'>
                {/* Category selection */}
                <Button className='rounded-full p-3 relative' onClick={() => setPage('menu')}>
                    <ChevronLeft className='text-white h-5 w-5' strokeWidth={2.5} />
                </Button>


            </div>

            {/* Scrollable Menu Area */}
            <ScrollArea className='w-full h-[40rem]'>
                <ul className='px-5'>
                    {cart.length > 0 && (
                        cart.map((menu) => {
                            return (
                                <motion.li
                                    key={menu.id}
                                    className="flex items-center bg-gray-100 rounded-lg p-2 mb-2"
                                    initial={{ scale: 0.9, opacity: 0 }}  // เริ่มต้นที่ขนาดเล็กและโปร่งใส
                                    animate={{ scale: 1, opacity: 1 }}   // ขยายขนาดเป็นปกติและทำให้เห็นได้ชัดเจน
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    transition={{ type: "spring", damping: 20, stiffness: 300 }} // ปรับค่า damping และ stiffness ให้การเคลื่อนไหวดูนุ่มนวล
                                >
                                    <img src={menu.img} alt={menu.name} className="w-12 h-12 rounded-md object-cover mr-2" />
                                    <div className="flex flex-col flex-grow">
                                        <h2 className="text-sm font-semibold">{menu.name}</h2>
                                        <h2 className="text-md">RM {(menu.discountId ? (menu.price - menu.discount.discount) * menu.quantity : menu.price * menu.quantity).toFixed(2)}</h2>
                                    </div>
                                    <div className="text-end grid  justify-items-center">
                                        <div className='flex gap-1 items-end'>
                                            <motion.button
                                                className='rounded-full bg-primary w-5 h-5 flex items-center justify-center'
                                                onClick={() => addToCart({ ...menu, quantity: 1 })}
                                            >
                                                <Plus className='text-white w-4' />
                                            </motion.button>
                                            <h2 className="font-semibold">{menu.quantity}</h2>
                                            <motion.button
                                                className='rounded-full bg-primary w-5 h-5 flex items-center justify-center'
                                                onClick={() => minusFromCart({ ...menu })}
                                            >
                                                <Minus className='text-white w-4' />
                                            </motion.button>
                                        </div>
                                        <Button variant='link' className='text-red-500 py-0' onClick={() => removeFromCart(menu.id)}>remove</Button>
                                    </div>
                                </motion.li>
                            )
                        })
                    )}


                    {cartSet.length > 0 && cartSet.map((set) => (
                        <>

                            <motion.li
                                key={set.id}
                                className="flex items-center bg-gray-100 rounded-lg p-2 mb-2"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                            >
                                <div className="flex flex-col flex-grow">
                                    <h2
                                        className="text-sm font-semibold cursor-pointer"
                                        onClick={() => togglemenusetdetail(set.id)}  // Toggle menusetdetail visibility
                                    >
                                        {set.name}
                                    </h2>
                                    <h2 className="text-md">RM {set.price.toFixed(2)}</h2>
                                </div>
                                <div className="text-end grid justify-items-center">
                                    <div className='flex gap-1 items-end'>
                                        <motion.button
                                            className='rounded-full bg-primary w-5 h-5 flex items-center justify-center'
                                            onClick={() => addToCartSet({ ...set, quantity: 1 })}
                                        >
                                            <Plus className='text-white w-4' />
                                        </motion.button>
                                        <h2 className="font-semibold">{set.quantity}</h2>
                                        <motion.button
                                            className='rounded-full bg-primary w-5 h-5 flex items-center justify-center'
                                            onClick={() => minusFromCartSet(set)}
                                        >
                                            <Minus className='text-white w-4' />
                                        </motion.button>
                                    </div>
                                    <Button variant='link' className='text-red-500 py-0' onClick={() => removeFromCartSet(set.id)}>remove</Button>
                                </div>

                                {/* AnimatePresence and motion for the set menusetdetail */}
                            </motion.li>
                            <AnimatePresence>
                                {expandedSetId === set.id && (  // Show menusetdetail only if this set is expanded
                                    <motion.ul
                                        key={set.id}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                                    >
                                        {set.menusetdetail.map((m) => (
                                            <li key={m.menu.id} className="flex justify-between px-5 items-center">
                                                <img src={m.menu.img} alt={m.menu.name} className="w-12 h-12 rounded-md object-cover mr-2" />

                                                <h2 className="text-sm font-semibold">{m.menu.name}</h2>
                                                <h2 className="text-md">
                                                    X {m.quantity}
                                                </h2>

                                            </li>
                                        ))}
                                    </motion.ul>
                                )}

                            </AnimatePresence>
                        </>
                    ))}
                </ul>

            </ScrollArea>
            {isCreate ? (
                <Button className={`rounded-2xl w-full my-5 sticky`} onClick={() => onsubmit()}>submit order</Button>
            ) : (
                <Button className={`rounded-2xl w-full my-5 sticky`} onClick={() => onUpdate()}>update order</Button>
            )}
        </section>
    )
}

export function OrderPage({ setPage, tableId }) {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const [tableOrder, setTableOrder] = useState([])
    const [expandedSetId, setExpandedSetId] = useState(null);

    if (!tableId || tableOrder) {
        return (
            <>
                <h1>No table or order found</h1>
                <Button className={`rounded-2xl w-full my-5`} onClick={() => setPage('menu')}>back to menu</Button>
            </>
        )
    }

    const togglemenusetdetail = (setId) => {
        setExpandedSetId(prevId => (prevId === setId ? null : setId));
    };
    const { cartCount } = useQr()

    const fetchOrder = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`/api/table/${tableId}`)
            setTableOrder(response.data)
        } catch (error) {
            console.error(error)
            toast({
                title: 'Error fetching order',
                description: 'Please try again later',
                variant: 'destructive'
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchOrder()
    }, [])

    if (isLoading) {
        return (
            <h1>loading....</h1>
        )
    }


    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            classNam='w-full bg-secondary rounded-b-lg mb-5 py-5'
        >
            <div className='w-full flex  justify-between items-center  px-3 py-5'>
                <Button className='rounded-full p-3 relative' onClick={() => setPage('menu')}>
                    <ChevronLeft className='text-white h-5 w-5' strokeWidth={2.5} />
                </Button>


                {/* Cart Button with animated cart count */}
                <Button className='rounded-full p-3 relative' onClick={() => setPage('cart')}>
                    {cartCount() > 0 && (
                        <span className="bg-white text-primary rounded-full absolute top-1 right-1 h-4 w-4 flex items-center justify-center">
                            {cartCount()}
                        </span>
                    )}
                    <ShoppingCart className='text-white h-5 w-5' strokeWidth={2.5} />
                </Button>
            </div>

            {/* Scrollable Menu Area */}
            <ScrollArea className='w-full h-[40rem]  px-4'>
                <div className="space-y-3 p-5 bg-white rounded-lg min-h-32">
                    <h1>Order:
                        <span className="text-xl font-semibold">
                            #{tableOrder?.order?.orderId}
                        </span>
                    </h1>
                    <h2>Status: {tableOrder?.order?.status}</h2>
                    {tableOrder?.order?.normalMenu.length > 0 && (
                        <ul>
                            {tableOrder?.order.normalMenu.map((menu) => {
                                return (
                                    <motion.li
                                        key={menu.id}
                                        className="flex items-center bg-gray-100 rounded-lg p-2 mb-2"
                                        initial={{ scale: 0.9, opacity: 0 }}  // เริ่มต้นที่ขนาดเล็กและโปร่งใส
                                        animate={{ scale: 1, opacity: 1 }}   // ขยายขนาดเป็นปกติและทำให้เห็นได้ชัดเจน
                                        exit={{ scale: 0.9, opacity: 0 }}
                                        transition={{ type: "spring", damping: 20, stiffness: 300 }} // ปรับค่า damping และ stiffness ให้การเคลื่อนไหวดูนุ่มนวล
                                    >
                                        <img src={menu.img} alt={menu.name} className="w-12 h-12 rounded-md object-cover mr-2" />
                                        <div className="flex flex-col flex-grow">
                                            <h2 className="text-sm font-semibold">{menu.name}</h2>
                                            <h2 className="text-md">RM {(menu.discount ? (menu.price - menu.discount.discount) * menu.quantity : menu.price * menu.quantity).toFixed(2)}</h2>
                                        </div>
                                        <div className="text-end grid  justify-items-center">
                                            <div className='flex gap-1 items-end'>
                                                <h2 className="font-semibold">{menu.quantity}</h2>
                                            </div>
                                        </div>
                                    </motion.li>
                                )
                            })}
                        </ul>
                    )}

                    {tableOrder.order?.setMenu?.length > 0 && tableOrder.order?.setMenu?.map((set) => (
                        <>

                            <motion.li
                                key={set.id}
                                className="flex items-center bg-gray-100 rounded-lg p-2 mb-2"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                            >
                                <div className="flex flex-col flex-grow" onClick={() => togglemenusetdetail(set.id)} >
                                    <h2
                                        className="text-sm font-semibold cursor-pointer"
                                    // Toggle menusetdetail visibility
                                    >
                                        {set.setName}
                                    </h2>
                                    <h2 className="text-md">RM {set.setPrice.toFixed(2)}</h2>
                                </div>
                                <div className="text-end grid justify-items-center">
                                    <div className='flex gap-1 items-end'>
                                        <h2 className="font-semibold">OPEN</h2>
                                    </div>

                                </div>

                                {/* AnimatePresence and motion for the set menusetdetail */}
                            </motion.li>
                            <AnimatePresence>
                                {expandedSetId === set.id && (  // Show menusetdetail only if this set is expanded
                                    <motion.ul
                                        key={set.id}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                                        className='space-y-1'
                                    >
                                        {set.menusetdetail.map((m) => (
                                            <li key={m.id} className="flex justify-between px-5 items-center">
                                                <img src={m.img} alt={m.name} className="w-12 h-12 rounded-md object-cover mr-2" />

                                                <h2 className="text-sm font-semibold">{m.name}</h2>
                                                <h2 className="text-md">
                                                    X {m.quantity}
                                                </h2>

                                            </li>
                                        ))}
                                    </motion.ul>
                                )}

                            </AnimatePresence>
                        </>
                    ))}


                </div>
            </ScrollArea>
        </motion.section>
    )
}