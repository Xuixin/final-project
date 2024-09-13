'use client'

import { MoreHorizontal, PlusCircle } from 'lucide-react'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

// Component for displaying table rows
const TableLoop = ({ menuSet, onDelete, router }) => {
    return (
        <Table>
            <TableHeader >
                <TableRow className="bg-base-200">
                    <TableHead className='w-[100px]'>NO.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Menu</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>
                        <span className='sr-only'>Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {menuSet.map((set, index) => (
                    <TableRow key={set.id}>
                        <TableCell className='font-medium'>{index + 1}</TableCell>
                        <TableCell>{set.name}</TableCell>
                        <TableCell>
                            {set.details.map((detail, index) => (
                                <div key={index}>
                                    {detail.menu.name} X {detail.quantity}
                                </div>
                            ))}
                        </TableCell>

                        <TableCell>{set.totalMenu}</TableCell>
                        <TableCell>RM {set.price}</TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        aria-haspopup='true'
                                        size='icon'
                                        variant='ghost'
                                    >
                                        <MoreHorizontal className='h-4 w-4' />
                                        <span className='sr-only'>Toggle menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem className='cursor-pointer' onClick={() => router.push(`/menuset/editmenuset/${set.id}`)}>
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onDelete(set.id)}>
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

// Main MenuType component
export default function MenuType() {
    const [menuSet, setMenuset] = useState([])
    const [triggerValue, setTriggerValue] = useState('all')
    const [triggerSelected, setTriggerSelected] = useState([])
    const router = useRouter()

    const fetchMenuSet = async () => {
        try {
            const response = await axios.get('/api/menuset')
            setMenuset(response.data)
            onTrigger('all', response.data)  // call after data is fetched
        } catch (error) {
            console.error('Failed to fetch menuset:', error)
        }
    }
    useEffect(() => {
        fetchMenuSet()
    }, [])

    const onTrigger = (value, menuData = menuSet) => {
        const filteredMenuSet = value === 'all'
            ? menuData
            : menuData.filter((set) => set.status === value)
        setTriggerSelected(filteredMenuSet)
    }


    useEffect(() => {
        onTrigger(triggerValue,)
    }, [triggerValue])


    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) {
            return
        }

        try {
            await axios.delete(`/api/menuset/${id}`)
            setMenuset((prevMenuSet) => prevMenuSet.filter((set) => set.id !== id)) // Update the state to remove the deleted item
            alert('Menuset deleted successfully!')
            fetchMenuSet()
        } catch (error) {
            alert(
                'Deletion failed: ' +
                (error.response?.data?.message || 'Something went wrong.')
            )
        }
    }

    return (
        <Tabs defaultValue='all'>
            <div className='flex items-center'>
                <TabsList>
                    <TabsTrigger value="all" onClick={() => setTriggerValue('all')}>All</TabsTrigger>
                    <TabsTrigger value="Published" onClick={() => setTriggerValue('Published')}>Published</TabsTrigger>
                    <TabsTrigger value="Draft" onClick={() => setTriggerValue('Draft')}>Draft</TabsTrigger>
                    <TabsTrigger value="Archived" className="hidden sm:flex" onClick={() => setTriggerValue('Archived')}>
                        Archived
                    </TabsTrigger>
                </TabsList>
                <div className='ml-auto flex items-center gap-2'>
                    <Button size="sm" className="h-8 gap-1" onClick={() => router.push('/menuset/addmenuset')}>
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add Menuset
                        </span>
                    </Button>
                </div>
            </div>
            <TabsContent value={triggerValue}>
                <Card x-chunk='dashboard-06-chunk-0'>
                    <CardHeader>
                        <CardTitle>MenuSet</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TableLoop
                            menuSet={triggerSelected}
                            onDelete={handleDelete}
                            router={router}
                        />
                    </CardContent>
                    <CardFooter>
                        {/* <div className="text-xs text-muted-foreground">
              Showing <strong>1-10</strong> of <strong>32</strong> products
            </div> */}
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    )
}
