'use client'

//import ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

//import component
import { Pos_details } from './components/detail'
import { Table } from './components/table'
import { container, item } from './components/motion'

//import next
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useToast } from '@/components/ui/use-toast'
import { TakeAway } from './components/takeaway'
import { Delivery } from './components/delivery'

export default function PosPage() {
  const { toast } = useToast()
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [newTableNO, setNewTableNO] = useState('') // จัดการกับ table_NO
  const [newTableType, setNewTableType] = useState('inside') // จัดการกับ type
  const [allTable, setAllTable] = useState({ inside: [], outside: [] }) // กำหนดค่าเริ่มต้น
  const [isLoading, setIsLoading] = useState(false)

  const fetchAlltable = async () => {
    try {
      const response = await axios.get('/api/table/all')
      setAllTable(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchAlltable()
  }, [])

  useEffect(() => {
    console.log("allTable", allTable.inside);
  }, [allTable]);

  useEffect(() => {
    console.log("selectedOrder", selectedOrder);
  }, [selectedOrder])

  // ฟังก์ชันสำหรับเพิ่มโต๊ะ
  const addTable = async (e) => {
    e.preventDefault()
    setIsLoading(true) // ตั้งค่า isLoading เป็น true
    try {
      await axios.post('/api/table', { type: newTableType, table_NO: newTableNO })
      setNewTableNO('')
      setNewTableType('inside')
      fetchAlltable()
      toast({
        variant: 'success',
        title: 'Table added successfully!',
        description: 'Table added successfully!',
      })
    } catch (error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Error adding table!',
        description: 'Failed to add new table!',
      })
    } finally {
      setIsLoading(false) // ตั้งค่า isLoading เป็น false เมื่อเสร็จสิ้น
    }
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
              <div className='ml-auto flex items-center'>
                <Input
                  type="text"
                  name='table_NO'
                  value={newTableNO}
                  onChange={(e) => setNewTableNO(e.target.value)}
                  placeholder="Table Number"
                  className='rounded-r-none '
                />
                <Select
                  value={newTableType}
                  onValueChange={(value) => setNewTableType(value)}
                >
                  <SelectTrigger className='w-[180px] rounded-r-none rounded-l-none border-l-0'>
                    <SelectValue placeholder='Table' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='inside'>Inside</SelectItem>
                    <SelectItem value='outside'>Outside</SelectItem>
                  </SelectContent>
                </Select>
                <Button type='submit' className='rounded-l-none'>
                  {isLoading ? (
                    <>
                      Adding
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    'Add'
                  )}
                </Button>

              </div>
            </form>
          </div>
          <TabsContent value='inside'>
            <motion.div
              key={'inside'}
              variants={container}
              initial="hidden"
              animate="visible"
              className="min-h-[70%]"
            >
              <Card className='min-h-[70%]'>
                <CardContent>
                  {allTable?.inside && (
                    <Table Tabletype={allTable.inside} setSelectedTable={setSelectedOrder} />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          <TabsContent value='outside'>
            <motion.div
              key={'ourside'}
              variants={container}
              initial="hidden"
              animate="visible"
              className="min-h-[70%]"
            >
              <Card className='min-h-[70%]'>
                <CardContent>
                  {allTable?.outside && (
                    <Table Tabletype={allTable.outside} setSelectedTable={setSelectedOrder} />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          <TabsContent value='takeaway'>
            <motion.div
              key={'ourside'}
              variants={container}
              initial="hidden"
              animate="visible"
              className="min-h-[70%] grid grid-cols-2 gap-4"
            >
              <TakeAway />
              <Delivery />

            </motion.div>
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
          <Pos_details table={selectedOrder} fetchAllTable={fetchAlltable} />
        </motion.div>
      </div>
    </section>
  )
}
