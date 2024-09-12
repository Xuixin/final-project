'use client'
import Image from "next/image"
import {
    ChevronLeft,
    Upload,
    X
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

export default function EditMenu({ params }) {
    const { id } = params
    const { toast } = useToast()
    const router = useRouter()
    const [categories, setCategories] = useState()
    const [discount, setDiscount] = useState()
    const [formValues, setFormValues] = useState({
        name: '',
        category: '',
        price: '',
        status: '',
        discount: '',
        image: null,
    })
    const [imagePreview, setImagePreview] = useState(null)

    const fetchCategories = async () => {
        const response = await axios.get('/api/menutype')
        setCategories(response.data.data)
    }
    const fetchDiscounts = async () => {
        const response = await axios.get('/api/promotion')
        setDiscount(response.data)
    }

    const fetchMenuWithId = async () => {
        const response = await axios.get(`/api/menu/${id}`)
        console.log(response.data);
        setFormValues({
            name: response.data.name,
            category: response.data.category.id ? response.data.category.id : '',
            price: response.data.price,
            status: response.data.status,
            discount: response.data.discount ? response.data.discount.id : '',
            image: response.data.img,
        })
        setImagePreview(response.data.img) // แสดง preview รูป
    }
    useEffect(() => {
        fetchCategories()
        fetchDiscounts()
        fetchMenuWithId()
    }, [])

    const handleInputChange = (e) => {
        const { id, value } = e.target
        setFormValues({ ...formValues, [id]: value })
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormValues({ ...formValues, image: file })
            setImagePreview(URL.createObjectURL(file)) // แสดง preview รูป
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('file', formValues.image)

        try {
            // Upload image first
            const imagePath = await axios.post("http://localhost:3001/api/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // Prepare data for menu creation
            const data = {
                name: formValues.name,
                price: parseFloat(formValues.price),
                status: formValues.status,
                discountId: formValues.discount ? parseInt(formValues.discount) : null,
                image: imagePath.data.filePath,  // Use image path from the upload response
                category: parseInt(formValues.category),
            }

            // ส่งข้อมูลเพื่ออัปเดตเมนู
            const response = await axios.put(`/api/menu/${id}`, data)
            toast({
                variant: 'success',
                title: 'Success',
                description: 'Menu updated successfully',
            })

        } catch (error) {
            console.error('Error updating menu', error)
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to update menu',
            })
        }
    }



    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <form onSubmit={handleSubmit} className="mx-auto grid min-w-[80%]  flex-1 auto-rows-max gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => router.back()}>
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                    <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                        Edit Menu
                    </h1>
                    <div className="hidden items-center gap-2 md:ml-auto md:flex">
                        <Button variant="outline" size="sm" onClick={() => router.push('/menu/allmenu')}>
                            Discard
                        </Button>
                        <Button size="sm" type="submit">Save Product</Button>
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                    <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                        <Card x-chunk="dashboard-07-chunk-0">
                            <CardHeader>
                                <CardTitle>Menu Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6">
                                    {/* name */}
                                    <div className="grid gap-3">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            className="w-full"
                                            value={formValues.name}
                                            placeholder="Menu Name"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    {/* category */}
                                    <div className="grid gap-3">
                                        <Label htmlFor="category">Category</Label>
                                        <Select onValueChange={(value) => setFormValues({ ...formValues, category: value })}>
                                            <SelectTrigger
                                                id="category"
                                                aria-label="Select category"

                                            >
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories && categories.map((ct) => (
                                                    <SelectItem key={ct.id} value={ct.id}>
                                                        {ct.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="price">Price</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            className="w-full"
                                            value={formValues.price}
                                            placeholder="Price"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card x-chunk="dashboard-07-chunk-2">
                            <CardHeader>
                                <CardTitle>Product Option</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6 ">
                                    <div className="grid gap-3 ">
                                        <Label htmlFor="discount">Discount</Label>
                                        <Select onValueChange={(value) => setFormValues({ ...formValues, discount: value })}>
                                            <SelectTrigger
                                                id="discount"
                                                aria-label="Select discount"
                                            >
                                                <SelectValue placeholder="Select Discount" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="null">none</SelectItem>
                                                {discount && discount.map((dc) => (
                                                    <SelectItem key={dc.id} value={dc.id}>
                                                        {dc.discount}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                        <Card x-chunk="dashboard-07-chunk-3">
                            <CardHeader>
                                <CardTitle>Product Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="status">Status</Label>
                                        <Select onValueChange={(value) => setFormValues({ ...formValues, status: value })}>
                                            <SelectTrigger id="status" aria-label="Select status">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Draft">Draft</SelectItem>
                                                <SelectItem value="Published">Published</SelectItem>
                                                <SelectItem value="Archived">Archived</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
                            <CardHeader>
                                <CardTitle>Product Images</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-2">
                                    {imagePreview ? (
                                        <div className="relative">
                                            <Button variant='outline' className="absolute top-0 right-0" onClick={() => setImagePreview(null)}>
                                                <X className="h-4 w-4 text-gray-500" />
                                            </Button>
                                            <Image
                                                alt="Product image"
                                                className="aspect-square w-full rounded-md object-cover"
                                                height="300"
                                                src={formValues.image}
                                                width="300"
                                            />
                                        </div>
                                    ) : (
                                        <div className="aspect-square w-full rounded-md bg-gray-100 flex items-center justify-center text-gray-500">
                                            No Image
                                        </div>
                                    )}
                                    <div className="grid grid-cols-3 gap-2">
                                        <input
                                            type="file"
                                            id="image"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <label htmlFor="image" className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed cursor-pointer">
                                            <Upload className="h-4 w-4 text-muted-foreground" />
                                            <span className="sr-only">Upload</span>
                                        </label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-2 md:hidden">
                    <Button variant="outline" size="sm" onClick={() => router.back()}>
                        Discard
                    </Button>
                    <Button size="sm" type="submit">Save Product</Button>
                </div>
            </form>
        </main>
    )
}
