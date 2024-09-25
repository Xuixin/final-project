'use client'
import { fetchAdminInfo } from "@/lib/adminInfo";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircleAlert, Banknote, QrCode, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Pay({ order, setOrder, setQueue, fetchAllTable }) {
    const { toast } = useToast();
    const [openSets, setOpenSets] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [orders, setOrders] = useState([]);
    const [isHydrated, setIsHydrated] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('Cash')
    const [emp, setemp] = useState(null)


    const toggleSetMenu = (index) => {
        setOpenSets((prevState) => {
            if (prevState.includes(index)) {
                return prevState.filter((i) => i !== index); // Close setMenu
            } else {
                return [...prevState, index]; // Open setMenu
            }
        });
    };

    useEffect(() => {
        setIsHydrated(true); // Set as hydrated after mount
        const fetchAdmin = async () => {
            const data = await fetchAdminInfo();
            setemp(data);
        }

        fetchAdmin();
        setOrders(order)
    }, [order]);

    useEffect(() => {
        console.log('emp', emp);
    }, [emp]);

    if (!isHydrated) {
        // Avoid rendering mismatch during server-side rendering
        return null;
    }

    const onPay = async () => {
        setIsLoading(true);

        try {
            await axios.post(`/api/payment/${order.orderId}`, { order, paymentMethod, emp: emp.id });
            toast({ variant: 'success', title: 'Payment successful', description: 'Thank you for your payment.' });
            setOrder(null);
            setQueue(null);
            fetchAllTable()
        } catch (error) {
            toast({ variant: 'destructive', title: 'Payment failed', description: error.message });
        } finally {
            setPaymentMethod('Cash')
            setIsLoading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0, x: -100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{
                type: "spring",
                bounce: 0.3,
                duration: 0.4,
            }}
        >
            <Card className="overflow-hidden">
                <CardHeader className="flex flex-cols items-start">
                    <div className="grid gap-0.5">
                        <CardTitle className="group flex items-center gap-2 text-lg">
                            Bill
                        </CardTitle>
                    </div>
                    <CardDescription>
                        {order.source == 3 ? (
                            <span className="text-red-500">Takeaway Payment</span>
                        ) : (
                            < span className="text-blue-500">Table : {order.table_NO}</span>
                        )}
                    </CardDescription>
                </CardHeader>
                <Separator className="mx-2" />
                <CardContent className="p-6 text-sm min-h-80 flex flex-col">
                    <div className="grid gap-3">
                        <div className='space-x-3 flex'>
                            <motion.button
                                whileTap={{ scale: 0.7 }}
                                transition={{ type: "spring", damping: 10 }}
                                onClick={() => setPaymentMethod('Cash')} // ตั้ง payment method
                                className={`rounded-lg flex flex-col justify-center text-sm font-semibold px-5 py-2 transition-colors duration-300 ease-in-out ${paymentMethod === 'Cash' ? 'bg-primary text-white' : 'border border-primary text-primary'}`}
                            >
                                <span className="flex justify-center pl-1">
                                    <Banknote />
                                </span>
                                Cash
                            </motion.button>

                            <motion.button
                                whileTap={{ scale: 0.7 }}
                                transition={{ type: "spring", damping: 10 }}
                                onClick={() => setPaymentMethod('QRCode')} // ตั้ง payment method
                                className={`rounded-lg flex flex-col justify-center text-sm font-semibold px-5 py-2 transition-colors duration-300 ease-in-out ${paymentMethod === 'QRCode' ? 'bg-primary text-white' : 'border border-primary text-primary'}`}
                            >
                                <span className="flex justify-center pl-3">
                                    <QrCode />
                                </span>
                                QRCode
                            </motion.button>



                        </div>

                        <ScrollArea className='h-40 py-3 px-3 shadow-inner' >
                            <ul className="grid gap-3 mb-auto">
                                {orders.normalMenu.map((menu) => (
                                    <li key={menu.id} className="flex items-center bg-gray-100 rounded-lg p-2 mb-2">
                                        <img src={menu.img} alt={menu.name} className="w-12 h-12 rounded-md object-cover mr-2" />
                                        <div className="flex flex-col flex-grow">
                                            <h2 className="text-md font-semibold">{menu.name}</h2>
                                            <h2 className="text-sm">RM {(menu.price * menu.quantity).toFixed(2)}</h2>
                                        </div>
                                        <div className="text-end flex flex-col items-center">
                                            <h2 className="text-sm">QTY</h2>
                                            <h2 className="font-semibold text-md">{menu.quantity}</h2>
                                        </div>
                                    </li>
                                ))}

                                {orders.setMenu.map((set, index) => (
                                    <li key={set.id}>
                                        <ul>
                                            <div className="grid items-center grid-cols-2">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <div className="flex" onClick={() => toggleSetMenu(index)}>
                                                                <h2 className="text-md font-semibold">SET {index + 1}</h2>
                                                                <span className="text-sm text-center">
                                                                    <ChevronDown size={16} />
                                                                </span>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Set details</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                <h2 className="text-end">RM {set.setPrice.toFixed(2)}</h2>
                                            </div>
                                            <AnimatePresence>
                                                {openSets.includes(index) && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="flex flex-col pl-5"
                                                    >
                                                        {set.details.map((menu) => (
                                                            <li key={menu.id} className="flex items-center bg-gray-100 rounded-lg p-2 mb-2">
                                                                <img src={menu.img} alt={menu.name} className="w-12 h-12 rounded-md object-cover mr-2" />
                                                                <div className="flex flex-col flex-grow">
                                                                    <h2 className="text-md font-semibold">{menu.name}</h2>
                                                                </div>
                                                                <div className="text-end flex flex-col items-center">
                                                                    <h2 className="text-sm">QTY</h2>
                                                                    <h2 className="font-semibold text-md">{menu.quantity}</h2>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </ul>
                                    </li>
                                ))}
                            </ul>

                        </ScrollArea>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center my-3">
                        <p className='text-lg font-semibold'>Total</p>
                        <p className='text-md font-semibold'>
                            RM
                            <span className="text-lg">
                                {orders.totalPrice.toFixed(2)}
                            </span>
                        </p>
                    </div>
                    <div className='mt-auto'>
                        <Separator className="my-2" />
                    </div>
                    <div className='flex-1'>
                        <Button className='w-full' onClick={onPay} disabled={isLoading}>
                            {isLoading ? 'Paying..' : 'Pay'}
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-row items-center justify-end border-t bg-muted/50 px-6 py-3">
                    <span className="bg-red-500 rounded-full">
                        <CircleAlert color="#ffffff" absoluteStrokeWidth />
                    </span>
                </CardFooter>
            </Card>
        </motion.div >
    );
}
