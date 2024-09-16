
"use client"
//IMPORT UI
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
                            <TableHead className="hidden md:table-cell">Date</TableHead>
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
                                        <Badge className="text-xs" variant="outline">
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">{format(new Date(order.createdAt), 'yyyy-MM-dd')}</TableCell>
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

