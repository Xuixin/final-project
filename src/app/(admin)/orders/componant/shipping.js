'use client'
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogContent,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

export function Shipping({ orderId, fetchOrders }) {
    const { toast } = useToast()
    const [shipper, setShipper] = useState([]);
    const [selectedShipper, setSelectedShipper] = useState(""); // เก็บค่าที่เลือก
    const [loading, setLoading] = useState(false); // เพื่อใช้แสดงสถานะการโหลด
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchShippers = async () => {
            try {
                const response = await axios.get('/api/employee/shipper');
                setShipper(response.data);
            } catch (err) {
                setError('Failed to fetch shippers');
            }
        };

        fetchShippers();
    }, []);

    useEffect(() => {
        console.log(selectedShipper);
    }, [selectedShipper])

    const handleSubmit = async () => {
        setLoading(true);
        setError(null); // รีเซ็ต error ก่อนเริ่มการส่งข้อมูล
        try {
            await axios.put(`/api/shipping/${orderId}`, { status: 'Shipped', employeeId: selectedShipper })

            toast({
                variant: "success",
                title: "Shipping status updated successfully",
                description: "Shipping status updated successfully",
            });

        } catch (err) {
            console.error(err);
            setError("Failed to update shipping status");
        } finally {
            fetchOrders()
            setLoading(false);
        }
    };

    return (
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Choose Shipper</DialogTitle>
            </DialogHeader>
            <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                    <Select onValueChange={(value) => setSelectedShipper(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a shipper" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Shipper</SelectLabel>
                                {shipper.map((shp) => (
                                    <SelectItem key={shp.id} value={shp.id} >
                                        {shp.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <DialogFooter className="sm:justify-start">
                <Button
                    type="button"
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={loading || !selectedShipper} // ปิดปุ่มถ้ายังไม่ได้เลือก shipper หรือกำลังโหลด
                >
                    {loading ? "Updating..." : "Confirm"}
                </Button>
                <Button type="button" variant="secondary">
                    Close
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}


