"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Table,
    TableBody,
    TableFooter,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

export default function Attendance() {
    const { toast } = useToast();
    const [date, setDate] = useState(new Date());
    const [attendance, setAttendance] = useState({});
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const response = await axios.get('/api/employee/attendance');
                setAttendance(response.data);
            } catch (error) {
                console.error(error);
                toast({
                    variant: 'destructive',
                    title: 'Fetch Error',
                    description: "Failed to fetch attendance data.",
                });
            }
        };

        const fetchAllEmp = async () => {
            try {
                const response = await axios.get('/api/employee/emp');
                setEmployees(response.data);
            } catch (error) {
                console.error(error);
                toast({
                    variant: 'destructive',
                    title: 'Fetch Error',
                    description: "Failed to fetch employee data.",
                });
            }
        };

        fetchAttendance();
        fetchAllEmp();
    }, [toast]);

    // ฟิลเตอร์ attendance ตามวันที่เลือก
    const selectedDate = format(date, "yyyy-MM-dd");
    const attendanceForSelectedDate = attendance[selectedDate] || [];

    // ตรวจสอบว่าพนักงานคนไหนมาทำงาน
    const attendanceMap = attendanceForSelectedDate.reduce((acc, att) => {
        acc[att.employeeId] = att;
        return acc;
    }, {});


    // รวมข้อมูลพนักงานทั้งหมด และสถานะว่ามาหรือไม่มา
    const combinedData = employees.map(emp => {
        const att = attendanceMap[emp.id];
        return {
            ...emp,
            status: att ? att.status : false,
            wageperday: emp.roles.wageperday,
            paymentStatus: att && att.wages?.length > 0 ? "Paid" : "Not Paid",
            attendanceId: att ? att.id : null, // เพิ่ม attendanceId
        };
    });



    const PayAll = async () => {
        setIsLoading(true);

        // ฟิลเตอร์พนักงานที่มีสถานะ 'Present'
        const payEmployees = combinedData.filter(emp => emp.status);

        // เรียกใช้ API เพื่อทำการจ่ายเงิน
        await Promise.all(payEmployees.map(async (emp) => {
            try {
                const response = await axios.post(`/api/employee/attendance/pay/${emp.attendanceId}`, {
                    amount: emp.wageperday
                });

                if (response.status === 200) {
                    toast({
                        variant: 'success',
                        title: 'Payment Success',
                        description: `Successfully paid for ${emp.name}`,
                    });
                } else {
                    toast({
                        variant: 'destructive',
                        title: 'Payment Error',
                        description: `Failed to pay for ${emp.name}`,
                    });
                }
            } catch (error) {
                console.error(error);
                toast({
                    variant: 'destructive',
                    title: 'Payment Error',
                    description: `Failed to pay for ${emp.name}`,
                });
            }
        }));


        setIsLoading(false);
    }




    return (
        <>
            <div className="flex justify-between px-56">
                <div className="w-full flex items-center justify-end gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={`w-[280px] justify-start text-left font-normal ${!date ? "text-muted-foreground" : ""}`}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "MMMM dd, yyyy") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <div className="w-full flex justify-center">
                <TabsContent value="all" className="min-h-[500px] min-w-[800px]">
                    <Card className="dashboard-06-chunk-0 h-full">
                        <CardContent className="m-5 grid grid-cols-1 justify-center items-center">
                            <div>วันที่ {new Date(date).toLocaleDateString('en-GB', { timeZone: 'Asia/Bangkok' })}</div>
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Employee Name</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Wage per Day</TableHead>
                                        <TableHead className="text-right">Payment Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {combinedData.length > 0 ? (
                                        combinedData.map((emp) => (
                                            <TableRow key={emp.id}>
                                                <TableCell className="font-medium">{emp.name}</TableCell>
                                                <TableCell >{emp.status ? "Present" : "Absent"}</TableCell>
                                                <TableCell className="text-right">{emp.wageperday}</TableCell>
                                                <TableCell className="text-right">{emp.paymentStatus}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4}>No attendance records for this date</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={2}>Total</TableCell>
                                        <TableCell className="text-right">
                                            {combinedData.reduce((total, emp) => total + (emp.status ? emp.wageperday : 0), 0)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button onClick={() => PayAll()} >
                                                {isLoading ? 'paying...' : 'pay'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </div>
        </>
    );
}
