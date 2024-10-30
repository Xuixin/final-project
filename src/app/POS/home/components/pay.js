'use client'

import { fetchAdminInfo } from "@/lib/adminInfo"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axios from 'axios'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { CircleAlert, Banknote, QrCode, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

const PaymentMethodButton = ({
    selected,
    onClick,
    icon: Icon,
    label
}) => (
    <motion.button
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", damping: 15 }}
        onClick={onClick}
        className={`
      rounded-lg flex items-center gap-2 font-medium px-4 py-3
      transition-all duration-200 ease-in-out
      ${selected
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'border border-primary/20 text-primary hover:bg-primary/10'
            }
    `}
    >
        <Icon className="w-4 h-4" />
        <span>{label}</span>
    </motion.button>
)

const MenuItem = ({ img, name, price, quantity }) => (
    <motion.li
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex items-center bg-card rounded-lg p-3 border shadow-sm"
    >
        <div className="h-14 w-14 rounded-md overflow-hidden mr-3 bg-muted">
            <img
                src={img}
                alt={name}
                className="w-full h-full object-cover"
            />
        </div>
        <div className="flex-grow">
            <h3 className="font-medium text-foreground">{name}</h3>
            <p className="text-sm text-muted-foreground">
                RM {(price * quantity).toFixed(2)}
            </p>
        </div>
        <div className="text-end flex flex-col items-center">
            <span className="text-xs text-muted-foreground">QTY</span>
            <span className="font-semibold">{quantity}</span>
        </div>
    </motion.li>
)

export function Pay({ order, setOrder, setQueue, fetchAllTable }) {
    const { toast } = useToast()
    const [openSets, setOpenSets] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [orders, setOrders] = useState([])
    const [isHydrated, setIsHydrated] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState('Cash')
    const [emp, setEmp] = useState(null)

    useEffect(() => {
        setIsHydrated(true)
        const fetchAdmin = async () => {
            const data = await fetchAdminInfo()
            setEmp(data)
        }
        fetchAdmin()
        setOrders(order)
    }, [order])

    if (!isHydrated) return null

    const handlePay = async () => {
        setIsLoading(true)
        try {
            await axios.post(`/api/payment/${order.orderId}`, {
                order,
                paymentMethod,
                emp: emp?.id
            })

            toast({
                variant: 'default',
                title: 'Payment Successful',
                description: 'Thank you for your payment.',
            })

            setOrder(null)
            setQueue(null)
            fetchAllTable()
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Payment Failed',
                description: error.message
            })
        } finally {
            setPaymentMethod('Cash')
            setIsLoading(false)
        }
    }

    const toggleSetMenu = (index) => {
        setOpenSets(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
                type: "spring",
                damping: 20,
                stiffness: 300
            }}
            className="w-full max-w-md mx-auto"
        >
            <Card className="overflow-hidden border-2">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-xl font-semibold">
                                Bill Details
                            </CardTitle>
                            <CardDescription>
                                {order.source === 3 ? (
                                    <Badge variant="destructive">Takeaway</Badge>
                                ) : (
                                    <Badge variant="default">Table {order.table_NO}</Badge>
                                )}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="flex gap-3">
                        <PaymentMethodButton
                            selected={paymentMethod === 'Cash'}
                            onClick={() => setPaymentMethod('Cash')}
                            icon={Banknote}
                            label="Cash"
                        />
                        <PaymentMethodButton
                            selected={paymentMethod === 'QRCode'}
                            onClick={() => setPaymentMethod('QRCode')}
                            icon={QrCode}
                            label="QR Code"
                        />
                    </div>

                    <ScrollArea className="h-[320px] rounded-md border p-4">
                        <div className="space-y-4">
                            {orders.normalMenu.map((menu) => (
                                <MenuItem key={menu.id} {...menu} />
                            ))}

                            {orders.setMenu.map((set, index) => (
                                <div key={set.id} className="space-y-2">
                                    <div
                                        onClick={() => toggleSetMenu(index)}
                                        className="flex justify-between items-center cursor-pointer p-2 hover:bg-accent rounded-md"
                                    >
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-medium">SET {index + 1}</h3>
                                            <ChevronDown
                                                className={`w-4 h-4 transition-transform duration-200 ${openSets.includes(index) ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </div>
                                        <span className="font-medium">
                                            RM {set.setPrice.toFixed(2)}
                                        </span>
                                    </div>

                                    <AnimatePresence>
                                        {openSets.includes(index) && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="pl-4 space-y-2"
                                            >
                                                {set.details.map((menu) => (
                                                    <MenuItem key={menu.id} {...menu} />
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>

                    <div>
                        <Separator className="my-4" />
                        <div className="flex justify-between items-center py-2">
                            <span className="text-lg font-semibold">Total Amount</span>
                            <span className="text-xl font-bold">
                                RM {orders.totalPrice.toFixed(2)}
                            </span>
                        </div>
                        <Separator className="my-4" />
                    </div>

                    <Button
                        className="w-full"
                        size="lg"
                        onClick={handlePay}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing Payment...' : 'Confirm Payment'}
                    </Button>
                </CardContent>

                <CardFooter className="bg-muted/50 p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CircleAlert className="w-4 h-4" />
                        <span>Payment is final and cannot be reversed</span>
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    )
}