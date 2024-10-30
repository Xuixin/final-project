import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import axios from 'axios';
import { useToast } from "@/components/ui/use-toast";
import { fetchAdminInfo } from '@/lib/adminInfo';
import {
    CircleAlert,
    ChevronDown,
    Loader2,
    ReceiptText,
    Plus,
    ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Receipt } from "@/components/receipt";

export function Pos_details({ table, fetchAllTable, pay, order }) {
    const { toast } = useToast();
    const [openSets, setOpenSets] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const cancelOrder = async (table) => {
        setIsLoading(true);
        try {
            const admin = await fetchAdminInfo();
            await axios.post(`/api/order/cancel`, {
                orderId: table.order.orderId,
                empId: admin.id
            });
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
            setIsLoading(false);
        }
    };

    const toggleSetMenu = (index) => {
        setOpenSets((prevState) =>
            prevState.includes(index)
                ? prevState.filter((i) => i !== index)
                : [...prevState, index]
        );
    };

    if (!table) return null;

    if (table.status === 'available') {
        return (
            <motion.div
                initial={{ scale: 0, x: -100 }}
                animate={{ scale: 1, x: 0 }}
                transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                className="h-full"
            >
                <Card className="h-full flex flex-col">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-2xl font-bold">Table {table.table_NO}</CardTitle>
                            <Badge variant="outline">Available</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow flex items-center justify-center">
                        <div className="text-center">
                            <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-4" />
                            <p className="text-lg text-gray-500 mb-4">No active order for this table</p>
                            <Link href={`/POS/menu/${table.id}`}>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" /> Create New Order
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0, x: -100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
            className="h-full max-h-[70vh]"
        >
            <Card className="h-full flex flex-col">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-2xl font-bold">Order #{table.order.orderId}</CardTitle>
                            <CardDescription>
                                Table: {table.table_NO} | Type: {table.type}
                            </CardDescription>
                        </div>
                        <Badge variant={table.order.status === 'Inprogress' ? 'secondary' : 'default'}>
                            {table.order.status}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden">
                    <ScrollArea className="h-[calc(100vh-25rem)]">
                        <div className="space-y-4">
                            {table.order.normalMenu.map((menu) => (
                                <div key={menu.id} className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg">
                                    <img src={menu.img} alt={menu.name} className="w-16 h-16 rounded-md object-cover" />
                                    <div className="flex-grow">
                                        <h3 className="font-semibold">{menu.name}</h3>
                                        <p className="text-sm text-gray-500">RM {(menu.price * menu.quantity).toFixed(2)}</p>
                                    </div>
                                    <Badge variant="outline">x{menu.quantity}</Badge>
                                </div>
                            ))}
                            {table.order.setMenu.map((set, index) => (
                                <div key={set.id} className="bg-gray-50 p-3 rounded-lg">
                                    <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSetMenu(index)}>
                                        <h3 className="font-semibold">SET {index + 1}</h3>
                                        <div className="flex items-center space-x-2">
                                            <span>RM {set.setPrice.toFixed(2)}</span>
                                            <ChevronDown className={`transform transition-transform ${openSets.includes(index) ? 'rotate-180' : ''}`} />
                                        </div>
                                    </div>
                                    <AnimatePresence>
                                        {openSets.includes(index) && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="mt-2 space-y-2"
                                            >
                                                {set.details.map((menu) => (
                                                    <div key={menu.id} className="flex items-center space-x-4 bg-white p-2 rounded-md">
                                                        <img src={menu.img} alt={menu.name} className="w-12 h-12 rounded-md object-cover" />
                                                        <div className="flex-grow">
                                                            <h4 className="font-medium">{menu.name}</h4>
                                                        </div>
                                                        <Badge variant="outline">x{menu.quantity}</Badge>
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter className="flex-col space-y-4 border-t pt-4">
                    <div className="w-full flex justify-between items-center">
                        <span className="font-semibold">Total</span>
                        <span className="text-xl font-bold">RM {table.order.totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="w-full grid grid-cols-2 gap-2">
                        <Button variant="outline" disabled={table.order.status !== 'InQueue' || isLoading} onClick={() => cancelOrder(table)}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Cancel Order'}
                        </Button>
                        <Receipt od={table.order} />
                    </div>
                    <div className="w-full grid grid-cols-2 gap-2">
                        <Link href={`/POS/menu/${table.id}`} className="w-full">
                            <Button variant="secondary" className="w-full">Update Order</Button>
                        </Link>
                        <Button className="w-full" onClick={() => {
                            pay(table.order);
                            order(null);
                        }}>Pay</Button>
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    );
}