import {
    File,
    ListFilter,
    MoreHorizontal,
    PlusCircle,
} from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

// data/products.js
export const products = [
    {
        id: 1,
        image: "/placeholder.svg",
        name: "Laser Lemonade Machine",
        status: "Draft",
        price: "$499.99",
        sales: 25,
        createdAt: "2023-07-12 10:42 AM",
    },
    {
        id: 2,
        image: "/placeholder.svg",
        name: "Hypernova Headphones",
        status: "Active",
        price: "$129.99",
        sales: 100,
        createdAt: "2023-10-18 03:21 PM",
    },
    {
        id: 3,
        image: "/placeholder.svg",
        name: "AeroGlow Desk Lamp",
        status: "Active",
        price: "$39.99",
        sales: 50,
        createdAt: "2023-11-29 08:15 AM",
    },
    {
        id: 4,
        image: "/placeholder.svg",
        name: "TechTonic Energy Drink",
        status: "Draft",
        price: "$2.99",
        sales: 0,
        createdAt: "2023-12-25 11:59 PM",
    },
    {
        id: 5,
        image: "/placeholder.svg",
        name: "Gamer Gear Pro Controller",
        status: "Active",
        price: "$59.99",
        sales: 75,
        createdAt: "2024-01-01 12:00 AM",
    },
    {
        id: 6,
        image: "/placeholder.svg",
        name: "Luminous VR Headset",
        status: "Active",
        price: "$199.99",
        sales: 30,
        createdAt: "2024-02-14 02:14 PM",
    },
];

const TableLoop = ({ products }) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                        <span className="sr-only">Image</span>
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead className="hidden md:table-cell">Price</TableHead>
                    <TableHead className="hidden md:table-cell">Created at</TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map((product) => (
                    <TableRow key={product.id}>
                        <TableCell className="hidden sm:table-cell">
                            <Image
                                alt="Product image"
                                className="aspect-square rounded-md object-cover"
                                height="64"
                                src={product.image}
                                width="64"
                            />
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{product.price}</TableCell>
                        <TableCell className="hidden md:table-cell">{product.price}</TableCell>
                        <TableCell className="hidden md:table-cell">{product.createdAt}</TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <Link href={`admin/addMenu/${product.id}`}><DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem></Link>
                                    <DropdownMenuItem>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};




export default function Admin() {
    return (
        <Tabs defaultValue="all">
            <div className="flex items-center">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="draft">Draft</TabsTrigger>
                    <TabsTrigger value="archived" className="hidden sm:flex">
                        Archived
                    </TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 gap-1">
                                <ListFilter className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Filter
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem checked>
                                Active
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem>
                                Archived
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button size="sm" variant="outline" className="h-8 gap-1">
                        <File className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Export
                        </span>
                    </Button>
                    <Link href={'/admin/addMenu'}>
                        <Button size="sm" className="h-8 gap-1">
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Add Product
                            </span>
                        </Button>
                    </Link>

                </div>
            </div>
            <TabsContent value="all">
                <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                        <CardTitle>Menu</CardTitle>
                        <CardDescription>
                            Manage your products and view their sales performance.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TableLoop products={products} />
                    </CardContent>
                    <CardFooter>
                        <div className="text-xs text-muted-foreground">
                            Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                            products
                        </div>
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    )
}