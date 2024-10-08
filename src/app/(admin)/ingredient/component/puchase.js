import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ReceiptText } from "lucide-react";
import axios from "axios";
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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export const Receipt = () => {
    const printRef = useRef();
    const [purchase, setPurchase] = useState([]);
    const [updatedPurchase, setUpdatedPurchase] = useState([]);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    useEffect(() => {
        const fetchPuchase = async () => {
            await axios.get('/api/igd/puchase')
                .then((response) => {
                    setPurchase(response.data);
                    setUpdatedPurchase(response.data.map(p => ({ ...p, newValue: p.puchase })));
                })
                .catch((error) => {
                    console.error(error);
                });
        };
        fetchPuchase();
    }, []);

    const handleUpdateValue = (id, value) => {
        setUpdatedPurchase(prev =>
            prev.map(p => (p.id === id ? { ...p, newValue: value } : p))
        );
    };

    const handleConfirm = () => {
        const hasLowerValue = updatedPurchase.some(p => p.newValue < p.puchase);

        if (hasLowerValue) {
            setAlertMessage("พบค่าที่น้อยกว่าค่าขั้นต่ำของวัตถุดิบ กรุณายืนยันการเปลี่ยนแปลง");
            setIsAlertOpen(true);
        } else {
            receipt();
        }
    };

    const receipt = () => {
        const printContent = printRef.current.innerHTML;
        const printWindow = window.open("", "", "width=400");

        printWindow.document.write(`
            <html>
                <head>
                    <title>Receipt</title>
                    <style>
                        body {
                            font-family: 'Courier New', Courier, monospace;
                            padding: 20px;
                        }
                        h1 {
                            text-align: center;
                            font-size: 24px;
                            margin-bottom: 20px;
                        }
                        .info {
                            display: flex;
                            justify-content: space-between;
                            margin : 0 auto;
                        }
                        hr {
                            border: none;
                            border-top: 1px dashed black;
                            margin: 20px 0;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-bottom: 20px;
                        }
                        td {
                            padding: 5px 0;
                        }
                        .total-section {
                            margin-top: 20px;
                        }
                        .thankyou {
                            text-align: center;
                            margin-top: 30px;
                            font-size: 20px;
                        }
                    </style>
                </head>
                <body>
                    ${printContent}
                </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div>
            <div ref={printRef} style={{ width: "300px", margin: "0 auto", padding: "20px", border: "1px solid black" }} className='hidden'>
                <h1>Ingredient to Purchase</h1>

                <table>
                    <tbody>
                        <tr>
                            <td>Date</td>
                            <td style={{ textAlign: "right" }}>{formattedDate}</td>
                        </tr>
                    </tbody>
                </table>

                <hr />

                <table>
                    <tbody>
                        {updatedPurchase && updatedPurchase.length > 0 &&
                            updatedPurchase.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.name}</td>
                                    <td style={{ textAlign: "right" }}>{p.newValue}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

                <hr />
            </div>

            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">Purchase</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Purchase</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {updatedPurchase.map((p) => (
                            <div className="grid grid-cols-4 items-center gap-4 " key={p.id}>
                                <Label htmlFor="name" className="text-right">
                                    {p.name}
                                </Label>
                                <div className='w-full flex col-span-3'>
                                    <Input
                                        id="number"
                                        type="number"
                                        value={p.newValue}
                                        onChange={(e) => handleUpdateValue(p.id, e.target.value)}
                                        className="col-span-3 w-[80%]"
                                    />
                                    <Input
                                        id="unit"
                                        type="text"
                                        disabled
                                        value={p.unit}
                                        className="col-span-3 w-[20%]"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button variant='outline' className='flex-1' onClick={handleConfirm}>
                            Show Ingredient to Purchase
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* AlertDialog */}
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>แจ้งเตือน</AlertDialogTitle>
                        <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction onClick={receipt}>ยืนยัน</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
