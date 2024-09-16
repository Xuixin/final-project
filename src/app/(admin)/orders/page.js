'use client'

// Import UI components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ListFilter } from "lucide-react"
import { useState, useEffect } from 'react'
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"
import { Details_order } from "./componant/details"
import { OrderTable } from './componant/orderTable'

export default function MenuAdmin() {
    const { toast } = useToast()
    const [trigger, setTrigger] = useState('week')
    const [orders, setOrders] = useState([])
    const [selectedOrder, setSelectedOrder] = useState(null)

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/api/order/all')
            setOrders(response.data)
        } catch (error) {
            toast({ variant: 'error', title: 'Failed to fetch orders', description: error.message })
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [trigger])

    const filterByDateRange = (orders, startDate, endDate) => {
        return orders.filter(order => {
            const orderDate = new Date(order.createdAt)
            return orderDate >= startDate && orderDate <= endDate
        })
    }

    // Functions to filter orders
    const filterByWeek = (orders) => {
        const now = new Date();
        // คำนวณวันเริ่มต้นของช่วงเวลา 7 วันก่อน
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - 6); // วันที่ 7 วันก่อน

        // วันที่สิ้นสุดของช่วงเวลา (วันนี้)
        const endOfWeek = new Date(now);

        return filterByDateRange(orders, startOfWeek, endOfWeek);
    }



    const filterByMonth = (orders) => {
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1) // First day of this month
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0) // Last day of this month
        return filterByDateRange(orders, startOfMonth, endOfMonth)
    }

    const filterByYear = (orders) => {
        const now = new Date()
        const startOfYear = new Date(now.getFullYear(), 0, 1) // First day of this year
        const endOfYear = new Date(now.getFullYear(), 11, 31) // Last day of this year
        return filterByDateRange(orders, startOfYear, endOfYear)
    }


    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                <Tabs defaultValue={trigger}>
                    <div className="flex items-center">
                        <TabsList>
                            <TabsTrigger value="week">Week</TabsTrigger>
                            <TabsTrigger value="month">Month</TabsTrigger>
                            <TabsTrigger value="year">Year</TabsTrigger>
                        </TabsList>
                        {/* <div className="ml-auto flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 gap-1 text-sm"
                                    >
                                        <ListFilter className="h-3.5 w-3.5" />
                                        <span className="sr-only sm:not-sr-only">Filter</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuCheckboxItem checked>
                                        Fulfilled
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem>
                                        Declined
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem>
                                        Refunded
                                    </DropdownMenuCheckboxItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div> */}
                    </div>
                    <TabsContent value="week">
                        <OrderTable orders={filterByWeek(orders)} onSelectOrder={setSelectedOrder} />
                    </TabsContent>
                    <TabsContent value="month">
                        <OrderTable orders={filterByMonth(orders)} onSelectOrder={setSelectedOrder} />
                    </TabsContent>
                    <TabsContent value="year">
                        <OrderTable orders={filterByYear(orders)} onSelectOrder={setSelectedOrder} />
                    </TabsContent>
                </Tabs>
            </div>
            <div>
                {selectedOrder && <Details_order order={selectedOrder} />}
            </div>
        </main>
    )
}
