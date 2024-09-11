"use client"

// Import UI components
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// Import Next.js dependencies
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const DropdownEmpPath = () => {
    const path = usePathname();
    const router = useRouter();
    const [value, setValue] = useState('');

    useEffect(() => {
        switch (path) {
            case '/admin/employees':
                setValue('employee');
                break;
            case '/admin/employees/attendance':
                setValue('attendance');
                break;
            default:
                break;
        }
    }, [path]);

    const handleChange = (newValue) => {
        setValue(newValue);
        switch (newValue) {
            case 'employee':
                router.push('/admin/employees');
                break;
            case 'attendance':
                router.push('/admin/employees/attendance');
                break;
            default:
                break;
        }
    };

    return (
        <Select value={value} onValueChange={handleChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="attendance">Attendance</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
