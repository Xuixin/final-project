

'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import { Calendar as CalendarIcon, Users, DollarSign, Clock } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Table,
  TableBody,
  TableFooter,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { format } from 'date-fns'
import { useToast } from '@/components/ui/use-toast'

export default function Attendance() {
  const { toast } = useToast()
  const [date, setDate] = useState(new Date())
  const [attendance, setAttendance] = useState({})
  const [employees, setEmployees] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchAttendance = async () => {
    try {
      const response = await axios.get('/api/employee/attendance')
      setAttendance(response.data)
    } catch (error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Fetch Error',
        description: 'Failed to fetch attendance data.',
      })
    }
  }

  const fetchAllEmp = async () => {
    try {
      const response = await axios.get('/api/employee/emp')
      setEmployees(response.data)
    } catch (error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Fetch Error',
        description: 'Failed to fetch employee data.',
      })
    }
  }
  useEffect(() => {
    fetchAttendance()
    fetchAllEmp()
  }, [toast])

  // ฟิลเตอร์ attendance ตามวันที่เลือก
  const selectedDate = format(date, 'yyyy-MM-dd')
  const attendanceForSelectedDate = attendance[selectedDate] || []

  // ตรวจสอบว่าพนักงานคนไหนมาทำงาน
  const attendanceMap = attendanceForSelectedDate.reduce((acc, att) => {
    acc[att.employeeId] = att
    return acc
  }, {})

  // รวมข้อมูลพนักงานทั้งหมด และสถานะว่ามาหรือไม่มา
  const combinedData = employees.map((emp) => {
    const att = attendanceMap[emp.id]
    return {
      ...emp,
      status: att ? att.status : false,
      wageperday: emp.role.wageperday,
      paymentStatus: att && att.wages?.length > 0 ? 'Paid' : 'Not Paid',
      attendanceId: att ? att.id : null, // เพิ่ม attendanceId
    }
  })

  const PayAll = async () => {
    setIsLoading(true)

    // ฟิลเตอร์พนักงานที่มีสถานะ 'Present'
    const payEmployees = combinedData.filter((emp) => emp.status)

    // คำนวณยอดรวมที่ต้องจ่าย
    const totalAmount = payEmployees.reduce(
      (total, emp) => total + emp.wageperday,
      0
    )

    // เรียกใช้ API เพื่อทำการจ่ายเงิน
    await Promise.all(
      payEmployees.map(async (emp) => {
        try {
          const response = await axios.post(
            `/api/employee/attendance/pay/${emp.attendanceId}`,
            {
              amount: emp.wageperday,
            }
          )

          if (response.status === 200) {
            toast({
              variant: 'success',
              title: 'Payment Success',
              description: `Successfully paid for ${emp.name}`,
            })
          } else {
            toast({
              variant: 'destructive',
              title: 'Payment Error',
              description: `Failed to pay for ${emp.name}`,
            })
          }
        } catch (error) {
          console.error(error)
          toast({
            variant: 'destructive',
            title: 'Payment Error',
            description: `Failed to pay for ${emp.name}`,
          })
        }
      })
    )

    // บันทึกค่าใช้จ่ายรวม
    try {
      await axios.post('/api/expense', {
        category: 'wage',
        amount: totalAmount,
      })

      toast({
        variant: 'success',
        title: 'Expenses Updated',
        description: `Total wage expenses recorded successfully.`,
      })

      // รีเฟรชข้อมูลพนักงานและการเข้าร่วม
      fetchAllEmp()
      fetchAttendance()
    } catch (error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Expenses Error',
        description: 'Failed to record wage expenses.',
      })
    }

    setIsLoading(false)
  }

  // Calculate statistics
  const totalEmployees = employees.length
  const presentEmployees = combinedData.filter(emp => emp.status).length
  const totalWages = combinedData.reduce((total, emp) => total + (emp.status ? emp.wageperday : 0), 0)

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Employees</p>
                <h3 className="text-2xl font-bold">{totalEmployees}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-green-100">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Present Today</p>
                <h3 className="text-2xl font-bold">{presentEmployees}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-purple-100">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Wages</p>
                <h3 className="text-2xl font-bold">RM {totalWages.toFixed(2)}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <CardTitle className="text-2xl font-bold">Attendance Management</CardTitle>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-[240px] justify-start text-left font-normal ${!date ? 'text-muted-foreground' : ''}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'MMMM dd, yyyy') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[300px]">Employee Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="">Wage per Day</TableHead>
                <TableHead className="text-right">Payment Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {combinedData.length > 0 ? (
                combinedData.map((emp) => (
                  <TableRow key={emp.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {emp.name} {emp.lastname}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={emp.status ? "success" : "secondary"}
                        className={`${emp.status ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                      >
                        {emp.status ? 'Present' : 'Absent'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-left font-medium">
                      RM {emp.wageperday.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={emp.paymentStatus === 'Paid' ? "outline" : "secondary"}
                        className={`${emp.paymentStatus === 'Paid' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}
                      >
                        {emp.paymentStatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                    No attendance records for this date
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow className="bg-gray-50">
                <TableCell colSpan={2} className="font-semibold">Total Wages for Today</TableCell>
                <TableCell className="text-left font-bold">
                  RM {combinedData.reduce(
                    (total, emp) => total + (emp.status ? emp.wageperday : 0),
                    0
                  ).toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={() => PayAll()}
                    disabled={isLoading || combinedData.filter(emp => emp.status && emp.paymentStatus !== 'Paid').length === 0}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <DollarSign className="mr-2 h-4 w-4" />
                        Pay All
                      </span>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}