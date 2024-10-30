// OrderTable.js
"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { useState } from 'react'

export function OrderTable({ orders, onSelectOrder }) {
    const [selectedOrderId, setSelectedOrderId] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(5)

    // Calculate pagination
    const totalPages = Math.ceil(orders.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    const currentOrders = orders.slice(startIndex, endIndex)

    const handleRowClick = (order) => {
        setSelectedOrderId(order.id)
        onSelectOrder(order, order.orderSource.source_name)
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
        setSelectedOrderId(null)
    }

    const handlePageSizeChange = (value) => {
        setPageSize(Number(value))
        setCurrentPage(1)
        setSelectedOrderId(null)
    }

    const orderBg = (status) => {
        switch (status) {
            case 'InQueue': return 'outline'
            case 'InProgress': return 'warning'
            case 'Finished': return 'success'
            case 'Cancelled': return 'destructive'
            default: return 'neutral'
        }
    }

    const paymentBg = (status) => {
        switch (status) {
            case 'InComplete': return 'warning'
            case 'Completed': return 'success'
            case 'Refunded': return 'destructive'
            default: return 'neutral'
        }
    }

    const shippingBg = (status) => {
        switch (status) {
            case 'Pending': return 'warning'
            case 'Shipped': return 'success'
            case 'Delivered': return 'destructive'
            case 'Cancelled': return 'destructive'
            default: return 'neutral'
        }
    }

    return (
        <Card className="w-full">
            <CardHeader className="px-7">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Orders</CardTitle>
                        <CardDescription>Recent orders from your store.</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Show:</span>
                        <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                            <SelectTrigger className="w-20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead>Order</TableHead>
                                <TableHead className="hidden sm:table-cell">Type</TableHead>
                                <TableHead className="hidden sm:table-cell">Status</TableHead>
                                <TableHead className="hidden md:table-cell">Payment status</TableHead>
                                <TableHead className="hidden sm:table-cell">Shipping Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentOrders.map((order) => (
                                <TableRow
                                    key={order.id}
                                    className={`
                                        cursor-pointer 
                                        transition-colors 
                                        hover:bg-muted/50 
                                        ${order.id === selectedOrderId ? 'bg-accent' : ''}
                                    `}
                                    onClick={() => handleRowClick(order)}
                                >
                                    <TableCell>
                                        <div className="font-medium">#{order.id}</div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">{order.orderSource.source_name}</TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <Badge className="text-xs" variant={orderBg(order.status)}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <Badge className="text-xs" variant={paymentBg(order.payment?.status || 'InComplete')}>
                                            {order.payment?.status || 'InComplete'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        {order.orderSource.id !== 1 ? (
                                            <Badge className="text-xs" variant="secondary">not online</Badge>
                                        ) : (
                                            <Badge className="text-xs" variant={shippingBg(order.shipping?.status)}>
                                                {order.shipping?.status || ''}
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        RM {order.totalPrice.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between px-6">
                <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1}-{Math.min(endIndex, orders.length)} of {orders.length} orders
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-sm font-medium">
                        Page {currentPage} of {totalPages}
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}