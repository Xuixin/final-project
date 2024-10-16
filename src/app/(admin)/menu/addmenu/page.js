'use client';
import Image from "next/image";
import {
    ChevronLeft,

} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { CheckboxIdsCom } from "./component/checkbox";
import Link from "next/link";


export default function AllMenu() {
    const { toast } = useToast();
    const router = useRouter();
    const [categories, setCategories] = useState();
    const [discount, setDiscount] = useState();
    const [igd, setIgd] = useState([]);
    const [checkedIds, setCheckedIds] = useState([]);
    const [formValues, setFormValues] = useState({
        name: '',
        category: '',
        price: '',
        status: '',
        discount: '',
        image: null,
    });
    const [imagePreview, setImagePreview] = useState(null);

    const fetchCategories = async () => {
        const response = await axios.get('/api/menutype');
        setCategories(response.data.data);
    };

    const fetchDiscounts = async () => {
        const response = await axios.get('/api/promotion');
        setDiscount(response.data);
    };

    const fetchIngredient = async () => {
        const response = await axios.get('/api/igd');
        setIgd(response.data);
    };

    useEffect(() => {
        fetchCategories();
        fetchDiscounts();
        fetchIngredient();
    }, []);

    useEffect(() => {
        console.log(checkedIds);
        console.log(igd);
    }, [checkedIds, igd])


    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormValues({ ...formValues, [id]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormValues({ ...formValues, image: file });
            setImagePreview(URL.createObjectURL(file)); // Show image preview
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if at least one checkbox is selected
        if (checkedIds.length === 0) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Please select at least one ingredient.',
            });
            return;
        }

        const formData = new FormData();
        formData.append('file', formValues.image);

        try {
            // Upload image first
            const imagePath = await axios.post("http://localhost:3001/api/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-InsertData",
                },
            });

            // Prepare InsertData for menu creation
            const InsertData = {
                name: formValues.name,
                price: parseFloat(formValues.price),
                status: formValues.status,
                discountId: formValues.discount ? parseInt(formValues.discount) : null,
                image: imagePath.data.filePath, // Use image path from the upload response
                category: parseInt(formValues.category),
                ingredientIds: checkedIds, // Include selected ingredients
            };

            // Send InsertData to your API to create menu
            const response = await axios.post('/api/menu', InsertData);
            toast({
                variant: 'success',
                title: 'Success',
                description: 'New menu created successfully',
            });

            // Reset form after submission
            setFormValues({
                name: '',
                category: '',
                price: '',
                status: '',
                discount: '',
                image: null,
            });
            setCheckedIds([]);
            setImagePreview(null);

        } catch (error) {
            console.error('Error creating menu', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to create new menu',
            });
        }
    };

    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <form onSubmit={handleSubmit} className="mx-auto grid min-w-[80%] flex-1 auto-rows-max gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => router.back()}>
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                    <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                        Add Menu
                    </h1>
                    <div className="hidden items-center gap-2 md:ml-auto md:flex">
                        <Link href={'/menu/allmenu'}>
                            <Button variant="outline" size="sm" type="none" >
                                Discard
                            </Button>
                        </Link>
                        <Button size="sm" type="submit">Save Product</Button>
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                    <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Menu Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6">
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
                                    <div className="grid gap-3">
                                        <Label htmlFor="category">Category</Label>
                                        <Select onValueChange={(value) => setFormValues({ ...formValues, category: value })}>
                                            <SelectTrigger id="category" aria-label="Select category">
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

                        <Card>
                            <CardHeader>
                                <CardTitle>Ingredient</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CheckboxIdsCom igd={igd} checkedIds={checkedIds} setCheckedIds={setCheckedIds} />

                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="status">Status</Label>
                                        <Select onValueChange={(value) => setFormValues({ ...formValues, status: value })}>
                                            <SelectTrigger id="status" aria-label="Select status">
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Draft">Draft</SelectItem>
                                                <SelectItem value="Published">Published</SelectItem>
                                                <SelectItem value="Archived">Archived</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="discount">Discount</Label>
                                        <Select onValueChange={(value) => setFormValues({ ...formValues, discount: value })}>
                                            <SelectTrigger id="discount" aria-label="Select discount">
                                                <SelectValue placeholder="Select Discount" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {discount && discount.map((dc) => (
                                                    <SelectItem key={dc.id} value={dc.id}>
                                                        {dc.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="image">Image</Label>
                                        <div className="flex items-center space-x-4">
                                            <Input
                                                type="file"
                                                id="image"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                            {imagePreview && <Image src={imagePreview} alt="Image preview" width={100} height={100} />}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </main>
    );
}
