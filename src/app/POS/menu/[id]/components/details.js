import {
    CircleAlert,
    ChevronDown,
    Loader2,
    Minus,
    Plus
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { fetchAdminInfo } from '@/lib/adminInfo'
import axios from 'axios';
import { usePos } from "../../../context";
import { ScrollArea } from "@/components/ui/scroll-area";


export function Posmenu_details({ id }) {
    const OrderTypes = {
        EXISTING_MENU: 0,
        NEW_DINE_IN: 1,
        NEW_TAKEAWAY: 2,
    };
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [isOldOrderOpen, setIsOldOrderOpen] = useState(false);
    const [tableId, setTableId] = useState(null)
    const [type, setType] = useState(null)
    const [table, setTable] = useState(null)
    const {
        cart,
        cartSet,
        addToCart,
        minusFromCart,
        removeFromCart,
        addToCartSet,
        minusFromCartSet,
        removeFromCartSet,
        clearCart,
        calculateTotalPrice,
        cartCount
    } = usePos()


    const fetchTable = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/table/${id}`);
            console.log('res', response.data);
            // เช็คว่า orders มีอยู่ใน response หรือไม่
            if (response.data.status != 'available') {
                setTable(response.data);
                setType(OrderTypes.EXISTING_MENU);
            } else {
                setType(OrderTypes.NEW_DINE_IN);
                setTable(response.data);
            }
            // ประมวลผลข้อมูลที่ได้รับจาก response ที่นี่
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "เกิดข้อผิดพลาดในการดึงข้อมูลโต๊ะ"

            });
        }
        setIsLoading(false);
    };

    useEffect(() => {
        setTableId(id === 0 ? 0 : id);
        setType(id === 0 ? OrderTypes.NEW_TAKEAWAY : null);
        console.log("id", id);
        if (id != 0) {
            fetchTable();
        }
    }, [id]);

    useEffect(() => {
        console.log("table", table);

    }, [table]);

    const toggleOldOrder = () => {
        setIsOldOrderOpen((prev) => !prev);
    };

    const Exiting_submit = async () => {
        setIsLoading(true)
        try {
            const response = await axios.put(`/api/order/orderTable/${table.orders.orderId}`, {
                menu: [...cart],
                menuSet: [...cartSet],
                order: table?.orders,
                status: 'InQueue',
                totalPrice: calculateTotalPrice(),
                newItemCount: cartCount()

            })

            clearCart()
            fetchTable()
            toast({
                variant: "success",
                title: "Success",
                description: "updating success"
            });


        } catch (error) {
            console.error(error.message)
            toast({
                variant: "destructive",
                title: "Error",
                description: "updating fail"
            });
        } finally {
            setIsLoading(false)
        }
    }

    const createOrder = async () => {
        setIsLoading(true)
        try {
            const source_id = type === OrderTypes.NEW_DINE_IN ? 2 : 3;
            const response = await axios.post(`/api/order/dineIn`, {
                items: cart,
                itemsSet: cartSet,
                totalPrice: calculateTotalPrice(),
                status: 'InQueue',
                source_id,
                table_id: type === OrderTypes.NEW_DINE_IN ? table?.id : null
            })
            clearCart()
            if (source_id !== 3) {
                fetchTable()
            }
            toast({
                variant: "success",
                title: "Success",
                description: "create success"
            });
        } catch (error) {
            console.error(error.message)
            toast({
                variant: "destructive",
                title: "Error",
                description: "create fail"
            });
        }
    }



    return (
        <motion.div
            key={table ? table.id : id}
            initial={{ opacity: 0, scale: 0, x: -100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{
                type: "spring",
                bounce: 0.3,
                duration: 0.4,
            }}
            className='min-h-[45rem]'
        >
            <Card className="overflow-hidden min-h-96">
                <CardHeader className="flex flex-row items-start">
                    <div className="grid gap-0.5">
                        <CardTitle className="group flex items-center gap-2 text-lg">
                            Order #
                        </CardTitle>
                        <CardDescription>
                            Type: {tableId == 0 ? 'Takeaway' : `table : ${table?.table_NO}`}
                        </CardDescription>
                    </div>
                </CardHeader>
                <Separator className="mx-5" />
                <CardContent className="p-6 text-sm min-h-80 flex flex-col">
                    <div className="grid gap-3">
                        <div className="font-semibold text-lg">Order Details</div>
                        <ul className="grid gap-3 mb-auto">

                            <ScrollArea className='h-64 p-3 shadow-inner rounded-lg' style={{ boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)' }}>
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

                                {cartSet.length > 0 && (
                                    cartSet.map((set) => {
                                        return (
                                            <motion.li
                                                key={set.id}
                                                className="flex items-center bg-gray-100 rounded-lg p-2 mb-2"
                                                initial={{ scale: 0.9, opacity: 0 }}  // เริ่มต้นที่ขนาดเล็กและโปร่งใส
                                                animate={{ scale: 1, opacity: 1 }}   // ขยายขนาดเป็นปกติและทำให้เห็นได้ชัดเจน
                                                exit={{ scale: 0.9, opacity: 0 }}
                                                transition={{ type: "spring", damping: 20, stiffness: 300 }} // ปรับค่า damping และ stiffness ให้การเคลื่อนไหวดูนุ่มนวล
                                            >
                                                <div className="flex flex-col flex-grow">
                                                    <h2 className="text-sm font-semibold">{set.name}</h2>
                                                    <h2 className="text-md">RM {set.price.toFixed(2)}</h2>
                                                </div>
                                                <div className="text-end grid  justify-items-center">
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
                                            </motion.li>
                                        )
                                    })
                                )}

                                {/* Exiting order */}
                                {(table?.orders?.normalMenu?.length > 0 || table?.orders?.setMenu?.length > 0) && (
                                    <>
                                        {/* Old Order Header */}
                                        <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleOldOrder()}>
                                            <h2 className="text-md font-semibold">Old Order</h2>
                                            <ChevronDown size={16} />
                                        </div>

                                        {/* AnimatePresence สำหรับการแสดง old order */}
                                        <AnimatePresence>
                                            {isOldOrderOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    {/* แสดง normalMenu */}

                                                    {table?.orders?.normalMenu?.map((menu) => (
                                                        <li key={menu.id} className="flex items-center bg-gray-100 rounded-lg p-2 mb-2">
                                                            <img src={menu.image} alt={menu.name} className="w-12 h-12 rounded-md object-cover mr-2" />
                                                            <div className="flex flex-col flex-grow">
                                                                <h2 className="text-md font-semibold">{menu.name}</h2>
                                                                <h2 className="text-sm">RM {(menu.price * menu.quantity).toFixed(2)}</h2>
                                                            </div>
                                                            <div className="text-end">
                                                                <h2 className="font-semibold">จำนวน</h2>
                                                                <h2>{menu.quantity}</h2>
                                                            </div>
                                                        </li>
                                                    ))}

                                                    {/* แสดง setMenu */}
                                                    {table?.orders?.setMenu?.map((set, index) => (
                                                        <li key={set.id}>
                                                            <ul>
                                                                <div className="grid items-center grid-cols-2">
                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger>
                                                                                <div className="flex">
                                                                                    <h2 className="text-md font-semibold">SET {index + 1}</h2>
                                                                                </div>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>
                                                                                <p className="text-md">Set details</p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>
                                                                    <h2 className="text-end">RM {set.setPrice.toFixed(2)}</h2>
                                                                </div>
                                                                {/* แสดงเมนูภายใน setMenu */}
                                                                {set.details.map((menu) => (
                                                                    <li key={menu.id} className="flex items-center bg-gray-100 rounded-lg p-2 mb-2 pl-5">
                                                                        <img src={menu.image} alt={menu.name} className="w-12 h-12 rounded-md object-cover mr-2" />
                                                                        <div className="flex flex-col flex-grow">
                                                                            <h2 className="text-md font-semibold">{menu.name}</h2>
                                                                        </div>
                                                                        <div className="text-end">
                                                                            <h2 className="font-semibold">จำนวน</h2>
                                                                            <h2>{menu.quantity}</h2>
                                                                        </div>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </li>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </>
                                )}

                            </ScrollArea>

                        </ul>
                    </div>
                    <div className='mt-auto'>
                        <Separator className="my-2" />
                        <ul className="grid gap-3">
                            <li className="flex items-center justify-between font-semibold">
                                <span className="text-muted-foreground">Total</span>
                                {table && type === OrderTypes.EXISTING_MENU ? (
                                    <span>RM {table?.orders?.totalPrice?.toFixed(2)}</span>
                                ) : (
                                    <span>RM {calculateTotalPrice().toFixed(2) || '00.00'}</span>
                                )}
                            </li>
                        </ul>
                    </div>
                    <Separator className='mx-2 my-2' />

                    <div className="flex items-center justify-end w-full space-x-2">
                        <Button variant='outline' disabled={cart.length < 1} className='flex-1' onClick={() => clearCart()}>
                            cancel
                        </Button>
                        {isLoading ? (
                            <Button className={'flex-1'} disabled={isLoading}>
                                {type === OrderTypes.EXISTING_MENU ? "Updating order" : "Creating order"}
                                <span className='mx-1'><Loader2 className="mr-2 h-4 w-4 animate-spin" /></span>
                            </Button>
                        ) : (
                            type === OrderTypes.EXISTING_MENU ? (
                                <Button disabled={isLoading || (cart.length === 0 && cartSet.length === 0)} className='flex-1' onClick={() => Exiting_submit()}>
                                    Update order
                                </Button>
                            ) : (
                                <Button disabled={isLoading || (cart.length === 0 && cartSet.length === 0)} className='flex-1' onClick={() => createOrder()}>
                                    Create order
                                </Button>
                            )
                        )}
                    </div>

                </CardContent>
                <CardFooter className="flex flex-row items-center justify-end border-t bg-muted/50 px-6 py-3">
                    <span className="bg-red-500 rounded-full">
                        <CircleAlert color="#ffffff" absoluteStrokeWidth />
                    </span>
                </CardFooter>
            </Card>
        </motion.div>

    );
}
