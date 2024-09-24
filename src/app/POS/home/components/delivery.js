'use client'
// import Next
import { useState, useEffect } from "react"

// import ui
import { Loader2, PackageOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// OrderRow component with checkbox
const OrderRow = ({ order, renderButton, onCheckboxChange, isSelected }) => (
    <TableRow key={order.id}>
        <TableCell>
            {order.status === 'Finished' && (
                <Checkbox checked={isSelected} onCheckedChange={() => onCheckboxChange(order.id)} />
            )}
        </TableCell>
        <TableCell>#{order.id}</TableCell>
        <TableCell>{order.customer.email}</TableCell>
        <TableCell className='text-center'>{order.quantity}</TableCell>
        <TableCell>{renderButton(order.status)}</TableCell>
    </TableRow>
);

export function Delivery() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);
    const [orders, setOrder] = useState([]);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [shippers, setShippers] = useState([]);
    const [selectedShipper, setSelectedShipper] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const fetchDeliveryOrder = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/order/online');
            setOrder(response.data);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'success',
                description: 'Failed to load orders',
            });
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchShippers = async () => {
        try {
            const response = await axios.get('/api/employee/shipper');
            setShippers(response.data);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                descriptionc: 'Failed to fetch shippers',
            });
            console.error(error);
        }
    };

    useEffect(() => {
        fetchDeliveryOrder();
        fetchShippers();
    }, []);

    // Handle checkbox selection
    const handleCheckboxChange = (orderId) => {
        setSelectedOrders(prev =>
            prev.includes(orderId)
                ? prev.filter(id => id !== orderId)
                : [...prev, orderId]
        );
    };

    // Handle select all
    const handleSelectAll = (checked) => {
        const allFinishedOrders = orders.filter(order => order.status === 'Finished').map(order => order.id);
        if (checked) {
            setSelectedOrders(allFinishedOrders); // Check all
        } else {
            setSelectedOrders([]); // Uncheck all
        }
    };

    // Handle submission
    const handleSubmit = async () => {
        setIsSubmit(true)
        try {
            const promises = selectedOrders.map(orderId =>
                axios.put(`/api/shipping/${orderId}`, { status: 'Shipped', employeeId: selectedShipper })
            );

            await Promise.all(promises); // Wait for all requests to finish
            toast({ variant: 'success', message: 'Orders updated successfully!' });
            setSelectedOrders([]); // Clear selection
            setDialogOpen(false);  // Close dialog after successful update
            fetchDeliveryOrder();  // Reload orders
        } catch (error) {
            toast({ variant: 'destructive', message: 'Failed to update orders' });
            console.error(error);
        } finally {
            setIsSubmit(false)
        }

    };

    const renderButton = (status) => {
        return (
            <span className={`status-label ${status === 'Finished' ? 'text-green-500' : 'text-gray-600'}`}>
                {status}
            </span>
        );
    };

    return (
        <Card className='min-h-96 shadow-md'>
            <CardHeader>
                <CardTitle>Delivery</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className='px-2'>
                {isLoading ? (
                    <div className="flex w-full justify-center items-center min-h-72">
                        <div className='items-center flex flex-col'>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            <h1 className='text-gray-500'>loading</h1>
                        </div>
                    </div>
                ) : (
                    <ScrollArea className='h-72 w-full shadow-inner mt-1'>
                        <Table>
                            <TableHeader className='bg-primary text-white'>
                                <TableHead>
                                    <Checkbox
                                        checked={selectedOrders.length === orders.filter(order => order.status === 'Finished').length}
                                        onCheckedChange={handleSelectAll}
                                    />
                                </TableHead>
                                <TableHead className='text-white'>#ID</TableHead>
                                <TableHead className='text-white'>Customer</TableHead>
                                <TableHead className='text-white'>Quantity</TableHead>
                                <TableHead className='text-white text-center'>State</TableHead>
                            </TableHeader>
                            <TableBody>
                                {orders.map((od) => (
                                    <OrderRow
                                        key={od.id}
                                        order={od}
                                        renderButton={renderButton}
                                        onCheckboxChange={handleCheckboxChange}
                                        isSelected={selectedOrders.includes(od.id)}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                )}
            </CardContent>
            <CardFooter className='flex justify-center items-center'>
                <Button onClick={() => setDialogOpen(true)} disabled={selectedOrders.length === 0}>
                    Submit
                </Button>
            </CardFooter>

            {/* Dialog for selecting shipper */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Select shipper</DialogTitle>
                    </DialogHeader>
                    {shippers.map((shipper) => (
                        <div key={shipper.id}>
                            <input
                                type="radio"
                                value={shipper.id}
                                checked={selectedShipper === shipper.id}
                                onChange={() => setSelectedShipper(shipper.id)}
                            />
                            {shipper.name}
                        </div>
                    ))}
                    <Button onClick={handleSubmit} disabled={!selectedShipper}>
                        {isSubmit ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating
                            </>
                        ) : (
                            'Submit'
                        )}
                    </Button>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
