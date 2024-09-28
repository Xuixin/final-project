"use client"
// IMPORT UI
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { format } from 'date-fns'

// IMPORT NEXT
import { useState } from 'react';

export function OrderTable({ orders, onSelectOrder }) {
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const handleRowClick = (order) => {
        setSelectedOrderId(order.id);
        onSelectOrder(order, order.orderSource.source_name);
    }

    const orderBg = (status) => {
        switch (status) {
            case 'InQueue':
                return 'outline';
            case 'InProgress':
                return 'warning';
            case 'Finished':
                return 'success';
            case 'Cancelled':
                return 'destructive';
            default:
                return 'neutral'; // Default variant
        }
    }
    const paymentBg = (status) => {
        switch (status) {
            case 'InComplete':
                return 'warning';
            case 'Completed':
                return 'success';
            case 'Refunded':
                return 'destructive';
            default:
                return 'neutral'; // Default variant
        }
    }
    const shippingBg = (status) => {
        switch (status) {
            case 'Pending':
                return 'warning';
            case 'Shipped':
                return 'success';
            case 'Delivered':
                return 'destructive';
            case 'Cancelled':
                return 'destructive';
            default:
                return 'neutral'; // Default variant
        }
    }

    return (
        <Card>
            <CardHeader className="px-7">
                <CardTitle>Orders</CardTitle>
                <CardDescription>Recent orders from your store.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order</TableHead>
                            <TableHead className="hidden sm:table-cell">Type</TableHead>
                            <TableHead className="hidden sm:table-cell">Status</TableHead>
                            <TableHead className="hidden md:table-cell">Payment status</TableHead>
                            <TableHead className="hidden sm:table-cell">Shipping Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>

                        {orders.map((order) => {
                            return (
                                <TableRow key={order.id} className={`${order.id === selectedOrderId && 'bg-accent'}`} onClick={() => handleRowClick(order)}>
                                    <TableCell>
                                        <div className="font-medium">{order.id}</div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">{order.orderSource.source_name}</TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <Badge className="text-xs" variant={orderBg(order.status)}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    {order.payment?.status ? (
                                        <TableCell className="hidden md:table-cell">
                                            <Badge className="text-xs" variant={paymentBg(order.payment.status)}>
                                                {order.payment.status}
                                            </Badge>
                                        </TableCell>
                                    ) : (
                                        <TableCell className="hidden md:table-cell">
                                            <Badge className="text-xs" variant={'warning'}>
                                                InComplete
                                            </Badge>
                                        </TableCell>
                                    )}
                                    {order.orderSource.id !== 1 ? (
                                        <TableCell >
                                            <Badge className="text-xs" variant={'destructive'}>
                                                not online
                                            </Badge>
                                        </TableCell>

                                    ) : (

                                        <TableCell className="hidden sm:table-cell">
                                            <Badge className="text-xs" variant={shippingBg(order.shipping?.status)}>
                                                {order.shipping?.status ? order.shipping?.status : ''}
                                            </Badge>
                                        </TableCell>
                                    )}

                                    <TableCell className="text-right">RM {order.totalPrice.toFixed(2)}</TableCell>
                                </TableRow>
                            )
                        })}

                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
