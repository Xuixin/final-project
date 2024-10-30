'use clent'
// import Next
import { useState, useEffect } from "react"

// import ui
import { Loader2, PackageOpen, PartyPopper, X, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


const OrderRow = ({ order, renderButton }) => (
    <TableRow key={order.id} >
        <TableCell>#{order.id}</TableCell>
        <TableCell className="text-center">{order.quantity}</TableCell>
        <TableCell className='text-center'>{renderButton(order.status, order)}</TableCell>
        <Separator />
    </TableRow >
);

export function TakeAway({ pay, order }) {
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

    const renderButton = (status, od) => {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger> <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status === 'Finished'
                            ? 'bg-green-100 text-green-800 cursor-pointer'
                            : 'bg-gray-100 text-gray-800'
                            }`}
                        onClick={status === 'Finished' ? () => {
                            pay(od);
                            order(null);
                        } : undefined}


                    >
                        {status === 'Finished' ? (
                            <Check className="w-3 h-3 mr-1" />
                        ) : (
                            <X className="w-3 h-3 mr-1" />
                        )}
                        {status}
                    </span></TooltipTrigger>
                    <TooltipContent>
                        <p>Click to pay</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

        )
    }


    return (
        <Card className='min-h-96 shadow-md'>
            <CardHeader className="bg-primary text-primary-foreground">
                <CardTitle>Takeaway</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className='p-6'>
                {isLoading ? (
                    <div className="flex w-full justify-center items-center min-h-[18rem]">
                        <div className='items-center flex flex-col'>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            <h1 className='text-gray-500'>loading</h1>
                        </div>
                    </div>
                ) : (
                    <ScrollArea className='h-[18rem] w-full rounded-md border'>
                        <Table >
                            <TableHeader >
                                <TableRow>
                                    <TableHead >#ID</TableHead>
                                    <TableHead className='text-center'>Quantity</TableHead>
                                    <TableHead className="text-center">State</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ordersTakeAway.map((od) => (
                                    <OrderRow
                                        key={od.id}
                                        order={od}
                                        renderButton={renderButton}
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