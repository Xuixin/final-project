'use client';

import {
    Bird,
    CornerDownLeft,
    Mic,
    Paperclip,
    Rabbit,
    Settings,
    Share,
    Turtle,
    Plus,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

//import 
import Aside from '@/components/aside';

export default function HomeLayout({children}) {
    return (
        <TooltipProvider>
            <div className="grid h-screen w-full pl-[56px]">
                <Aside />
                <div className="flex flex-col">
                    <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
                        <h1 className="text-xl font-semibold">POS</h1>


                        <Button
                            variant="outline"
                            size="sm"
                            className="ml-auto gap-1.5 text-sm"
                        >
                            <Plus className="size-3.5" />
                            เพิ่มโต๊ะ
                        </Button>
                    </header>
                    {children}
                </div>
            </div>
        </TooltipProvider>
    );
}
