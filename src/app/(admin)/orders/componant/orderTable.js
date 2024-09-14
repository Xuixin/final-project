import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from 'date-fns'

export const OrderTable = ({ orders, onSelectOrder }) => {
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const handleRowClick = (order) => {
        setSelectedOrderId(order.id);
        onSelectOrder(order);
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map(order => (
                    <TableRow
                        key={order.id}
                        onClick={() => handleRowClick(order)}
                        className={order.id === selectedOrderId ? "bg-accent" : ""}
                    >
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{format(new Date(order.createdAt), 'yyyy-MM-dd')}</TableCell>
                        <TableCell>{order.status}</TableCell>
                        <TableCell>${order.total}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}


