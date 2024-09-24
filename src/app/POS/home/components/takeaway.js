'use clent'
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const OrderRow = ({ order, renderButton, }) => (
    <TableRow key={order.id} >
        <TableCell>#{order.id}</TableCell>
        <TableCell>{order.quantity}</TableCell>
        <TableCell className='text-center'>{renderButton}</TableCell>
        <Separator />
    </TableRow >
);

export function TakeAway() {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [ordersTakeAway, setOrderTakeAway] = useState([])

    const fetchTakeAwayOrder = async () => {
        try {
            setIsLoading(true)
            const response = await axios.get('/api/order/takeaway')
            setOrderTakeAway(response.data)
            setIsLoading(false)
        } catch (error) {
            toast.error("Error fetching takeaway orders")
            console.error(error)
            setIsLoading(false)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchTakeAwayOrder()
    }, [])


    return (
        <Card className='min-h-96 shadow-md'>
            <CardHeader>
                <CardTitle>Takeaway</CardTitle>
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
                            <TableHeader className='bg-primary rounded-lg'>
                                <TableHead className='text-white'>#ID</TableHead>
                                <TableHead className='text-white'>Quantity</TableHead>
                                <TableHead className='text-white text-center'>State</TableHead>
                            </TableHeader>
                            <TableBody>
                                {ordersTakeAway.map((od) => (
                                    <OrderRow
                                        key={od.id}
                                        order={od}
                                        renderButton={od.status === 'Finished' ? (
                                            <Button variant='success' disabled>
                                                Pay
                                            </Button>
                                        ) : (
                                            <Button variant='secondary'>
                                                {od.status}
                                            </Button>
                                        )}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    );
};