'use client'

// Import ui components
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import {
    Dialog,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState, useEffect } from 'react'
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"

// Import component
import { EditIngredient } from "./component/editCom"
import { AddIngredient } from "./component/inputCom"

export default function Ingredient() {
    const { toast } = useToast()
    const [isLoading, setIsloading] = useState(false)
    const [igd, setIgd] = useState([])
    const [selectedId, setSelectedId] = useState(null); // State to track selected ingredient ID

    const fetchIgd = async () => {
        setIsloading(true)
        try {
            const response = await axios.get('/api/igd')
            setIgd(response.data)
        } catch (error) {
            console.error(error)
            toast({
                title: 'Error',
                description: 'Failed to fetch ingredients.',
                variant: 'destructive',
            });
        } finally {
            setIsloading(false)
        }
    }

    useEffect(() => {
        fetchIgd()
    }, [])

    useEffect(() => {
        console.log(igd);
    }, [igd]);

    const handleEditClick = (id) => {
        setSelectedId(id); // Set the selected ID when edit button is clicked
    };

    const onDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this ingredient?')) {
            try {
                await axios.delete(`/api/igd/${id}`)
                toast({
                    title: 'Deleted',
                    description: 'Ingredient deleted successfully.',
                    variant: 'success',
                });
                // Refresh ingredient list
                fetchIgd()
            } catch (error) {
                console.error(error)
                toast({
                    title: 'Error',
                    description: 'Failed to delete ingredient.',
                    variant: 'destructive',
                });
            }
        }
    }



    return (
        <Tabs defaultValue="all">
            <div className="flex items-center">
                <div className="ml-auto flex items-center gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size='sm' className="h-8 gap-1">
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Add Ingredient
                                </span>
                            </Button>
                        </DialogTrigger>
                        <AddIngredient fetch={fetchIgd} />
                    </Dialog>
                </div>
            </div>
            <TabsContent value='all'>
                <Card>
                    <CardHeader>
                        <CardTitle>Ingredient</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="hidden w-[100px] sm:table-cell">
                                        <span className="sr-only">#</span>
                                    </TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Min quantity</TableHead>
                                    <TableHead className="hidden md:table-cell">Quantity</TableHead>
                                    <TableHead className="hidden md:table-cell">Recipes Use</TableHead>
                                    <TableHead>
                                        Edit
                                    </TableHead>
                                    <TableHead>
                                        Delete
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            {isLoading ? (
                                <TableBody className="flex items-center justify-center w-full min-h-10">
                                    <TableRow>
                                        <TableCell colSpan="5" className="text-center">Loading...</TableCell>
                                    </TableRow>
                                </TableBody>
                            ) : (
                                <TableBody>
                                    {igd.length > 0 ? (
                                        igd.map((i, index) => (
                                            <TableRow key={i.id}>
                                                <TableCell className="font-medium">{index + 1}</TableCell>
                                                <TableCell className="font-medium">{i.name}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{i.min_quantity + ' ' + i.unit}</Badge>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    {i.quantity + ' ' + i.unit}
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    {i._count.menurecipes} menu
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <Dialog open={selectedId === i.id} onOpenChange={(open) => {
                                                        if (!open) setSelectedId(null); // Reset selectedId when dialog closes
                                                    }}>
                                                        <DialogTrigger asChild>
                                                            <Button variant={'warning'} onClick={() => handleEditClick(i.id)}>Edit</Button>
                                                        </DialogTrigger>
                                                        <EditIngredient fetch={fetchIgd} igd_id={selectedId} set={setSelectedId} />
                                                    </Dialog>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <Button variant={'destructive'} onClick={() => onDelete(i.id)}>Delete</Button>
                                                </TableCell>


                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan="5" className="text-center">
                                                No Ingredient found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            )}
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}
