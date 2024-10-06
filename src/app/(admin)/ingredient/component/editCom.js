'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useState, useEffect } from 'react'
import axios from "axios"

export function EditIngredient({ fetch, igd_id, set }) {
    const { toast } = useToast();
    const [isLoading, setIsloading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        min_quantity: 0,
        unit: ''
    });



    const fetchIGD = async () => {
        if (!igd_id) return; // Ensure igd_id is provided
        try {
            const response = await axios.get(`/api/igd/${igd_id}`);
            setFormData({
                name: response.data.name,
                min_quantity: response.data.min_quantity,
                unit: response.data.unit
            });
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error',
                description: 'Failed to fetch ingredient details.',
                variant: 'destructive',
            });
        }
    }

    useEffect(() => {
        fetchIGD();
    }, [igd_id, fetch]);



    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            unit: value
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setIsloading(true); // Set loading state
        try {
            await axios.put(`/api/igd/${igd_id}`, formData);
            toast({
                variant: 'success',
                title: 'Ingredient updated.',
                description: 'The ingredient was successfully updated.',
            });
            fetch(); // Refresh the ingredient list
            setIsloading(false); // Reset loading state
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error',
                description: 'Failed to update ingredient.',
                variant: 'destructive',
            });
        } finally {
            setIsloading(false); // Reset loading state
            set(null)
        }
    };



    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Edit Ingredient</DialogTitle>
                <DialogDescription>
                    Click save when you're done.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={onSubmit} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input
                        name='name'
                        className="col-span-3"
                        value={formData.name}
                        onChange={onChange}
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="min_quantity" className="text-right">Min quantity</Label>
                    <Input
                        step='0.01'
                        name='min_quantity'
                        type="number"
                        className="col-span-3"
                        value={formData.min_quantity}
                        onChange={onChange}
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="unit" className="text-right">Unit</Label>
                    <Select onValueChange={handleSelectChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a unit" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Unit</SelectLabel>
                                <SelectItem value="gram(g)">gram(g)</SelectItem>
                                <SelectItem value="milligram(mg)">milligram(mg)</SelectItem>
                                <SelectItem value="kilogram(kg)">kilogram(kg)</SelectItem>
                                <SelectItem value="milliliter(ml)">milliliter(ml)</SelectItem>
                                <SelectItem value="ชิ้น">ชิ้น</SelectItem>
                                <SelectItem value="ส่วน">ส่วน</SelectItem>
                                <SelectItem value="ลูก">ลูก</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save changes'}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
}
