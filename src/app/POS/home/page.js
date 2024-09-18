'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button'
import { File } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react/cjs/react.production.min'

export default function PosPage() {
    const [selectedOrder, setSelectedOrder] = useState(null)
    return (
        <section className="grid flex-1 items-start gap-4 p-4 bg-primary-foreground h-screen sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
            <div className="grid auto-rows-max items-start pt-2 gap-4 md:gap-8 lg:col-span-2">
                <Tabs defaultValue="one">
                    <div className="flex items-center">
                        <TabsList>
                            <TabsTrigger value="one">POS</TabsTrigger>
                        </TabsList>
                        <div className="ml-auto flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="default"  // กำหนด variant ที่ต้องการ
                                className="h-10 gap-1 text-sm"
                            >
                                <span className="sr-only sm:not-sr-only">Inside</span>  {/* ข้อความในปุ่ม */}
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-10 gap-1 text-sm"
                            >
                                <span className="sr-only sm:not-sr-only">Outside</span>
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-10 gap-1 text-sm"
                            >
                                <span className="sr-only sm:not-sr-only">Takeaway</span>
                            </Button>
                        </div>

                    </div>
                    <TabsContent value="one">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, clipPath: "inset(10% 50% 90% 50% round 10px)" }}
                            animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0% round 0px)" }}
                            transition={{
                                type: "spring",
                                bounce: 0.3,
                                duration: 0.8,
                                delay: 0.5,
                            }}
                        >
                            <Card className="min-h-[70%]">
                                <CardContent>

                                    <div className="w-full grid grid-cols-5 p-5 gap-4">
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.3 }}
                                            className="relative h-24 w-full"
                                        >
                                            <Image
                                                src={'/uploads/0.png'}
                                                alt={'table'}
                                                layout='fill'
                                                objectFit='contain'
                                                className='rounded'
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-xl font-bold">T1</span>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.3 }}
                                            className="relative h-24 w-full"
                                        >
                                            <Image
                                                src={'/uploads/1.png'}
                                                alt={'table'}
                                                layout='fill'
                                                objectFit='contain'
                                                className='rounded'
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-xl font-bold">T2</span>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.3 }}
                                            className="relative h-24 w-full"
                                        >
                                            <Image
                                                src={'/uploads/0.png'}
                                                alt={'table'}
                                                layout='fill'
                                                objectFit='contain'
                                                className='rounded'
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-xl font-bold">T3</span>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.3 }}
                                            className="relative h-24 w-full"
                                        >
                                            <Image
                                                src={'/uploads/1.png'}
                                                alt={'table'}
                                                layout='fill'
                                                objectFit='contain'
                                                className='rounded'
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-xl font-bold">T4</span>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.3 }}
                                            className="relative h-24 w-full"
                                        >
                                            <Image
                                                src={'/uploads/0.png'}
                                                alt={'table'}
                                                layout='fill'
                                                objectFit='contain'
                                                className='rounded'
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-xl font-bold">T5</span>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.3 }}
                                            className="relative h-24 w-full"
                                        >
                                            <Image
                                                src={'/uploads/1.png'}
                                                alt={'table'}
                                                layout='fill'
                                                objectFit='contain'
                                                className='rounded'
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-xl font-bold">T6</span>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.3 }}
                                            className="relative h-24 w-full"
                                        >
                                            <Image
                                                src={'/uploads/0.png'}
                                                alt={'table'}
                                                layout='fill'
                                                objectFit='contain'
                                                className='rounded'
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-xl font-bold">T5</span>
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.3 }}
                                            className="relative h-24 w-full"
                                        >
                                            <Image
                                                src={'/uploads/0.png'}
                                                alt={'table'}
                                                layout='fill'
                                                objectFit='contain'
                                                className='rounded'
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-xl font-bold">T5</span>
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.3 }}
                                            className="relative h-24 w-full"
                                        >
                                            <Image
                                                src={'/uploads/0.png'}
                                                alt={'table'}
                                                layout='fill'
                                                objectFit='contain'
                                                className='rounded'
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-xl font-bold">T5</span>
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.3 }}
                                            className="relative h-24 w-full"
                                        >
                                            <Image
                                                src={'/uploads/0.png'}
                                                alt={'table'}
                                                layout='fill'
                                                objectFit='contain'
                                                className='rounded'
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-xl font-bold">T5</span>
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.3 }}
                                            className="relative h-24 w-full"
                                        >
                                            <Image
                                                src={'/uploads/0.png'}
                                                alt={'table'}
                                                layout='fill'
                                                objectFit='contain'
                                                className='rounded'
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-xl font-bold">T5</span>
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.3 }}
                                            className="relative h-24 w-full"
                                        >
                                            <Image
                                                src={'/uploads/0.png'}
                                                alt={'table'}
                                                layout='fill'
                                                objectFit='contain'
                                                className='rounded'
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-xl font-bold">T5</span>
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.3 }}
                                            className="relative h-24 w-full"
                                        >
                                            <Image
                                                src={'/uploads/0.png'}
                                                alt={'table'}
                                                layout='fill'
                                                objectFit='contain'
                                                className='rounded'
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-xl font-bold">T5</span>
                                            </div>
                                        </motion.div>

                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </TabsContent>

                </Tabs>
            </div>
            <div>
                <p>test</p>
            </div>
        </section >
    )
}
