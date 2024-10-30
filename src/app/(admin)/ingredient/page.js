'use client'

import { useState, useEffect } from 'react'
import axios from "axios"
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search, Printer, Edit, Trash2 } from "lucide-react"
import { EditIngredient } from "./component/editCom"
import { AddIngredient } from "./component/inputCom"
import { Receipt } from "./component/puchase"
import { PrintIgd } from "./component/printIgd"

export default function Ingredient() {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [igd, setIgd] = useState([])
    const [selectedId, setSelectedId] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')

    const fetchIgd = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get('/api/igd')
            setIgd(response.data)
        } catch (error) {
            console.error(error)
            toast({
                title: 'เกิดข้อผิดพลาด',
                description: 'ไม่สามารถดึงข้อมูลวัตถุดิบได้',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchIgd()
    }, [])

    const handleEditClick = (id) => {
        setSelectedId(id)
    }

    const onDelete = async (id) => {
        if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบวัตถุดิบนี้?')) {
            try {
                await axios.delete(`/api/igd/${id}`)
                toast({
                    title: 'ลบสำเร็จ',
                    description: 'ลบวัตถุดิบเรียบร้อยแล้ว',
                    variant: 'success',
                })
                fetchIgd()
            } catch (error) {
                console.error(error)
                toast({
                    title: 'เกิดข้อผิดพลาด',
                    description: 'ไม่สามารถลบวัตถุดิบได้',
                    variant: 'destructive',
                })
            }
        }
    }

    const filteredIgd = igd.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">จัดการวัตถุดิบ</CardTitle>
                <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                        <PrintIgd />
                        <Receipt />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Input
                            placeholder="ค้นหาวัตถุดิบ"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size="sm">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    เพิ่มวัตถุดิบ
                                </Button>
                            </DialogTrigger>
                            <AddIngredient fetch={fetchIgd} />
                        </Dialog>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">ลำดับ</TableHead>
                            <TableHead>ชื่อวัตถุดิบ</TableHead>
                            <TableHead>ปริมาณขั้นต่ำ</TableHead>
                            <TableHead className="hidden md:table-cell">ปริมาณคงเหลือ</TableHead>
                            <TableHead className="hidden md:table-cell">ใช้ในเมนู</TableHead>
                            <TableHead className="text-right">จัดการ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    <div className="flex justify-center items-center h-40">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredIgd.length > 0 ? (
                            filteredIgd.map((i, index) => (
                                <TableRow key={i.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-medium">{i.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{i.min_quantity} {i.unit}</Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {i.quantity} {i.unit}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {i._count.menurecipes} เมนู
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Dialog open={selectedId === i.id} onOpenChange={(open) => {
                                            if (!open) setSelectedId(null);
                                        }}>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="sm" onClick={() => handleEditClick(i.id)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <EditIngredient fetch={fetchIgd} igd_id={selectedId} set={setSelectedId} />
                                        </Dialog>
                                        <Button variant="ghost" size="sm" onClick={() => onDelete(i.id)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10">
                                    ไม่พบข้อมูลวัตถุดิบ
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}