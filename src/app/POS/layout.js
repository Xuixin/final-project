'use client';
import { Button } from '@/components/ui/button';
import {
    TooltipProvider,
} from '@/components/ui/tooltip';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

//import 
import Aside from '@/components/aside';
import { AdminLogin } from '@/components/pos/login';
//import depedensy
import { useAdminContext } from '../Context/adminContext';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function HomeLayout({ children }) {
    const [adminData, setAdminData] = useState()
    const [alladmin, setAllAdmin] = useState()
    const { admin, logout } = useAdminContext()
    useEffect(() => {
        setAdminData(admin)
        if (!admin) {
            axios
                .get('/api/employee/emp')
                .then((response) => {
                    setAllAdmin(response.data)
                })
                .catch((err) => {
                    console.error('Error fetching admins:', err)
                })
        } else {
            setAllAdmin([])
        }
    }, [admin])
    return (
        <TooltipProvider>
            <div className="grid h-screen w-full pl-[56px]">
                <Aside />
                <div className="flex flex-col">
                    <header className="sticky top-0 z-10 flex h-[57px] pl-6 pr-10 items-center justify-between gap-1 border-b bg-background">
                        <h1 className="text-xl font-semibold">POS</h1>
                        {adminData ? (
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
                        ) : (
                            <AdminLogin />
                        )
                        }
                    </header>
                    {children}
                </div>
            </div>
        </TooltipProvider>
    );
}
