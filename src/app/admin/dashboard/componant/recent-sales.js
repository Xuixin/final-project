"use client"
//import ui
import { Avatar, AvatarFallback, AvatarImage, } from "@/components/ui/avatar"
//import next
import axios from "axios"
import { useState, useEffect } from 'react'

export function RecentSales() {
    const [order, setOrder] = useState([])

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get('/api/order/recent')
                setOrder(response.data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchOrder()
    }, []);

    return (
        <div className="space-y-8">
            {order ? (
                order.map((od) => {
                    return (
                        <div className="flex items-center">
                            <Avatar className="h-9 w-9">
                                <AvatarFallback className="text-sm font-semibold">
                                    {od.orderSource.id == 1 ? 'OL' : 'DI'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    {od.customer ? od.customer.name + " " + od.customer.lastname : 'Dine-in'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {od.quantity} item
                                </p>
                            </div>
                            <div className="ml-auto font-medium">RM {od.totalPrice.toFixed(2)}</div>
                        </div>
                    )
                })
            ) : (
                // Loading state here
                <div className="flex items-center justify-center h-12">
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )}
        </div>
    )
}
