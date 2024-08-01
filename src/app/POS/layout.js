'use client';
import { Button } from '@/components/ui/button';
import {
    TooltipProvider,
} from '@/components/ui/tooltip';
import Link from 'next/link';

//import 
import Aside from '@/components/aside';

export default function HomeLayout({ children }) {
    return (
        <TooltipProvider>
            <div className="grid h-screen w-full pl-[56px]">
                <Aside />
                <div className="flex flex-col">
                    <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
                        <h1 className="text-xl font-semibold">POS</h1>
                        <Link href='/admin'>
                            <Button
                                size="sm"
                                className="ml-auto gap-1.5 text-sm"
                            >
                                Admin
                            </Button>
                        </Link>
                    </header>
                    {children}
                </div>
            </div>
        </TooltipProvider>
    );
}
