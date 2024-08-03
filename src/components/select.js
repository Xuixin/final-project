'use client'
import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function SelectPath({ path }) {
    const [pathselect, setPathselect] = useState('')

    useEffect(() => {
        // Log the path to check when and why useEffect is triggered
        console.log("Current path:", path); 
        
        switch (path) {
            case '/admin':
                setPathselect('menu');
                break;
            case '/admin/menutype':
                setPathselect('Menutype');    
                break;
            default:
                setPathselect(''); // Reset if path doesn't match
        }
    }, [path]); // Only run this effect when 'path' changes

    return (
        <Select>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={pathselect} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <Link href={'/admin'}><SelectItem>menu</SelectItem></Link>
                    <Link href={'/admin/menutype'}><SelectItem>menutype</SelectItem></Link>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
