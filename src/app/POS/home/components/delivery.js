'use client'

import { useState, useEffect } from "react"
import { Loader2, PackageOpen, Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const OrderRow = ({ order, renderButton, onCheckboxChange, isSelected }) => (
    <TableRow key={order.id} className="hover:bg-muted/50 transition-colors">
        <TableCell>
            {order.status === 'Finished' && (
                <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onCheckboxChange(order.id)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
            )}
        </TableCell>
        <TableCell >#{order.id}</TableCell>
        <TableCell>{order.customer.email}</TableCell>
        <TableCell className="text-center">{order.quantity}</TableCell>
        <TableCell>{renderButton(order.status)}</TableCell>
    </TableRow>
)

export function Delivery() {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmit, setIsSubmit] = useState(false)
    const [orders, setOrder] = useState([])
    const [selectedOrders, setSelectedOrders] = useState([])
    const [shippers, setShippers] = useState([])
    const [selectedShipper, setSelectedShipper] = useState(null)
    const [dialogOpen, setDialogOpen] = useState(false)

    const fetchDeliveryOrder = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get('/api/order/online')
            setOrder(response.data)
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to load orders',
            })
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchShippers = async () => {
        try {
            const response = await axios.get('/api/employee/shipper')
            setShippers(response.data)
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to fetch shippers',
            })
            console.error(error)
        }
    }

    useEffect(() => {
        fetchDeliveryOrder()
        fetchShippers()
    }, [])

    const handleCheckboxChange = (orderId) => {
        setSelectedOrders(prev =>
            prev.includes(orderId)
                ? prev.filter(id => id !== orderId)
                : [...prev, orderId]
        )
    }

    const handleSelectAll = (checked) => {
        const allFinishedOrders = orders.filter(order => order.status === 'Finished').map(order => order.id)
        setSelectedOrders(checked ? allFinishedOrders : [])
    }

    const handleSubmit = async () => {
        setIsSubmit(true)
        try {
            const promises = selectedOrders.map(orderId =>
                axios.put(`/api/shipping/${orderId}`, { status: 'Shipped', employeeId: selectedShipper })
            )

            await Promise.all(promises)
            toast({
                title: "Success",
                description: "Orders updated successfully!",
                duration: 3000,
            })
            setSelectedOrders([])
            setDialogOpen(false)
            fetchDeliveryOrder()
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Error",
                description: 'Failed to update orders',
                duration: 3000,
            })
            console.error(error)
        } finally {
            setIsSubmit(false)
        }
    }

    const renderButton = (status) => {
        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status === 'Finished'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
                }`}>
                {status === 'Finished' ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                {status}
            </span>
        )
    }

    return (
        <Card className="min-h-[24rem] shadow-lg">
            <CardHeader className="bg-primary text-primary-foreground">
                <CardTitle className="flex items-center space-x-2">
                    <PackageOpen className="w-6 h-6" />
                    <span>Delivery Management</span>
                </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="p-6">
                {isLoading ? (
                    <div className="flex w-full justify-center items-center min-h-[18rem]">
                        <div className="items-center flex flex-col">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <h1 className="text-gray-500 mt-2">Loading orders...</h1>
                        </div>
                    </div>
                ) : (
                    <ScrollArea className="h-[18rem] w-full rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">
                                        <Checkbox
                                            checked={selectedOrders.length === orders.filter(order => order.status === 'Finished').length}
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead className="text-center">Quantity</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
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
            <CardFooter className="flex justify-end space-x-2">
                <Button
                    onClick={() => setDialogOpen(true)}
                    disabled={selectedOrders.length === 0}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                    Assign Shipper
                </Button>
            </CardFooter>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Select Shipper</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <RadioGroup onValueChange={setSelectedShipper} value={selectedShipper}>
                            {shippers.map((shipper) => (
                                <div className="flex items-center space-x-2" key={shipper.id}>
                                    <RadioGroupItem value={shipper.id} id={`shipper-${shipper.id}`} />
                                    <Label htmlFor={`shipper-${shipper.id}`}>{shipper.name}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSubmit} disabled={!selectedShipper || isSubmit}>
                            {isSubmit ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Confirm Assignment'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    )
}