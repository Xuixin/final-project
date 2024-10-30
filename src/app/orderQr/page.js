'use client';

import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useState, useEffect } from "react";
import QRCode from 'qrcode';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import Image from "next/image";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Store, Compass, QrCode } from "lucide-react";

export default function OrderTablePage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [tableOrder, setTableOrder] = useState({ inside: [], outside: [] });
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [selectedTable, setSelectedTable] = useState(null);

    const fetchAllTable = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/table/all');
            setTableOrder(response.data);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch table orders"
            });
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllTable();
    }, []);

    const generateQRCode = async (tableId) => {
        try {
            const url = await QRCode.toDataURL(`${process.env.NEXT_PUBLIC_WEB_URL}/orderQr/${tableId}`);
            setQrCodeUrl(url);
            setSelectedTable(tableId);
        } catch (error) {
            console.error('Error generating QR code:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to generate QR code"
            });
        }
    };

    const TableButton = ({ table }) => (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={() => generateQRCode(table.id)}
            className={`
                w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32
                flex flex-col justify-center items-center
                rounded-xl shadow-lg
                ${table.status === 'available'
                    ? 'bg-white border-2 border-primary text-primary hover:bg-primary/5'
                    : 'bg-primary text-white hover:bg-primary/90'}
                transition-colors duration-200
            `}
        >
            <span className="text-3xl font-bold mb-2">{table.table_NO}</span>
            <span className="text-xs capitalize">{table.status}</span>
        </motion.button>
    );

    const LoadingSkeleton = () => (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-xl" />
            ))}
        </div>
    );

    return (
        <main className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <span className="text-xl font-bold text-primary">LOGO</span>
                        <Button
                            variant="outline"
                            className="hidden sm:flex items-center gap-2"
                            onClick={fetchAllTable}
                        >
                            <QrCode className="w-4 h-4" />
                            Refresh Tables
                        </Button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Tabs defaultValue="inside" className="bg-white rounded-xl shadow-sm p-6">
                    <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                        <TabsTrigger value="inside" className="flex items-center gap-2">
                            <Store className="w-4 h-4" />
                            Inside
                        </TabsTrigger>
                        <TabsTrigger value="outside" className="flex items-center gap-2">
                            <Compass className="w-4 h-4" />
                            Outside
                        </TabsTrigger>
                    </TabsList>

                    {isLoading ? (
                        <LoadingSkeleton />
                    ) : (
                        <>
                            <TabsContent value="inside">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="grid grid-cols-2 justify-items-center sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
                                >
                                    {tableOrder.inside.map((table) => (
                                        <Dialog key={table.id}>
                                            <DialogTrigger asChild>
                                                <div>
                                                    <TableButton table={table} />
                                                </div>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle>Table {table.table_NO} QR Code</DialogTitle>
                                                    <DialogDescription>
                                                        Scan this QR code or use the button below to access the table's order page
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="flex flex-col items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                                    {qrCodeUrl ? (
                                                        <div className="p-4 bg-white rounded-lg shadow-sm">
                                                            <Image
                                                                src={qrCodeUrl}
                                                                alt={`QR Code for table ${table.table_NO}`}
                                                                width={200}
                                                                height={200}
                                                                className="rounded-lg"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <Skeleton className="w-[200px] h-[200px]" />
                                                        </div>
                                                    )}
                                                </div>
                                                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                                                    <Button
                                                        className="flex-1"
                                                        onClick={() => window.open(`http://localhost:3000/orderQr/${table.id}`, '_blank')}
                                                    >
                                                        Open Order Page
                                                    </Button>
                                                    <DialogClose asChild>
                                                        <Button type="button" variant="outline" className="flex-1">
                                                            Close
                                                        </Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    ))}
                                </motion.div>
                            </TabsContent>

                            <TabsContent value="outside">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
                                >
                                    {tableOrder.outside.map((table) => (
                                        <Dialog key={table.id}>
                                            <DialogTrigger asChild>
                                                <div>
                                                    <TableButton table={table} />
                                                </div>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle>Table {table.table_NO} QR Code</DialogTitle>
                                                    <DialogDescription>
                                                        Scan this QR code or use the button below to access the table's order page
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="flex flex-col items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                                    {qrCodeUrl ? (
                                                        <div className="p-4 bg-white rounded-lg shadow-sm">
                                                            <Image
                                                                src={qrCodeUrl}
                                                                alt={`QR Code for table ${table.table_NO}`}
                                                                width={200}
                                                                height={200}
                                                                className="rounded-lg"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <Skeleton className="w-[200px] h-[200px]" />
                                                        </div>
                                                    )}
                                                </div>
                                                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                                                    <Button
                                                        className="flex-1"
                                                        onClick={() => window.open(`${process.env.NEXT_PUBLIC_WEB_URL}/orderQr/${table.id}`, '_blank')}
                                                    >
                                                        Open Order Page
                                                    </Button>
                                                    <DialogClose asChild>
                                                        <Button type="button" variant="outline" className="flex-1">
                                                            Close
                                                        </Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    ))}
                                </motion.div>
                            </TabsContent>
                        </>
                    )}
                </Tabs>
            </div>
        </main>
    );
}