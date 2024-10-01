'use client'

//import ui
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag } from 'lucide-react'

//import componant
import { Overview } from './componant/overview'
import { RecentSales } from './componant/recent-sales'

//impoier next
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
        await axios.get('/api/dashboard/revenue')
            .then((response) => {
                if (response.data.percentageIncomeChange >= 0) {
                    setRevenue({
                        isProfit: true,
                        ...response.data
                    })
                } else {
                    setRevenue({
                        isProfit: false,
                        ...response.data
                    })
                }
            }).catch((error) => {
                console.error(error)
            })
    }

    const fetchNewOrder = async () => {
        await axios.get('/api/customer/new')
            .then((response) => {
                setNewCustomer({
                    currentMonthNewCustomers: response.data.currentMonthNewCustomers,
                    lastMonthNewCustomers: response.data.lastMonthNewCustomers,
                    percentageChange: response.data.percentageChange
                })
            }).catch((error) => {
                console.error(error)
            })
    }

    useEffect(() => {
        fetchRevenue()
        fetchNewOrder()
    }, []);



    return (
        <>
            <div className="flex-1 space-y-4">
                <div className="flex items-center justify-start space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                </div>
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="analytics" >
                            Analytics
                        </TabsTrigger>
                        <TabsTrigger value="reports" >
                            Reports
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {/* Total */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Total Revenue
                                    </CardTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4 text-muted-foreground"
                                    >
                                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold"> RM {revenue.income.toFixed(2)}</div>
                                    <p className={`text-xs text-muted-foreground ${revenue.isProfit ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                                        {!revenue.isProfit ? `${revenue.percentageIncomeChange}% from last month` : `+ ${revenue.percentageIncomeChange}% from last month`}
                                    </p>
                                </CardContent>
                            </Card>
                            {/* Seles */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Order
                                    </CardTitle>
                                    <ShoppingBag />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{revenue.orderCount} </div>
                                    <p className={`text-xs text-muted-foreground ${revenue.percentageOrderChange >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                                        {revenue.percentageOrderChange < 0 ? `${revenue.percentageOrderChange}% from last month` : `+ ${revenue.percentageOrderChange}% from last month`}
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Sales</CardTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4 text-muted-foreground"
                                    >
                                        <rect width="20" height="14" x="2" y="5" rx="2" />
                                        <path d="M2 10h20" />
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">+12,234</div>
                                    <p className="text-xs text-muted-foreground">
                                        +19% from last month
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        New Customer
                                    </CardTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4 text-muted-foreground"
                                    >
                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{newCustomer.currentMonthNewCustomers}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {newCustomer.percentageChange >= 0 ? (
                                            `+ ${newCustomer.percentageChange} ( ${newCustomer.lastMonthNewCustomers} )`
                                        ) : (
                                            `${newCustomer.percentageChange} ( ${newCustomer.lastMonthNewCustomers} )`
                                        )}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                            <Card className="col-span-4">
                                <CardHeader>
                                    <CardTitle>Overview</CardTitle>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <Overview />
                                </CardContent>
                            </Card>
                            <Card className="col-span-3">
                                <CardHeader>
                                    <CardTitle>Recent Sales</CardTitle>
                                    <CardDescription>
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

        </>
    )
}
