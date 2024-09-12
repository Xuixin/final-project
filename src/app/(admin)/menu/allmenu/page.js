'use client'

//import ui
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    File,
    Home,
    LineChart,
    ListFilter,
    MoreHorizontal,
    Package,
    Package2,
    PanelLeft,
    PlusCircle,
    Search,
    Settings,
    ShoppingCart,
    Users2,
} from "lucide-react"
import { Input } from "@/components/ui/input"

//import next
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from 'react'
import { format } from "date-fns"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function MenuAdmin() {
    const router = useRouter()
    const { toast } = useToast()
    const [menus, setMenus] = useState([])
    const [categories, setCategories] = useState([])
    const [triggerValue, setTriggerValue] = useState('all')
    const [selectedMenu, setSelectedMenu] = useState([])
    const [isLoading, setIsloading] = useState(false)

    const fetchMenu = async () => {
        const response = await axios.get('/api/menu')
        setMenus(response.data)
    }
    const fetchCategories = async () => {
        const response = await axios.get('/api/menutype')
        setCategories(response.data.data)
    }
    const onDelete = async (id) => {
        await axios
            .delete(`/api/menu/${id}`)
            .then(() => {
                toast({
                    variant: "success",
                    title: "Menu deleted successfully",
                })
            })
            .catch((error) => {
                toast({
                    variant: "destructive",
                    title: "Failed to delete menu",
                    description: error.response?.data?.message || "Something went wrong",
                })
            })

        router.refresh()
    }

    useEffect(() => {
        setIsloading(true)
        fetchCategories()
        fetchMenu()
        setIsloading(false)
    }, [])

    useEffect(() => {
        onTrigger(triggerValue)
    }, [triggerValue, menus])

    const onTrigger = (value) => {
        const menuWithTrigger = value === 'all'
            ? menus
            : menus.filter((menu) => menu.status === value)
        setSelectedMenu(menuWithTrigger)
    }

    const selectedCategory = (category) => {
        const menuWithCategory = menus.filter((menu) => menu.category.name === category)
        setSelectedMenu(menuWithCategory)
    }


    return (
        <Tabs defaultValue="all">
            <div className="flex items-center">
                <TabsList>
                    <TabsTrigger value="all" onClick={() => setTriggerValue('all')}>All</TabsTrigger>
                    <TabsTrigger value="Published" onClick={() => setTriggerValue('Published')}>Published</TabsTrigger>
                    <TabsTrigger value="Draft" onClick={() => setTriggerValue('Draft')}>Draft</TabsTrigger>
                    <TabsTrigger value="Archived" className="hidden sm:flex" onClick={() => setTriggerValue('Archived')}>
                        Archived
                    </TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 gap-1">
                                <ListFilter className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Filter
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {categories.map((cat) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={cat.id}
                                        checked={cat.name === triggerValue}
                                        onClick={() => selectedCategory(cat.name)}
                                    >
                                        {cat.name}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}

                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button size="sm" className="h-8 gap-1" onClick={() => router.push('/menu/addmenu')}>
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add Product
                        </span>
                    </Button>
                </div>
            </div>
            <TabsContent value={triggerValue}>
                <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                        <CardTitle>Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="hidden w-[100px] sm:table-cell">
                                        <span className="sr-only">Image</span>
                                    </TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="hidden md:table-cell">Price</TableHead>
                                    <TableHead className="hidden md:table-cell">Total Sales</TableHead>
                                    <TableHead className="hidden md:table-cell">Created at</TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            {isLoading ? (
                                <TableBody className="flex items-center justify-center w-full min-h-10">
                                    <TableCell>Loading...</TableCell>
                                </TableBody>
                            ) : (

                                <TableBody>
                                    {selectedMenu ? (selectedMenu.map((menu) => (
                                        <TableRow key={menu.id}>
                                            <TableCell className="hidden sm:table-cell">
                                                <Image
                                                    alt="Product image"
                                                    className="aspect-square rounded-md object-cover"
                                                    height="64"
                                                    src={menu.img}
                                                    width="64"
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{menu.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{menu.status}</Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                RM {menu.price.toFixed(2)}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {menu.soldQuantity}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {format(new Date(menu.createdAt), "yyyy-MM-dd hh:mm:ss")}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Toggle menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => router.push(`/menu/editmenu/${menu.id}`)}>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => onDelete(menu.id)}>Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))) : (
                                        <TableRow>
                                            <TableCell colSpan="8" className="text-center">
                                                No products found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            )}
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}
