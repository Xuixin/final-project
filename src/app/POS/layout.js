'use client';
import { Button } from '@/components/ui/button';
import {
    TooltipProvider,
} from '@/components/ui/tooltip';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from '@/components/ui/use-toast';

// import component
import Aside from '@/components/aside';
import { AdminLogin } from '@/components/pos/login';
// import dependency
import { useAdminContext } from '../Context/adminContext';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function HomeLayout({ children }) {
    const { toast } = useToast();
    const router = useRouter();
    const [adminData, setAdminData] = useState(null);
    const { admin, logout } = useAdminContext();
    const [isAttendance, setIsAttendance] = useState(false);

    useEffect(() => {
        setAdminData(admin);
        if (!admin) {
            setAdminData(null)
        }
    }, [admin]);

    useEffect(() => {
        if (admin) {
            axios
                .get(`/api/employee/attendance/${admin.id}`)
                .then((response) => {
                    setIsAttendance(response.data.status);
                    console.log("response", response.data.status);
                })
                .catch((err) => {
                    console.error('Error fetching attendance:', err);
                });
        }
    }, [admin]);

    const submit = async () => {
        try {
            const response = await axios.post(`/api/employee/attendance/${admin.id}`);
            setIsAttendance(response.data.status);
            toast({
                variant: 'success',
                title: 'Success',
                description: 'ลงชื่อสำเร็จ'
            });
            router.refresh();
        } catch (error) {
            console.error('Error marking attendance:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'เกิดข้อผิดพลาดในการลงชื่อ'
            });
        }
    };

    return (
        <TooltipProvider>
            <div className="grid h-screen w-full pl-[56px]">
                <Aside />
                <div className="flex flex-col">
                    <header className="sticky top-0 z-10 flex h-[57px] pl-6 pr-10 items-center justify-between gap-1 border-b bg-background">
                        <h1 className="text-xl font-semibold">POS</h1>
                        {adminData ? (
                            !isAttendance ? (
                                <Button type="submit" onClick={() => submit()}>ลงชื่อ</Button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-green-500">Attendance: Marked</span>
                                </div>
                            )
                        ) : null}

                        {adminData ? (
                            <>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="rounded-full">Hi {adminData.name}</Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-25">
                                        <Button
                                            type="submit"
                                            variant="aa"
                                            className="w-full"
                                            onClick={() => logout()}
                                        >
                                            logout
                                        </Button>
                                    </PopoverContent>
                                </Popover>
                            </>
                        ) : (
                            <AdminLogin />
                        )}
                    </header>
                    {children}
                </div>
            </div>
        </TooltipProvider>
    );
}
