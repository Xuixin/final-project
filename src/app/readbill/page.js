"use client"
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { CircleCheck, ChevronLeft, ChevronRight, Clock, Users } from 'lucide-react';
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from 'framer-motion';

export default function ReadOrder() {
    const [orders, setOrders] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [finishedOrderIds, setFinishedOrderIds] = useState([]);
    const [animationCompleted, setAnimationCompleted] = useState(true);

    const fetchOrders = useCallback(async () => {
        try {
            const response = await axios.get('/api/order/read');
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, [fetchOrders]);

    const handleFinishOrder = async (order) => {
        try {
            setAnimationCompleted(false);
            const orderId = order.id;
            await axios.put(`/api/order/status/${orderId}`, { status: 'Finished' });
            await axios.put(`/api/igd/order/${orderId}`, { order });
            setFinishedOrderIds([...finishedOrderIds, orderId]);
            setTimeout(() => {
                fetchOrders();
                setAnimationCompleted(true);
            }, 1000);
        } catch (error) {
            console.error("Error finishing order:", error);
            setAnimationCompleted(true);
        }
    };

    const handlePrevPage = () => {
        setCurrentIndex(Math.max(currentIndex - 2, 0));
    };

    const handleNextPage = () => {
        setCurrentIndex(currentIndex + 2);
    };

    // Format the current time
    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('th-TH', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
            <section className="container mx-auto py-6 px-4 md:px-6 space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-bold text-primary">Orders Dashboard</h1>
                    <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <span className="text-muted-foreground">
                            {formatTime(new Date())}
                        </span>
                    </div>
                </div>

                {orders.length > 0 && (
                    <div className="flex justify-between items-center">
                        <Button
                            variant="outline"
                            className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                            onClick={handlePrevPage}
                            disabled={currentIndex === 0}
                        >
                            <ChevronLeft className="h-5 w-5" />
                            <span>Previous</span>
                        </Button>
                        <span className="text-muted-foreground">
                            Showing {currentIndex + 1}-{Math.min(currentIndex + 2, orders.length)} of {orders.length} orders
                        </span>
                        <Button
                            variant="outline"
                            className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                            onClick={handleNextPage}
                            disabled={currentIndex + 2 >= orders.length}
                        >
                            <span>Next</span>
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                    <AnimatePresence mode="wait">
                        {orders.length > 0 ? (
                            orders.slice(currentIndex, currentIndex + 2).map((order, idx) => (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{
                                        duration: 0.3,
                                        delay: idx * 0.1,
                                    }}
                                >
                                    <Card className="overflow-hidden border-2 hover:border-primary transition-colors duration-300">
                                        <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground p-6">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-2">
                                                    <CardTitle className="text-2xl md:text-3xl font-bold">
                                                        Order #{order.id}
                                                    </CardTitle>
                                                    <CardDescription className="text-primary-foreground/90 flex items-center gap-2">
                                                        <Users className="h-4 w-4" />
                                                        Table {order.tableId}
                                                    </CardDescription>
                                                </div>
                                                <Button
                                                    variant="secondary"
                                                    className="flex items-center gap-2 hover:bg-white hover:text-primary transition-colors"
                                                    onClick={() => handleFinishOrder(order)}
                                                    disabled={!animationCompleted || finishedOrderIds.includes(order.id)}
                                                >
                                                    <span>Complete</span>
                                                    <CircleCheck className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-lg font-semibold">Order Details</h3>
                                                    <div className="h-px flex-1 bg-border" />
                                                </div>
                                                <div className="space-y-4">
                                                    {/* Individual Items */}
                                                    {order.orderDetails
                                                        .filter(item => item.menusetId === null)
                                                        .map(item => (
                                                            <motion.div
                                                                key={item.id}
                                                                className="flex justify-between items-center p-3 rounded-lg bg-secondary/30"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                            >
                                                                <span className="font-medium">{item.menu.name}</span>
                                                                <span className="px-3 py-1 bg-primary/10 rounded-full">
                                                                    × {item.quantity}
                                                                </span>
                                                            </motion.div>
                                                        ))}

                                                    {/* Set Menu Items */}
                                                    {Object.entries(
                                                        order.orderDetails
                                                            .filter(item => item.menusetId !== null)
                                                            .reduce((acc, item) => {
                                                                if (!acc[item.menusetId]) {
                                                                    acc[item.menusetId] = [];
                                                                }
                                                                acc[item.menusetId].push(item);
                                                                return acc;
                                                            }, {})
                                                    ).map(([setId, items]) => (
                                                        <div key={setId} className="space-y-2">
                                                            <h4 className="font-semibold text-primary">Set Menu #{setId}</h4>
                                                            <div className="pl-4 space-y-2">
                                                                {items.map(item => (
                                                                    <motion.div
                                                                        key={item.id}
                                                                        className="flex justify-between items-center p-2 rounded-lg bg-secondary/20"
                                                                        initial={{ opacity: 0 }}
                                                                        animate={{ opacity: 1 }}
                                                                    >
                                                                        <span>{item.menu.name}</span>
                                                                        <span className="px-2 py-0.5 bg-primary/10 rounded-full text-sm">
                                                                            × {item.quantity}
                                                                        </span>
                                                                    </motion.div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                className="col-span-2 flex flex-col items-center justify-center p-12 text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="rounded-full bg-primary/10 p-4 mb-4">
                                    <Clock className="h-8 w-8 text-primary" />
                                </div>
                                <h2 className="text-xl font-semibold mb-2">No Active Orders</h2>
                                <p className="text-muted-foreground">New orders will appear here automatically</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>
        </div>
    );
}