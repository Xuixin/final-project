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


export function CartPage({ setPage, tableId }) {
    const { toast } = useToast()
    const [expandedSetId, setExpandedSetId] = useState(null);
    const { clearCart, calculateTotalPrice, cart, cartSet, addToCartSet, minusFromCart, minusFromCartSet, removeFromCart, removeFromCartSet } = useQr()

    const toggleDetails = (setId) => {
        setExpandedSetId(prevId => (prevId === setId ? null : setId));
    };

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
                                        onClick={() => toggleDetails(set.id)}  // Toggle details visibility
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

                                {/* AnimatePresence and motion for the set details */}
                            </motion.li>
                            <AnimatePresence>
                                {expandedSetId === set.id && (  // Show details only if this set is expanded
                                    <motion.ul
                                        key={set.id}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                                    >
                                        {set.details.map((m) => (
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
            <Button className={`rounded-2xl w-full my-5 sticky`} onClick={() => onsubmit()}>submit order</Button>
        </section>
    )
}