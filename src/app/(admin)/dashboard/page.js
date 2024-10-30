'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag, TrendingUp, Users, DollarSign, Activity } from 'lucide-react'
import { Overview } from './componant/overview'
import { RecentSales } from './componant/recent-sales'
import { useEffect, useState } from 'react'
import axios from "axios"

export default function Dashboard() {
    const [revenue, setRevenue] = useState({
        isProfit: true,
        income: 0,
        percentageIncomeChange: 0,
        orderCount: 0,
        percentageOrderChange: 0,
    })

    const [newCustomer, setNewCustomer] = useState({
        currentMonthNewCustomers: 0,
        lastMonthNewCustomers: 0,
        percentageChange: ""
    })

    const fetchRevenue = async () => {
        try {
            const response = await axios.get('/api/dashboard/revenue')
            setRevenue({
                isProfit: response.data.percentageIncomeChange >= 0,
                ...response.data
            })
        } catch (error) {
            console.error(error)
        }
    }

    const fetchNewOrder = async () => {
        try {
            const response = await axios.get('/api/customer/new')
            setNewCustomer(response.data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchRevenue()
        fetchNewOrder()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50/50 p-8">
            <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h2>
                    <div className="flex items-center space-x-4">
                        <button className="px-4 py-2 bg-white text-gray-600 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                            <Activity className="w-4 h-4 inline-block mr-2" />
                            Refresh Data
                        </button>
                    </div>
                </div>

                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="bg-white p-1 rounded-lg shadow-sm">
                        <TabsTrigger value="overview" className="px-4 py-2">Overview</TabsTrigger>
                        <TabsTrigger value="analytics" className="px-4 py-2">Analytics</TabsTrigger>
                        <TabsTrigger value="reports" className="px-4 py-2">Reports</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {/* Revenue Card */}
                            <Card className="hover:shadow-lg transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-600">
                                        Total Revenue
                                    </CardTitle>
                                    <DollarSign className="h-4 w-4 text-gray-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-gray-900">
                                        RM {revenue.income.toFixed(2)}
                                    </div>
                                    <p className={`text-xs mt-1 ${revenue.isProfit ? 'text-emerald-500' : 'text-red-500'} flex items-center`}>
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        {!revenue.isProfit ?
                                            `${revenue.percentageIncomeChange}% from last month` :
                                            `+${revenue.percentageIncomeChange}% from last month`}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Orders Card */}
                            <Card className="hover:shadow-lg transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-600">
                                        Orders
                                    </CardTitle>
                                    <ShoppingBag className="h-4 w-4 text-gray-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {revenue.orderCount}
                                    </div>
                                    <p className={`text-xs mt-1 ${revenue.percentageOrderChange >= 0 ? 'text-emerald-500' : 'text-red-500'} flex items-center`}>
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        {revenue.percentageOrderChange < 0 ?
                                            `${revenue.percentageOrderChange}% from last month` :
                                            `+${revenue.percentageOrderChange}% from last month`}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Sales Card */}
                            <Card className="hover:shadow-lg transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-600">
                                        Sales
                                    </CardTitle>
                                    <TrendingUp className="h-4 w-4 text-gray-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-gray-900">+12,234</div>
                                    <p className="text-xs mt-1 text-emerald-500 flex items-center">
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        +19% from last month
                                    </p>
                                </CardContent>
                            </Card>

                            {/* New Customers Card */}
                            <Card className="hover:shadow-lg transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-600">
                                        New Customers
                                    </CardTitle>
                                    <Users className="h-4 w-4 text-gray-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {newCustomer.currentMonthNewCustomers}
                                    </div>
                                    <p className="text-xs mt-1 text-emerald-500 flex items-center">
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        {newCustomer.percentageChange >= 0 ?
                                            `+${newCustomer.percentageChange} (${newCustomer.lastMonthNewCustomers})` :
                                            `${newCustomer.percentageChange} (${newCustomer.lastMonthNewCustomers})`}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                            <Card className="col-span-4 hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="text-xl font-semibold text-gray-900">Revenue Overview</CardTitle>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <Overview />
                                </CardContent>
                            </Card>

                            <Card className="col-span-3 hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="text-xl font-semibold text-gray-900">Recent Sales</CardTitle>
                                    <CardDescription className="text-gray-500">
                                        You made 265 sales this month.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <RecentSales />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}