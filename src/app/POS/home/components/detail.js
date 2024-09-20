import {
    CircleAlert,
    ChevronDown,
    Loader2
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


export function Pos_details({ table, fetchAllTable }) {
    const { toast } = useToast()
    // State to control the opening/closing of setMenu
    const [openSets, setOpenSets] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    const cancelOrder = async (table) => {
        setIsLoading(true)
        try {
            const admin = await fetchAdminInfo()
            // เปลี่ยนเป็น order.orderId ถ้าจำเป็น
            await axios.post(`/api/order/cancel`,
                {
                    orderId: table.order.orderId,
                    empId: admin.id
                }
            );
            toast({
                variant: "success",
                title: "Order canceled successfully",
                description: "Order will be removed from the table",
            });
            fetchAllTable();
        } catch (error) {
            console.error(error.response || error);
            toast({
                variant: "destructive",
                title: "Error canceling order",
                description: "Failed to cancel the order",
            });
        } finally {
            setIsLoading(false)
        }
    };

    if (!table) return null;

    // Toggle function for setMenu by index
    const toggleSetMenu = (index) => {
        setOpenSets((prevState) => {
            if (prevState.includes(index)) {
                return prevState.filter((i) => i !== index); // Close setMenu
            } else {
                return [...prevState, index]; // Open setMenu
            }
        });
    };

    if (table.status === 'available') {
        return (
            <motion.div
                key={table.id}
                initial={{ scale: 0, x: -100 }}
                animate={{ scale: 1, x: 0 }}
                transition={{
                    type: "spring",
                    bounce: 0.3,
                    duration: 0.4,
                }}
            >
                <Card className="overflow-hidden">
                    <CardHeader className="flex flex-col items-start">
                        <div className="grid gap-0.5">
                            <CardTitle className="group flex items-center gap-2 text-lg">
                                Order #
                            </CardTitle>
                        </div>
                        <div className="ml-auto flex items-center gap-1">
                            Table: {table.table_NO}
                        </div>
                    </CardHeader>
                    <Separator className='mx-2' />
                    <CardContent className="p-6 text-sm min-h-96 flex flex-col">
                        <div className="flex items-center justify-center w-full mb-auto">
                            <Button variant='link' className='underline'>Create new order for this table</Button>
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

    return (
        <motion.div
            key={table.id}
            initial={{ opacity: 0, scale: 0, x: -100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{
                type: "spring",
                bounce: 0.3,
                duration: 0.4,
            }}
        >
            <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-start">
                    <div className="grid gap-0.5">
                        <CardTitle className="group flex items-center gap-2 text-lg">
                            Order {table.order.orderId}
                        </CardTitle>
                        <CardDescription>
                            Type: {table.type}
                        </CardDescription>
                        <CardDescription>
                            Status :
                            <span className='text-xl font-bold'>
                                {table.order.status}
                            </span>
                        </CardDescription>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                        <h1>Table:
                            <span className="text-lg font-semibold">
                                {table.table_NO}
                            </span>
                        </h1>
                    </div>
                </CardHeader>
                <Separator className="mx-5" />
                <CardContent className="p-6 text-sm min-h-80 flex flex-col">
                    <div className="grid gap-3">
                        <div className="font-semibold">Order Details</div>
                        <ul className="grid gap-3 mb-auto">
                            {table.order.normalMenu.map((menu) => (
                                <li key={menu.id}>
                                    <div className="grid items-center grid-cols-4 gap-2">
                                        <h2 className="col-span-2">{menu.name}</h2>
                                        <span>x {menu.quantity}</span>
                                        <h2 className="text-end">RM {(menu.price * menu.quantity).toFixed(2)}</h2>
                                    </div>
                                </li>
                            ))}

                            {table.order.setMenu.map((set, index) => (
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
                                                        <li key={menu.id}>
                                                            <div className="grid items-center grid-cols-2 gap-2">
                                                                <h2>{menu.name}</h2>
                                                                <span>x {menu.quantity}</span>
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
                    </div>
                    <div className='mt-auto'>
                        <Separator className="my-2" />
                        <ul className="grid gap-3">
                            <li className="flex items-center justify-between font-semibold">
                                <span className="text-muted-foreground">Total</span>
                                <span>RM {table.order.totalPrice.toFixed(2)}</span>
                            </li>
                        </ul>
                    </div>
                    <Separator className='mx-2 my-2' />
                    <div className="flex items-center justify-end w-full space-x-2">
                        <Button variant='outline' disabled={table.order.status === 'Inprogress'} className='flex-1' onClick={() => cancelOrder(table)}>
                            {
                                isLoading ? (
                                    <>
                                        Canceling
                                        <span className='mx-1'>< Loader2 className="mr-2 h-4 w-4 animate-spin" /></span>
                                    </>
                                ) : (
                                    'cancel order'
                                )}
                        </Button>
                        <Button className='flex-1'>
                            Pay
                        </Button>
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
