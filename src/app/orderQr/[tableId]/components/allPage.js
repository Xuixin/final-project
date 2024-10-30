import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ShoppingCart, Plus, Minus, ChevronDown, ChevronUp } from "lucide-react";
import cn from 'classnames';
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useQr } from "../../qrContext";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";


import { Skeleton } from "@/components/ui/skeleton";

export function OrderPage({ setPage, tableId }) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [tableOrder, setTableOrder] = useState(null);
    const [expandedSetId, setExpandedSetId] = useState(null);
    const { cartCount } = useQr();

    const toggleMenuSetDetail = (setId) => {
        setExpandedSetId(prevId => (prevId === setId ? null : setId));
    };

    const fetchOrder = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/table/${tableId}`);
            setTableOrder(response.data);
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error fetching order',
                description: 'Please try again later',
                variant: 'destructive'
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, []);

    if (!tableId || !tableOrder) {
        return (
            <Card className="flex flex-col items-center justify-center mt-20 h-screen">
                <CardContent className="pt-6">
                    <h1 className="text-2xl font-bold mb-4 text-center">No table or order found</h1>
                    <Button
                        className="w-full bg-primary hover:bg-primary/90 transition-colors"
                        onClick={() => setPage('menu')}
                    >
                        Back to menu
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (isLoading) {
        return (
            <div className="space-y-4 p-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        );
    }

    if (tableOrder.status === 'available') {
        return (
            <Card className="w-full max-w-md mx-auto flex flex-col items-center justify-center h-screen shadow-lg">
                <CardContent className="pt-6">
                    <h1 className="text-2xl font-bold mb-4 text-center">This table is not available</h1>
                    <Button
                        className="w-full bg-primary hover:bg-primary/90 transition-colors"
                        onClick={() => setPage('menu')}
                    >
                        Back to menu
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen bg-gradient-to-b from-secondary/50 to-secondary pb-6"
        >
            {/* Header Navigation */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
                <div className="max-w-md mx-auto w-full flex justify-between items-center px-4 py-3">
                    <Button
                        variant="ghost"
                        className="rounded-full p-3 hover:bg-secondary transition-colors"
                        onClick={() => setPage('menu')}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        className="rounded-full p-3 hover:bg-secondary transition-colors relative"
                        onClick={() => setPage('cart')}
                    >
                        {cartCount() > 0 && (
                            <Badge
                                variant="destructive"
                                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
                            >
                                {cartCount()}
                            </Badge>
                        )}
                        <ShoppingCart className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-md mx-auto px-4 mt-4">
                <ScrollArea className="h-[calc(100vh-8rem)]">
                    <Card className="mb-4 shadow-lg border-secondary">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <span>Order: #{tableOrder?.order?.orderId}</span>
                                <Badge
                                    className={cn(
                                        "capitalize",
                                        tableOrder?.order?.status === 'completed' && "bg-green-500",
                                        tableOrder?.order?.status === 'pending' && "bg-yellow-500",
                                        tableOrder?.order?.status === 'processing' && "bg-blue-500"
                                    )}
                                >
                                    {tableOrder?.order?.status}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {tableOrder?.order?.normalMenu.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold border-b pb-2">Regular Items</h3>
                                    <div className="space-y-3">
                                        {tableOrder.order.normalMenu.map((menu) => (
                                            <OrderItem key={menu.id} item={menu} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {tableOrder.order?.setMenu?.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold border-b pb-2">Set Menu Items</h3>
                                    <div className="space-y-3">
                                        {tableOrder.order.setMenu.map((set) => (
                                            <SetMenuItem
                                                key={set.id}
                                                set={set}
                                                isExpanded={expandedSetId === set.id}
                                                onToggle={() => toggleMenuSetDetail(set.id)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </ScrollArea>
            </div>
        </motion.section>
    );
}

function OrderItem({ item }) {
    return (
        <motion.div
            className="flex items-center bg-gray-100 rounded-lg p-2"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
        >
            <Image src={item.img} alt={item.name} width={48} height={48} className="rounded-md object-cover mr-2" />
            <div className="flex-grow">
                <h2 className="text-sm font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-600">
                    RM {((item.discount ? item.price - item.discount.discount : item.price) * item.quantity).toFixed(2)}
                </p>
            </div>
            <Badge variant="secondary">{item.quantity}</Badge>
        </motion.div>
    );
}

function SetMenuItem({ set, isExpanded, onToggle }) {
    return (
        <Card>
            <CardHeader className="cursor-pointer" onClick={onToggle}>
                <CardTitle className="flex justify-between items-center">
                    <span>{set.setName}</span>
                    <Button variant="ghost" size="sm">
                        {isExpanded ? <ChevronUp /> : <ChevronDown />}
                    </Button>
                </CardTitle>
            </CardHeader>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <CardContent>
                            {set.menusetdetail.map((item) => (
                                <OrderItem key={item.id} item={item} />
                            ))}
                        </CardContent>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
}

function OrderSkeleton() {
    return (
        <Card className="w-full">
            <CardContent className="pt-6 space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </CardContent>
        </Card>
    );
}

const MenuItemCard = ({ item, isSet, onAdd, onMinus, onRemove, onToggleDetails }) => {
    return (
        <Card className="mb-4 overflow-hidden">
            <CardContent className="p-4">
                <div className="flex items-center">
                    <div className="relative w-20 h-20 mr-4">
                        <Image
                            src={item.img}
                            alt={item.name}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-md"
                        />
                    </div>
                    <div className="flex-grow">
                        <CardTitle className="text-lg mb-1">{item.name}</CardTitle>
                        <CardDescription className="text-sm mb-2">
                            RM {((isSet ? item.price : (item.discountId ? item.price - item.discount.discount : item.price)) * item.quantity).toFixed(2)}
                        </CardDescription>
                        <div className="flex items-center">
                            <Button
                                size="sm"
                                variant="outline"
                                className="p-1"
                                onClick={() => onMinus(item)}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="mx-2 font-semibold">{item.quantity}</span>
                            <Button
                                size="sm"
                                variant="outline"
                                className="p-1"
                                onClick={() => onAdd(item)}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <Button
                            variant="ghost"
                            className="text-red-500 p-1"
                            onClick={() => onRemove(item.id)}
                        >
                            Remove
                        </Button>
                        {isSet && (
                            <Button
                                variant="ghost"
                                className="p-1 mt-2"
                                onClick={() => onToggleDetails(item.id)}
                            >
                                Details
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export function CartPage({ setPage, tableId }) {
    const { toast } = useToast();
    const {
        clearCart,
        calculateTotalPrice,
        cart,
        cartSet,
        addToCart,
        addToCartSet,
        minusFromCart,
        minusFromCartSet,
        removeFromCart,
        removeFromCartSet,
        cartCount
    } = useQr();
    const [expandedSetId, setExpandedSetId] = useState(null);
    const [isCreate, setIsCreate] = useState(false);
    const [order, setOrder] = useState(null);

    const toggleSetDetails = (setId) => {
        setExpandedSetId(prevId => (prevId === setId ? null : setId));
    };

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`/api/table/${tableId}`);
                setIsCreate(response.data.status === 'available');
                if (response.data.status !== 'available') {
                    setOrder(response.data.order);
                }
            } catch (error) {
                console.error(error);
                toast({
                    variant: 'destructive',
                    title: 'Error fetching order',
                    description: 'Please try again later',
                });
            }
        };
        fetchOrder();
    }, [tableId, toast]);

    const handleSubmit = async () => {
        const orderData = {
            items: cart,
            itemsSet: cartSet,
            totalPrice: calculateTotalPrice(),
            status: 'InQueue',
            source_id: 2,
            table_id: tableId
        };

        try {
            await axios.post('/api/order/dineIn', orderData);
            toast({
                variant: 'success',
                title: 'Order Placed',
                description: 'Your order has been placed successfully',
            });
            clearCart();
            setPage('order');
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Error Placing Order',
                description: 'Failed to place order',
            });
        }
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`/api/order/orderTable/${order.orderId}`, {
                menu: [...cart],
                menuSet: [...cartSet],
                order: order,
                status: 'InQueue',
                totalPrice: calculateTotalPrice(),
                newItemCount: cartCount()
            });
            clearCart();
            toast({
                variant: "success",
                title: "Success",
                description: "Order updated successfully"
            });
            setPage('order');
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Error Updating Order',
                description: 'Failed to update order',
            });
        }
    };

    if (cartCount() === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl font-semibold mb-4">Your cart is empty</h1>
                <Button onClick={() => setPage('menu')}>Back to Menu</Button>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 mt-20 pb-20">
            <header className="bg-white shadow-md p-4 flex items-center justify-between sticky top-0 z-10">
                <Button variant="ghost" onClick={() => setPage('menu')}>
                    <ChevronLeft className="mr-2" /> Back to Menu
                </Button>
                <h1 className="text-xl font-semibold">Your Cart</h1>
            </header>

            <ScrollArea className="h-[calc(100vh-180px)] p-4">
                <AnimatePresence>
                    {cart.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <MenuItemCard
                                item={item}
                                isSet={false}
                                onAdd={addToCart}
                                onMinus={minusFromCart}
                                onRemove={removeFromCart}
                            />
                        </motion.div>
                    ))}

                    {cartSet.map((set) => (
                        <motion.div
                            key={set.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <MenuItemCard
                                item={set}
                                isSet={true}
                                onAdd={addToCartSet}
                                onMinus={minusFromCartSet}
                                onRemove={removeFromCartSet}
                                onToggleDetails={toggleSetDetails}
                            />
                            <AnimatePresence>
                                {expandedSetId === set.id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-gray-50 p-4 rounded-md mb-4"
                                    >
                                        <h3 className="font-semibold mb-2">Set Contents:</h3>
                                        <ul>
                                            {set.menusetdetail.map((item) => (
                                                <li key={item.menu.id} className="flex justify-between items-center mb-2">
                                                    <span>{item.menu.name}</span>
                                                    <span>x{item.quantity}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </ScrollArea>

            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-4">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-xl font-bold">RM {calculateTotalPrice().toFixed(2)}</span>
                </div>
                <Button
                    className="w-full"
                    size="lg"
                    onClick={isCreate ? handleSubmit : handleUpdate}
                >
                    {isCreate ? "Place Order" : "Update Order"}
                </Button>
            </div>
        </div>
    );
}