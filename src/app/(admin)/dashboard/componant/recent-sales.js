'use client'

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, ShoppingCart, UtensilsCrossed, Truck } from 'lucide-react'
import axios from "axios"
import { useState, useEffect } from 'react'

export function RecentSales() {
    const [order, setOrder] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get('/api/order/recent')
                setOrder(response.data)
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchOrder()
    }, [])

    const getOrderTypeDetails = (type) => {
        switch (type) {
            case 'delivery':
                return {
                    icon: <Truck className="w-4 h-4" />,
                    abbr: 'OL',
                    color: 'bg-blue-100 text-blue-600'
                }
            case 'takeaway':
                return {
                    icon: <ShoppingCart className="w-4 h-4" />,
                    abbr: 'TA',
                    color: 'bg-orange-100 text-orange-600'
                }
            case 'dine-in':
                return {
                    icon: <UtensilsCrossed className="w-4 h-4" />,
                    abbr: 'DI',
                    color: 'bg-green-100 text-green-600'
                }
            default:
                return {
                    icon: <UtensilsCrossed className="w-4 h-4" />,
                    abbr: 'DI',
                    color: 'bg-gray-100 text-gray-600'
                }
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-48">
                <div className="flex flex-col items-center space-y-2">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    <p className="text-sm text-gray-500">Loading orders...</p>
                </div>
            </div>
        )
    }

    if (!order || order.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-48 space-y-2">
                <ShoppingCart className="w-8 h-8 text-gray-400" />
                <p className="text-sm text-gray-500">No recent orders found</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {order.map((od) => {
                const orderType = getOrderTypeDetails(od.orderSource.source_name)
                return (
                    <div
                        key={od.id}
                        className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                    >
                        <Avatar className={`h-10 w-10 ${orderType.color}`}>
                            <AvatarFallback className="text-sm font-semibold flex items-center justify-center">
                                {orderType.icon}
                            </AvatarFallback>
                        </Avatar>
                        <div className="ml-4 flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {od.customer
                                    ? `${od.customer.name} ${od.customer.lastname}`
                                    : od.orderSource.source_name === 'dine-in'
                                        ? 'Dine-In'
                                        : 'TakeAway'
                                }
                            </p>
                            <div className="flex items-center space-x-2">
                                <p className="text-sm text-gray-500">
                                    {od.quantity} {od.quantity > 1 ? 'items' : 'item'}
                                </p>
                                <span className="text-gray-300">•</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${orderType.color}`}>
                                    {orderType.abbr}
                                </span>
                            </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                            <span className="text-sm font-medium text-gray-900">
                                RM {od.totalPrice.toFixed(2)}
                            </span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}