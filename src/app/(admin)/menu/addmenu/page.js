'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ImagePlus, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
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
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { CheckboxIdsCom } from "./component/checkbox";
import axios from "axios";

export default function AllMenu() {
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [discount, setDiscount] = useState([]);
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, discountsRes, igdRes] = await Promise.all([
                    axios.get('/api/menutype'),
                    axios.get('/api/promotion'),
                    axios.get('/api/igd')
                ]);

                setCategories(categoriesRes.data.data);
                setDiscount(discountsRes.data);
                setIgd(igdRes.data);
            } catch (error) {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Failed to load initial data'
                });
            }
        };

        fetchData();
    }, [toast]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormValues(prev => ({ ...prev, [id]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Image size must be less than 5MB'
                });
                return;
            }
            setFormValues(prev => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (checkedIds.length === 0) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Please select at least one ingredient.'
            });
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('file', formValues.image);

        try {
            const imagePath = await axios.post("http://localhost:3001/api/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const menuData = {
                name: formValues.name,
                price: parseFloat(formValues.price),
                status: formValues.status,
                discountId: formValues.discount ? parseInt(formValues.discount) : null,
                image: imagePath.data.filePath,
                category: parseInt(formValues.category),
                ingredientIds: checkedIds,
            };

            await axios.post('/api/menu', menuData);

            toast({
                title: 'Success',
                description: 'Menu created successfully'
            });

            router.push('/menu/allmenu');
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || 'Failed to create menu'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
            <form onSubmit={handleSubmit} className="mx-auto max-w-7xl space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full"
                                        onClick={() => router.back()}
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Go back</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <h1 className="text-2xl font-bold tracking-tight">Add New Menu Item</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/menu/allmenu">
                            <Button variant="outline" className="gap-2">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={isLoading} className="gap-2">
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isLoading ? 'Saving...' : 'Save Menu'}
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Menu Details</CardTitle>
                                <CardDescription>
                                    Enter the basic information about your menu item.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Menu Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Enter menu name"
                                        value={formValues.name}
                                        onChange={handleInputChange}
                                        className="max-w-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                        onValueChange={(value) => setFormValues(prev => ({ ...prev, category: value }))}
                                        value={formValues.category}
                                    >
                                        <SelectTrigger className="max-w-xl">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id.toString()}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        value={formValues.price}
                                        onChange={handleInputChange}
                                        className="max-w-xl"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Ingredients</CardTitle>
                                <CardDescription>
                                    Select ingredients and specify quantities for this menu item.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CheckboxIdsCom
                                    igd={igd}
                                    checkedIds={checkedIds}
                                    setCheckedIds={setCheckedIds}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Menu Status</CardTitle>
                                <CardDescription>
                                    Set the visibility and pricing options for this menu item.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        onValueChange={(value) => setFormValues(prev => ({ ...prev, status: value }))}
                                        value={formValues.status}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Draft">Draft</SelectItem>
                                            <SelectItem value="Published">Published</SelectItem>
                                            <SelectItem value="Archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="discount">Discount</Label>
                                    <Select
                                        onValueChange={(value) => setFormValues(prev => ({ ...prev, discount: value }))}
                                        value={formValues.discount}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select discount" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {discount.map((disc) => (
                                                <SelectItem key={disc.id} value={disc.id.toString()}>
                                                    {disc.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Menu Image</Label>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-4">
                                            <Label
                                                htmlFor="image"
                                                className="flex h-32 w-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-300"
                                            >
                                                {imagePreview ? (
                                                    <Image
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        width={128}
                                                        height={128}
                                                        className="rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <ImagePlus className="h-8 w-8 text-gray-400" />
                                                )}
                                            </Label>
                                            <Input
                                                id="image"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </div>
                                        <Alert>
                                            <AlertTitle>Image Guidelines</AlertTitle>
                                            <AlertDescription>
                                                Upload a clear, high-quality image of your menu item.
                                                Maximum size: 5MB.
                                            </AlertDescription>
                                        </Alert>
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