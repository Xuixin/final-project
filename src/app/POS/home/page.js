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
import { Select } from '@/components/ui/select'
import { Pos_details } from './componants/detail'

export default function PosPage() {
  const [selectedOrder, setSelectedOrder] = useState(null)
  return (
    <section className='grid flex-1 items-start gap-4 p-4 bg-primary-foreground h-screen sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3'>
      <div className='grid auto-rows-max items-start pt-2 gap-4 md:gap-8 lg:col-span-2'>
        <Tabs defaultValue='inside'>
          <div className='flex items-center'>
            <TabsList>
              <TabsTrigger value='inside'>Inside</TabsTrigger>
              <TabsTrigger value='outside'>Outside</TabsTrigger>
              <TabsTrigger value='takeaway'>Takeaway</TabsTrigger>
            </TabsList>
            <div className='ml-auto flex items-center gap-2'>
              {/* <form onSubmit={addTable}>
                <Select>
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='Theme' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='light'>Light</SelectItem>
                    <SelectItem value='dark'>Dark</SelectItem>
                    <SelectItem value='system'>System</SelectItem>
                  </SelectContent>
                </Select>
              </form> */}
            </div>
          </div>
          <TabsContent value='inside'>
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.5,
                clipPath: 'inset(10% 50% 90% 50% round 10px)',
              }}
              animate={{
                opacity: 1,
                scale: 1,
                clipPath: 'inset(0% 0% 0% 0% round 0px)',
              }}
              transition={{
                type: 'spring',
                bounce: 0.3,
                duration: 0.5,
                delay: 0.2,
              }}
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
                        src={'/uploads/1.png'}
                        alt={'table'}
                        layout='fill'
                        objectFit='contain'
                        className='rounded'
                      />
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <span className='text-xl font-bold'>T2</span>
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
                        <span className='text-xl font-bold'>T3</span>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      className='relative h-24 w-full'
                    >
                      <Image
                        src={'/uploads/1.png'}
                        alt={'table'}
                        layout='fill'
                        objectFit='contain'
                        className='rounded'
                      />
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <span className='text-xl font-bold'>T4</span>
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
                        <span className='text-xl font-bold'>T5</span>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      className='relative h-24 w-full'
                    >
                      <Image
                        src={'/uploads/1.png'}
                        alt={'table'}
                        layout='fill'
                        objectFit='contain'
                        className='rounded'
                      />
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <span className='text-xl font-bold'>T6</span>
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
                        <span className='text-xl font-bold'>T5</span>
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
                        <span className='text-xl font-bold'>T5</span>
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
                        <span className='text-xl font-bold'>T5</span>
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
                        <span className='text-xl font-bold'>T5</span>
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
                        <span className='text-xl font-bold'>T5</span>
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
                        <span className='text-xl font-bold'>T5</span>
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
                        <span className='text-xl font-bold'>T5</span>
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          <TabsContent value='outside'>
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.5,
                clipPath: 'inset(10% 50% 90% 50% round 10px)',
              }}
              animate={{
                opacity: 1,
                scale: 1,
                clipPath: 'inset(0% 0% 0% 0% round 0px)',
              }}
              transition={{
                type: 'spring',
                bounce: 0.3,
                duration: 0.5,
                delay: 0.2,
              }}
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
                        src={'/uploads/1.png'}
                        alt={'table'}
                        layout='fill'
                        objectFit='contain'
                        className='rounded'
                      />
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <span className='text-xl font-bold'>T2</span>
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
                        <span className='text-xl font-bold'>T3</span>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      className='relative h-24 w-full'
                    >
                      <Image
                        src={'/uploads/1.png'}
                        alt={'table'}
                        layout='fill'
                        objectFit='contain'
                        className='rounded'
                      />
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <span className='text-xl font-bold'>T4</span>
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
                        <span className='text-xl font-bold'>T5</span>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      className='relative h-24 w-full'
                    >
                      <Image
                        src={'/uploads/1.png'}
                        alt={'table'}
                        layout='fill'
                        objectFit='contain'
                        className='rounded'
                      />
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <span className='text-xl font-bold'>T6</span>
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
                        <span className='text-xl font-bold'>T5</span>
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
                        <span className='text-xl font-bold'>T5</span>
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
                        <span className='text-xl font-bold'>T5</span>
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
                        <span className='text-xl font-bold'>T5</span>
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
                        <span className='text-xl font-bold'>T5</span>
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
                        <span className='text-xl font-bold'>T5</span>
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
                        <span className='text-xl font-bold'>T5</span>
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          <TabsContent value='takeaway'>
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.5,
                clipPath: 'inset(10% 50% 90% 50% round 10px)',
              }}
              animate={{
                opacity: 1,
                scale: 1,
                clipPath: 'inset(0% 0% 0% 0% round 0px)',
              }}
              transition={{
                type: 'spring',
                bounce: 0.3,
                duration: 0.5,
                delay: 0.2,
              }}
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
                        src={'/uploads/1.png'}
                        alt={'table'}
                        layout='fill'
                        objectFit='contain'
                        className='rounded'
                      />
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <span className='text-xl font-bold'>T2</span>
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
                        <span className='text-xl font-bold'>T3</span>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      className='relative h-24 w-full'
                    >
                      <Image
                        src={'/uploads/1.png'}
                        alt={'table'}
                        layout='fill'
                        objectFit='contain'
                        className='rounded'
                      />
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <span className='text-xl font-bold'>T4</span>
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
                        <span className='text-xl font-bold'>T5</span>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      className='relative h-24 w-full'
                    >
                      <Image
                        src={'/uploads/1.png'}
                        alt={'table'}
                        layout='fill'
                        objectFit='contain'
                        className='rounded'
                      />
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <span className='text-xl font-bold'>T6</span>
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
                        <span className='text-xl font-bold'>T5</span>
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
                        <span className='text-xl font-bold'>T5</span>
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
                        <span className='text-xl font-bold'>T5</span>
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
                        <span className='text-xl font-bold'>T5</span>
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
                        <span className='text-xl font-bold'>T5</span>
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
                        <span className='text-xl font-bold'>T5</span>
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
                        <span className='text-xl font-bold'>T5</span>
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
      <div className="py-5">
        <Pos_details />
      </div>
    </section>
  )
}
