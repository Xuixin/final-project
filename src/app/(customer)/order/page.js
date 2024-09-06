"use client"
import { useToast } from "@/components/ui/use-toast"
import { useState, useEffect } from "react"
import { useAppContext } from "@/app/Context/AppContext"
import axios from "axios"
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

    useEffect(() => {
        if (order) {
            console.log(order)
        }
    }, [order])


    return (
        <>
            <h1 className="font-semibold text-xl">my order</h1>
            <div className="w-full min-h-10 -lg px-6">
                <div className="w-full bg-white rounded px-12 py-2 mb-3">
                    <div className="grid grid-cols-2 py-5">
                        <h1 className="text-md font-medium text-start">1</h1>
                        <h1 className="text-md font-medium text-end">สถานะ</h1>
                    </div>
                    <div className="grid grid-cols-2 py-2 max-h-7 w-[50%]">
                        <p className="text-sm font-thin">menuname</p>
                        <p className="text-end text-sm font-thin text-gray-400">X 1</p>
                    </div>
                    <div className="w-full">
                        <p className="text-end text-sm font-light ">total menu 5 : RM 40.50</p>
                    </div>
                </div>

            </div>
        </>
    )
}