"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { CircleCheck } from 'lucide-react';
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion } from 'framer-motion';

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
    }, [fetchOrders]);

    const handleFinishOrder = async (orderId) => {
        try {
            setAnimationCompleted(false); // Set to false to prevent fetching new orders
            await axios.put(`/api/order/status/${orderId}`, { status: 'Finished' });
            setFinishedOrderIds([...finishedOrderIds, orderId]);
            // Wait for animation to complete before fetching new orders
            setTimeout(() => {
                fetchOrders();
                setAnimationCompleted(true); // Set back to true after fetching new orders
            }, 1000); // Adjust the delay to match the duration of the animation
        } catch (error) {
            console.error("Error finishing order:", error);
        }
    };

    return (
        <section className="grid md:grid-cols-2 py-10 px-5 h-screen gap-4 bg-primary-foreground">
            <div className="col-span-2 rounded-lg flex justify-center items-center">
                <h1 className="text-4xl font-semibold">Order</h1>
            </div>
            {orders.length > 0 ? (

                orders.slice(currentIndex, currentIndex + 2).map(order => (
                    <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            duration: 0.5, // Duration of the animation
                            ease: "easeInOut" // Smooth easing
                        }}
                    >
                        <Card className="overflow-hidden">
                            <CardHeader className="flex flex-row items-start">
                                <div className="grid gap-0.5">
                                    <CardTitle className="group flex items-center gap-2 text-lg md:text-xl lg:text-2xl">
                                        Order {order.id}
                                    </CardTitle>
                                </div>
                                <div className="ml-auto flex items-center gap-1">
                                    <Button
                                        variant="outline"
                                        className='flex items-center gap-2'
                                        onClick={() => handleFinishOrder(order.id)}
                                        disabled={!animationCompleted} // Disable the button while animation is in progress
                                    >
                                        <span className="text-base md:text-lg">Finish</span>
                                        <CircleCheck className='text-green-500 h-4 w-4 md:h-5 md:w-5' />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 text-sm md:text-base lg:text-lg min-h-[60Svh]">
                                <div className="grid gap-3">
                                    <div className="font-semibold">Order Details</div>
                                    <ul className="grid gap-3">
                                        {order.orderDetails
                                            .filter(item => item.menusetId === null)
                                            .map(item => (
                                                <li key={item.id} className="flex items-center justify-start">
                                                    <span className="text-muted-foreground">
                                                        {item.menu.name} x <span>{item.quantity}</span>
                                                    </span>
                                                </li>
                                            ))}

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
                                            <li key={setId}>
                                                <strong>Set {setId}</strong>
                                                <ul>
                                                    {items.map(item => (
                                                        <li key={item.id} className="pl-3 flex items-center justify-between">
                                                            <span>{item.menu.name} x {item.quantity}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))

            ) : (
                <div className="text-center py-10">
                    <h2 className="text-xl font-semibold">No orders available</h2>
                </div>
            )}
        </section>
    );
}
