'use client'
import {
    ChevronLeft,
    Trash
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from "next/link"

export default function AddMenuSet() {
    const { toast } = useToast()
    const router = useRouter()
    const [menus, setMenus] = useState([])
    const [formValues, setFormValues] = useState({
        name: '',
        totalMenu: 0,
        price: 0,
        status: '',
        menu: []
    })

    const [menuForm, setMenuForm] = useState({
        id: '',
        quantity: 0
    })

    const fetchMenu = async () => {
        try {
            const response = await axios.get('/api/menu')
            const allMenu = response.data
            // filter เมนูที่มีสถานะ Published
            const publishedMenu = allMenu.filter((menu) => menu.status === 'Published')
            setMenus(publishedMenu)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchMenu()
    }, [])

    useEffect(() => {
        console.log(menus);
    }, [menus])

    const addMenuIntoSet = (e) => {
        e.preventDefault(); // ป้องกันไม่ให้ส่งฟอร์มเมื่อกดปุ่ม Add
        const menu = menus.find((m) => m.id === parseInt(menuForm.id))
        if (menu) {
            const exitingMenu = formValues.menu.find((m) => m.id == menu.id)
            if (exitingMenu) {
                exitingMenu.quantity += parseInt(menuForm.quantity)
            } else {
                formValues.menu.push({ ...menu, quantity: parseInt(menuForm.quantity) })
            }
            setFormValues({ ...formValues }) // เพื่ออัปเดต state หลังจากเพิ่มเมนู
        } else {
            toast({
                variant: 'destructive',
                title: "Menu not found!",
                description: "Menu not found!"
            })
        }
    }

    const removeMenuFromSet = (menuId) => {
        setFormValues(prevFormValues => ({
            ...prevFormValues,
            menu: prevFormValues.menu.filter(menu => menu.id !== menuId)
        }));
    }


    const handleInputChange = (e) => {
        const { id, value } = e.target
        setFormValues({ ...formValues, [id]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // คำนวณ totalMenu ก่อน
        const totalMenu = formValues.menu.reduce((total, menu) => total + menu.quantity, 0)

        // สร้างตัวแปรใหม่เพื่อเก็บค่าที่อัปเดตแล้ว
        const newFormValues = {
            ...formValues,
            totalMenu
        }

        try {
            // ใช้ newFormValues ในการส่งค่า
            await axios.post('/api/menuset', newFormValues)

            toast({
                variant: 'success',
                title: "Menuset created successfully!",
                description: "Menuset created successfully!"
            })
            router.push('/menuset/allmenuset')
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Menu not found!",
                description: "Menu not found!"
            })
        }
    }


    // ... (keeping all the existing functions unchanged)

    return (
        <main className="min-h-screen bg-gray-50/50 p-6">
            <form onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
                    <Link href="/menuset/allmenuset">
                        <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-gray-100">
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Back</span>
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Add Menu Set
                    </h1>
                    <div className="hidden md:flex items-center gap-3 ml-auto">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push('/menuset/allmenuset')}
                            className="hover:bg-gray-100"
                        >
                            Discard
                        </Button>
                        <Button
                            size="sm"
                            type="submit"

                        >
                            Save Set
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="pt-6">
                                <div className="grid gap-6 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="menu" className="text-sm font-medium text-gray-700">Menu</Label>
                                        <Select onValueChange={(value) => setMenuForm({ ...menuForm, id: value })}>
                                            <SelectTrigger id="discount" className="w-full">
                                                <SelectValue placeholder="Select Menu" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="null">None</SelectItem>
                                                {menus?.map((menu) => (
                                                    <SelectItem key={menu.id} value={menu.id}>
                                                        {menu.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">Quantity</Label>
                                        <Input
                                            type="number"
                                            id="quantity"
                                            className="w-full"
                                            onChange={(e) => setMenuForm({ ...menuForm, quantity: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <Button
                                            onClick={addMenuIntoSet}
                                            className=" md:w-auto"
                                        >
                                            Add Menu
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                            <CardHeader className="border-b bg-gray-50/50">
                                <CardTitle className="text-lg font-semibold">Menu Set Details</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {menus.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-50/50">
                                                <TableHead className="w-16 font-semibold">#</TableHead>
                                                <TableHead className="font-semibold">Menu name</TableHead>
                                                <TableHead className="font-semibold">Quantity</TableHead>
                                                <TableHead className="text-right font-semibold">Amount</TableHead>
                                                <TableHead className="text-center w-20">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {formValues.menu.map((menu, index) => (
                                                <TableRow key={menu.id} className="hover:bg-gray-50">
                                                    <TableCell className="text-gray-600">{index + 1}</TableCell>
                                                    <TableCell className="font-medium">{menu.name}</TableCell>
                                                    <TableCell>{menu.quantity}</TableCell>
                                                    <TableCell className="text-right">฿{menu.price * menu.quantity}</TableCell>
                                                    <TableCell className="text-center">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeMenuFromSet(menu.id)}
                                                            className="hover:bg-red-50 hover:text-red-600"
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow className="bg-gray-50 font-semibold">
                                                <TableCell colSpan={2}></TableCell>
                                                <TableCell>Total</TableCell>
                                                <TableCell className="text-right">
                                                    ฿{formValues.menu.reduce((total, menu) => total + (menu.price * menu.quantity), 0)}
                                                </TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        No menu items added yet
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="shadow-sm">
                            <CardHeader className="border-b bg-gray-50/50">
                                <CardTitle>Status</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-2">
                                    <Label htmlFor="status" className="text-sm font-medium text-gray-700">Set Status</Label>
                                    <Select onValueChange={(value) => setFormValues({ ...formValues, status: value })}>
                                        <SelectTrigger id="status" className="w-full">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Draft">Draft</SelectItem>
                                            <SelectItem value="Published">Published</SelectItem>
                                            <SelectItem value="Archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                            <CardHeader className="border-b bg-gray-50/50">
                                <CardTitle>Description</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name</Label>
                                        <Input
                                            type="text"
                                            id="name"
                                            value={formValues.name}
                                            onChange={handleInputChange}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="price" className="text-sm font-medium text-gray-700">Price</Label>
                                        <Input
                                            type="number"
                                            id="price"
                                            value={formValues.price}
                                            onChange={handleInputChange}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-3 md:hidden">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.back()}
                        className="w-full"
                    >
                        Discard
                    </Button>
                    <Button
                        size="sm"
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                        Save Set
                    </Button>
                </div>
            </form>
        </main>
    )
}