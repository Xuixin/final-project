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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleAlert, RefreshCw, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export function Queue() {
    const { toast } = useToast();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isHydrated, setIsHydrated] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/order/queue');
            setOrders(response.data);
            setLastUpdated(new Date());
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error fetching orders",
                description: "Please try again later"
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsHydrated(true);
        fetchOrders();
        // Auto refresh every 30 seconds
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, []);

    const getStatusBadge = (status) => {
        const variants = {
            pending: "warning",
            processing: "default",
            completed: "success",
            cancelled: "destructive",
        };
        return variants[status.toLowerCase()] || "secondary";
    };

    useEffect(() => {
        console.log(orders);
    }, [])

    const formatLastUpdated = () => {
        return lastUpdated.toLocaleTimeString();
    };

    if (!isHydrated) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                type: "spring",
                bounce: 0.3,
                duration: 0.4,
            }}
        >
            <Card className="overflow-hidden border-2">
                <CardHeader className="space-y-1 bg-muted/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-xl font-bold">
                                Queue Monitor
                                {orders.length > 0 && (
                                    <Badge variant="default" className="ml-2">
                                        {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                                    </Badge>
                                )}
                            </CardTitle>
                            <CardDescription className="mt-1.5 flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Last updated: {formatLastUpdated()}
                            </CardDescription>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="rounded-full p-2 hover:bg-muted"
                            onClick={fetchOrders}
                        >
                            <RefreshCw className="h-5 w-5" />
                        </motion.button>
                    </div>
                </CardHeader>
                <Separator />
                <CardContent className="p-0">
                    <ScrollArea className="h-[400px] rounded-md">
                        <div className="p-4">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-[100px] font-bold">OrderID</TableHead>
                                        <TableHead className="font-bold">Type</TableHead>
                                        <TableHead className="font-bold">Status</TableHead>
                                        <TableHead className="text-right font-bold">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        Array(5).fill(0).map((_, index) => (
                                            <TableRow key={index}>
                                                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                                <TableCell><Skeleton className="h-5 w-16 float-right" /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : orders.length > 0 ? (
                                        orders.map((order, index) => (
                                            <motion.tr
                                                key={order.id}
                                                className="group relative cursor-pointer border-b transition-colors hover:bg-muted/50"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <TableCell className="font-medium">#{order.id}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="font-medium">
                                                        {order.order_source.source_name}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={getStatusBadge(order.status)}>
                                                        {order.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="invisible group-hover:visible">
                                                        <Badge
                                                            variant="secondary"
                                                            className="cursor-pointer hover:bg-secondary/80"
                                                        >
                                                            View Details
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-32 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
                                                    <p className="text-sm text-muted-foreground">Queue is empty</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t bg-muted/30 px-6 py-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Auto-refreshing every 30 seconds
                    </div>
                    {orders.length > 0 && (
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                            <span className="text-sm text-muted-foreground">
                                {orders.length} {orders.length === 1 ? 'item requires' : 'items require'} attention
                            </span>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    );
}