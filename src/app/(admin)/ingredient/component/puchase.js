import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";



export const Receipt = () => {
    const printRef = useRef();
    const { toast } = useToast();
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
    const [formPurchase, setFormPurchase] = useState({
        amount: 0,
        category: 'ingredient',
        description: null,

    })

    const fetchPuchase = async () => {
        await axios.get('/api/igd/puchase')
            .then((response) => {
                setPurchase(response.data);
                setUpdatedPurchase(response.data.map((p, index) => {
                    console.log(index, p);
                    return ({ ...p, newValue: p.puchase })
                }));
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {

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
            handlePurchaseSubmit();
        }
    };

    const handlePurchaseSubmit = () => {
        //
        console.log('form', formPurchase);
        console.log('ingredient', updatedPurchase);

        try {
            axios.post('/api/expense/purchase', { expense: formPurchase, expense_details: updatedPurchase })
                .then((response) => {
                    toast({
                        variant: 'success',
                        title: 'บันท��กการ��ื้อวัตถุดิบสำเร็จ',
                        description: 'การ��ื้อวัตถุดิบที่เลือกสำเร็จแล้ว'
                    });
                    setFormPurchase({ amount: 0, category: 'ingredient', description: null });
                    setUpdatedPurchase([]);
                    setIsAlertOpen(false);
                    fetchPuchase();
                })

        } catch (error) {
            console.error("error", error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'เกิดข้อ��ิดพลา��ในการบันท��กการ��ื้อวัตถุดิบ'
            })
            return;

        }
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
                        <div className="flex space-x-2">
                            <Input
                                type="number"
                                placeholder="Enter purchase price"
                                value={formPurchase.amount}
                                onChange={(e) =>
                                    setFormPurchase({ ...formPurchase, amount: e.target.value })
                                }
                                className='w-[70%]'
                            />
                            <Input
                                type="text"
                                value={formPurchase.category}
                                disabled
                                className={'w-[30%]'}
                            />




                        </div>
                    </DialogHeader>
                    <ScrollArea className="grid gap-4 py-4 h-[532px]">
                        {updatedPurchase.map((p) => (
                            <div className="grid grid-cols-4 items-center gap-4 py-2" key={p.id}>
                                <Label htmlFor="name" className="text-right">
                                    {p.name}
                                    <span className="text-red-400">
                                        {`(${p.quantity})`}
                                    </span>
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
                    </ScrollArea>
                    <DialogFooter>
                        <Button variant='outline' className='flex-1' onClick={handleConfirm}>
                            submit
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
                        <AlertDialogAction onClick={handlePurchaseSubmit}>ยืนยัน</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
