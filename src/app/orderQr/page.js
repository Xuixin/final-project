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

export default function OrderTablePage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [tableOrder, setTableOrder] = useState({ inside: [], outside: [] });
    const [qrCodeUrl, setQrCodeUrl] = useState(''); // State to hold QR code URL
    const [selectedTable, setSelectedTable] = useState(null); // Track the selected table for dialog

    const fetchAllTable = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/table/all');
            setTableOrder(response.data);
        } catch (error) {
            toast.error("Failed to fetch table orders");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllTable();
    }, []);

    useEffect(() => {
        console.log('qrCodeUrl', qrCodeUrl);
    }, [qrCodeUrl])

    const generateQRCode = async (tableId) => {
        try {
            const url = await QRCode.toDataURL(`${process.env.NEXT_PUBLIC_WEB_URL}/orderQr/${tableId}`);
            setQrCodeUrl(url);
            setSelectedTable(tableId); // Set the selected table for dialog
        } catch (error) {
            console.error('Error generating QR code:', error);
        }
    };

    return (
        <main className="w-full h-screen">
            <header className='shadow-sm h-10 flex justify-start items-center px-5 bg-white'>
                <span className="">LOGO</span>
            </header>

            <section className='w-full px-5 my-5'>
                <Tabs defaultValue='inside'>
                    <TabsList>
                        <TabsTrigger value='inside'>Inside</TabsTrigger>
                        <TabsTrigger value='outside'>Outside</TabsTrigger>
                    </TabsList>

                    {/* Inside Tables */}
                    <TabsContent value='inside'>
                        <div className='w-full grid grid-cols-3 justify-items-center gap-5 py-10 bg-white rounded-lg min-h-60'>
                            {tableOrder.inside.map((tb) => (
                                <Dialog key={tb.id}>
                                    <DialogTrigger asChild>
                                        <motion.button
                                            whileTap={{ scale: 0.7 }}
                                            transition={{ type: 'spring', damping: 10 }}
                                            onClick={() => generateQRCode(tb.id)} // Only open the dialog after clicking
                                            key={tb.id}
                                            className='w-16 h-16 flex justify-center items-center text-white text-xl font-bold bg-blue-500 rounded-lg hover:bg-blue-600 cursor-pointer'
                                        >
                                            {tb.table_NO}
                                        </motion.button>
                                    </DialogTrigger>

                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>QR Code for Table {tb.table_NO}</DialogTitle>
                                            {/* Add DialogDescription for accessibility */}
                                            <DialogDescription>
                                                Scan this QR code or use the button below to access the table's order page.
                                            </DialogDescription>
                                        </DialogHeader>

                                        <div className='w-full flex justify-center items-center'>
                                            {qrCodeUrl ? (
                                                <Image src={qrCodeUrl} alt={`QR Code for table ${tb.table_NO}`} width={200} height={200} />
                                            ) : (
                                                <p>Generating QR Code...</p>
                                            )}
                                        </div>

                                        <DialogFooter>
                                            <Button onClick={() => window.open(`${process.env.NEXT_PUBLIC_WEB_URL}/orderQr/${tb.id}`, '_blank')}>
                                                Go To Path
                                            </Button>
                                        </DialogFooter>

                                        <DialogFooter className="sm:justify-start">
                                            <DialogClose asChild>
                                                <Button type="button" variant="secondary">
                                                    Close
                                                </Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>


                            ))}
                        </div>
                    </TabsContent>

                    {/* Outside Tables */}
                    <TabsContent value='outside' >
                        <div className='w-full grid grid-cols-3 justify-items-center gap-5 py-10 bg-white rounded-lg min-h-60'>
                            {tableOrder.outside.map((tb) => (
                                <Dialog key={tb.id}>
                                    <DialogTrigger asChild>
                                        <motion.button
                                            whileTap={{ scale: 0.7 }}
                                            transition={{ type: 'spring', damping: 10 }}
                                            onClick={() => generateQRCode(tb.id)} // Only open the dialog after clicking
                                            key={tb.id}
                                            className='w-16 h-16 flex justify-center items-center text-white text-xl font-bold bg-blue-500 rounded-lg hover:bg-blue-600 cursor-pointer'
                                        >
                                            {tb.table_NO}
                                        </motion.button>
                                    </DialogTrigger>

                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>QR Code for Table {tb.table_NO}</DialogTitle>
                                            {/* Add DialogDescription for accessibility */}
                                            <DialogDescription>
                                                Scan this QR code or use the button below to access the table's order page.
                                            </DialogDescription>
                                        </DialogHeader>

                                        <div className='w-full flex justify-center items-center'>
                                            {qrCodeUrl ? (
                                                <Image src={qrCodeUrl} alt={`QR Code for table ${tb.table_NO}`} width={200} height={200} />
                                            ) : (
                                                <p>Generating QR Code...</p>
                                            )}
                                        </div>

                                        <DialogFooter>
                                            <Button onClick={() => window.open(`${process.env.NEXT_PUBLIC_WEB_URL}/orderQr/${tb.id}`, '_blank')}>
                                                Go To Path
                                            </Button>
                                        </DialogFooter>

                                        <DialogFooter className="sm:justify-start">
                                            <DialogClose asChild>
                                                <Button type="button" variant="secondary">
                                                    Close
                                                </Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>



                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </section>
        </main>
    );
}
