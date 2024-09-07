"use client"
import { useToast } from "@/components/ui/use-toast"
import { useState, useEffect } from "react"
import { useAppContext } from "@/app/Context/AppContext"
import axios from "axios"

//ui
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"

//componant
import { OrderDetails } from "@/components/menuComponant/ordereDetails"


export default function OrderPage() {
    const { toast } = useToast()
    const [order, setOrder] = useState()
    const { user } = useAppContext()

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`/api/order/online/${user.id}`)
                setOrder(response.data)
                console.log(response.data);
            } catch (error) {
                console.log("Fail to fetch order: ", error)
            }
        }
        fetchOrder()
    }, [user]);

    return (
        <section>

            <h1 className="font-semibold text-2xl mb-5">my order</h1>
            <div className="w-full min-h-10  px-6">
                {order && order.map((item) => {
                    return (
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className="w-full px-12 rounded-xl bg-white cursor-pointer py-2 mb-3">
                                    <div className="grid grid-cols-3 py-5">
                                        <a variant="outline" className="cursor-pointer hover:underline">OL{item.orderId}</a>
                                        <h1 className="text-md font-medium text-end">{item.status}</h1>
                                        <p className="text-end text-sm font-light "> RM {item.totalPrice.toFixed(2)}</p>
                                    </div>
                                </div>
                            </DialogTrigger>
                            <OrderDetails order={item} />
                        </Dialog>
                    )
                })}

            </div>
        </section>
    )
}