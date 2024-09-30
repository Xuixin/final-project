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

    const typeOrder = (type) => {
        switch (type) {
            case 'delivery':
                return 'OL'
            case 'takeaway':
                return 'TA'
            case 'dine-in':
                return 'DI'
            default:
                return 'Dine-in'
        }
    }



    return (
        <div className="space-y-8">
            {order ? (
                order.map((od) => {
                    return (
                        <div className="flex items-center" key={od.id}>
                            <Avatar className="h-9 w-9">
                                <AvatarFallback className="text-sm font-semibold">
                                    {typeOrder(od.orderSource.source_name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    {od.customer ? od.customer.name + " " + od.customer.lastname : od.orderSource.source_name === 'dine-in' ? 'Dine-In' : 'TakeAway'}
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
