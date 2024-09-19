'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Button } from '@/components/ui/button'
import { File } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from '@/components/ui/select'
import { Pos_details } from './componants/detail'
import { container, item } from './componants/motion'

export default function PosPage() {
  const [selectedOrder, setSelectedOrder] = useState(null)

  const addTable = (e) => {
    e.preventDefault()
    // Add table to the order state
    const newOrder = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'inside',
      items: [],
    }
    setSelectedOrder(newOrder)
  }

  return (
    <section className='grid flex-1 items-start gap-4 p-4 bg-primary-foreground h-screen sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3'>
      <div className='grid auto-rows-max items-start pt-2 gap-4 md:gap-8 lg:col-span-2'>
        <Tabs defaultValue='inside'>
          <div className='flex items-center justify-between'>
            <TabsList>
              <TabsTrigger value='inside'>Inside</TabsTrigger>
              <TabsTrigger value='outside'>Outside</TabsTrigger>
              <TabsTrigger value='takeaway'>Takeaway</TabsTrigger>
            </TabsList>
            <form onSubmit={addTable}>
              <div className='ml-auto flex items-center gap-2'>
                <Select className='rounded-lg'>
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='Table' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='inside'>Inside</SelectItem>
                    <SelectItem value='outside'>Outside</SelectItem>
                  </SelectContent>
                </Select>
                <Button type='submit' className='bg-green-500 text-white'>Add</Button>
              </div>
            </form>
          </div>
          <TabsContent value='inside'>
            <motion.div
              variants={container}
              initial="hidden"
              animate="visible"
              className="min-h-[70%]"
            >
              <Card className='min-h-[70%]'>
                <CardContent>
                  <div className='w-full grid grid-cols-5 p-5 gap-4'>

                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      className='relative h-24 w-full'
                    >
                      <Image
                        src={'/uploads/0.png'}
                        alt={'table'}
                        layout='fill'
                        objectFit='contain'
                        className='rounded'
                      />
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <span className='text-xl font-bold'>T1</span>
                      </div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      className='relative h-24 w-full'
                    >
                      <Image
                        src={'/uploads/0.png'}
                        alt={'table'}
                        layout='fill'
                        objectFit='contain'
                        className='rounded'
                      />
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <span className='text-xl font-bold'>T1</span>
                      </div>
                    </motion.div>


                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          <TabsContent value='outside'>
            test
          </TabsContent>
          <TabsContent value='takeaway'>
            test
          </TabsContent>
        </Tabs>
      </div>
      <div className="py-5">
        <motion.div
          initial={{ x: "-100%", opacity: 0, scale: 0 }}  // เริ่มจากซ้ายสุด
          animate={{ x: 0, opacity: 1, scale: 1 }}       // เลื่อนเข้ามาตรงกลาง
          transition={{
            type: "tween",
            duration: 0.5,
            ease: "easeInOut"
          }}
        >
          <Pos_details order={selectedOrder} />
        </motion.div>
      </div>
    </section>
  )
}
