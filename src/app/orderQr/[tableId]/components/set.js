"use client"
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame, Package, Percent } from 'lucide-react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useQr } from '../../qrContext'

export const SetMenuCom = () => {
    const [menuSet, setMenuSet] = useState([])
    const { addToCartSet } = useQr()

    useEffect(() => {
        const fetchMenuSet = async () => {
            try {
                const response = await axios.get('/api/menuset')
                setMenuSet(response.data)
            } catch (error) {
                console.error('Error fetching menu set:', error)
            }
        }
        fetchMenuSet()
    }, [])

    // Calculate savings percentage
    const calculateSavings = (setPrice, originalTotal) => {
        const savings = ((originalTotal - setPrice) / originalTotal) * 100
        return Math.round(savings)
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
            >
                <div className="flex items-center justify-center gap-3 mb-8">
                    <Package className="w-8 h-8 text-primary" />
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
                        Value Set Menu
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuSet && menuSet.map((item) => {
                        const originalTotal = item.details.reduce(
                            (total, m) => total + (m.menu.price * m.quantity),
                            0
                        )
                        const savingsPercentage = calculateSavings(item.price, originalTotal)

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-4">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-2">
                                                <CardTitle className="text-xl font-bold">
                                                    {item.name}
                                                </CardTitle>
                                                <div className="flex gap-2">
                                                    <Badge variant="secondary" className="flex items-center gap-1">
                                                        <Percent className="w-3 h-3" />
                                                        Save {savingsPercentage}%
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm text-muted-foreground line-through">
                                                    RM {originalTotal.toFixed(2)}
                                                </div>
                                                <div className="text-lg font-bold text-primary">
                                                    RM {item.price.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-0">
                                        <ScrollArea className="h-[280px] w-full">
                                            <div className="space-y-2 p-4">
                                                {item.details.map((menu, index) => (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                                                    >
                                                        <div className="relative h-16 w-16 flex-shrink-0">
                                                            <Image
                                                                src={menu.menu.img}
                                                                alt={menu.menu.name}
                                                                fill
                                                                className="rounded-lg object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h6 className="font-medium text-sm md:text-base truncate">
                                                                {menu.menu.name}
                                                            </h6>
                                                            <div className="flex justify-between items-center mt-1 text-sm text-muted-foreground">
                                                                <span>{menu.quantity}x</span>
                                                                <span>RM {(menu.quantity * menu.menu.price).toFixed(2)}</span>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                        <div className="p-4 bg-secondary/30">
                                            <Button
                                                className="w-full"
                                                onClick={() => addToCartSet(item)}
                                                variant="default"
                                            >
                                                Add Set to Cart
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )
                    })}
                </div>

                {menuSet.length === 0 && (
                    <div className="text-center py-12">
                        <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No Set Menus Available</h3>
                        <p className="text-muted-foreground">Check back later for new set menu options</p>
                    </div>
                )}
            </motion.div>
        </div>
    )
}