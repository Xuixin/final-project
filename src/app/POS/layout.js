'use client';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from '@/components/ui/use-toast';
import { Calendar } from 'lucide-react';

// import component
import Aside from '@/components/aside';
import { AdminLogin } from '@/components/pos/login';
// import dependency
import { useAdminContext } from '../Context/adminContext';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { fetchAdminInfo } from '@/lib/adminInfo';

// import context
import { PosProvider } from './context';

export default function PosLayout({ children }) {
    const { toast } = useToast();
    const router = useRouter();
    const [adminData, setAdminData] = useState(null);
    const { logout, isAuthenticated } = useAdminContext();
    const [isAttendance, setIsAttendance] = useState(false);
    const [isAuthen, setIsAuthen] = useState(false)


    const markAttendance = async () => {
        const response = await axios.get(`/api/employee/attendance/${adminData.id}`); // ใช้ adminData.id
        setIsAttendance(response.data.status);
    };

    const fetchEmp = async () => {
        try {
            const response = await fetchAdminInfo();
            console.log(response);
            setAdminData(response);  // ไม่ต้องใช้ await กับ setState
        } catch (error) {
            console.error('Error fetching admin info:', error);
        }
    };

    useEffect(() => {
        fetchEmp();
        setIsAuthen(isAuthenticated())
    }, []);
    useEffect(() => {
        if (adminData) {
            markAttendance()
        }
    }, [adminData]);


    const submit = async () => {
        try {
            const response = await axios.post(`/api/employee/attendance/${adminData.id}`);
            setIsAttendance(response.data.status);
            toast({
                variant: 'success',
                title: 'Success',
                description: 'ลงชื่อสำเร็จ'
            });
            router.refresh();
            setIsAttendance(true)
        } catch (error) {
            console.error('Error marking attendance:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'เกิดข้อผิดพลาดในการลงชื่อ'
            });
            await markAttendance(); // อัปเดตสถานะการลงชื่อหลังจากเกิดข้อผิดพลาด
        }
    };


    return (
        <PosProvider>
            <TooltipProvider>
                <div className="grid h-screen w-full pl-[56px]">
                    <Aside />
                    <div className="flex flex-col relative">
                        <header className="sticky top-0 z-20 flex h-[57px] pl-6 pr-5 items-center justify-end gap-1 border-b bg-background">

                            <div className="flex items-center space-x-2">

                                {isAuthen && (

                                    isAttendance ? (
                                        <div className="flex gap-2 items-end" >
                                            <span className="text-sm font-medium text-green-500">Attendance: Marked</span>
                                        </div>
                                    ) : (
                                        <Button type="submit" onClick={submit}>ลงชื่อ</Button>
                                    )
                                )}


                                {isAuthen ? (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button className="rounded-lg">Hi {adminData?.name}</Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-25">
                                            <Button
                                                type="submit"
                                                variant="aa"
                                                className="w-full"
                                                onClick={logout}
                                            >
                                                logout
                                            </Button>
                                        </PopoverContent>
                                    </Popover>
                                ) : (
                                    <AdminLogin />
                                )}

                            </div>
                        </header>
                        <section className='w-full'>
                            {children}
                        </section>
                    </div>
                </div>
            </TooltipProvider>
        </PosProvider>
    );
}
