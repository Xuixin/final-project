"use client"
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axios from 'axios'
import { format } from 'date-fns'


export default function Customer() {
    const [isLoading, setIsLoading] = useState(false)
    const [users, setUsers] = useState([])

    const fetchUser = async () => {
        setIsLoading(true)
        const response = await axios.get('/api/customer')
        setUsers(response.data)
        setIsLoading(false)
    }

    useEffect(() => {
        fetchUser()
    }, [])


    return (
        <div className="flex flex-col gap-6">

            <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                    <CardTitle>Customer</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>NO. </TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>address</TableHead>
                                <TableHead>email</TableHead>
                                <TableHead className="hidden md:table-cell">tel</TableHead>
                                <TableHead className="hidden md:table-cell">Created at</TableHead>
                            </TableRow>
                        </TableHeader>
                        {isLoading ? (
                            <TableBody className="flex items-center justify-center w-full min-h-10">
                                <TableCell>Loading...</TableCell>
                            </TableBody>
                        ) : (

                            <TableBody>
                                {users.map((user, index) => {
                                    return (
                                        <TableRow>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{user.name}  {user.lastname}</TableCell>
                                            <TableCell>{user.address || <span className="bg-gray-100">null</span>}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.tel || <span className="bg-gray-100">null</span>}</TableCell>
                                            <TableCell>{format(user.createdAt, 'MMM dd yyyy')}</TableCell>
                                        </TableRow>
                                    )
                                })}


                            </TableBody>
                        )}
                    </Table>
                </CardContent>
            </Card>

        </div>
    );
};