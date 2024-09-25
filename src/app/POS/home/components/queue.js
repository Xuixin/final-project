import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CircleAlert } from "lucide-react";

export function Queue() {
    const { toast } = useToast();
    const [orders, setOrders] = useState([]);
    const [isHydrated, setIsHydrated] = useState(false);  // Track hydration

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/api/order/queue');
            setOrders(response.data);
        } catch (error) {
            toast.error('Failed to fetch orders');
        }
    };

    useEffect(() => {
        setIsHydrated(true); // Set as hydrated after mount
        fetchOrders();
    }, []);

    if (!isHydrated) {
        // Avoid rendering mismatch during server-side rendering
        return null;
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
                            Queue
                        </CardTitle>
                    </div>
                    <CardDescription>
                        {orders.length} orders in queue
                    </CardDescription>
                </CardHeader>
                <Separator className="mx-2" />
                <CardContent className="p-6 text-sm min-h-80 flex flex-col">
                    <div className="grid gap-3">

                        <ScrollArea className='h-60 py-3 px-3 shadow-inner' >
                            <Table>
                                <TableHeader className='border-b'>
                                    <TableHead>OrderID</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableHeader>
                                <TableBody>
                                    {orders.length > 0 ? (
                                        orders.map((order, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{order.id}</TableCell>
                                                <TableCell>{order.type}</TableCell>
                                                <TableCell>{order.status}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center">
                                                No orders found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>

                        </ScrollArea>
                    </div>
                    <div className='mt-auto'>
                        <Separator className="my-2" />
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
