"use client";

// import ui
import { File, ListFilter, MoreHorizontal, PlusCircle, DeleteIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

//import dependency
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

//import componant
import Selectpath from "@/components/select";


const TableLoop = ({ products, handleDelete }) => {
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
          <TableHead className="hidden md:table-cell">Discount</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.length > 0 ? (
          products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="hidden sm:table-cell">
                <Image
                  alt="Product image"
                  className="aspect-square rounded-md object-cover"
                  height="64"
                  src={product.img}
                  width="64"
                />
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell className="hidden md:table-cell">
                {product.category.name}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                RM {product.price.toFixed(2)}
              </TableCell>
              <TableCell className="hidden md:table-cell text-red-500">
                {product.discount ? (
                  `RM ${product.discount.discount.toFixed(2)} off`
                ) : (
                  "0"
                )}
              </TableCell>
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
                    <Link href={`admin/addMenu/${product.id}`}>
                      <DropdownMenuItem className="cursor-pointer">
                        Edit
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan="6" className="text-center py-4">
              No products found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};


export default function Admin() {
  const path = usePathname();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get("/api/menu");
        setProducts(response.data.data);
        setFilteredProducts(response.data.data); // ตั้งค่าครั้งแรกให้กรองทั้งหมด
      } catch (error) {
        console.log("Fail to fetch menu: ", error);
      }
    };

    fetchMenu();
  }, []);

  useEffect(() => {
    // กรองข้อมูลตาม category และ search
    const filterProducts = () => {
      let filtered = products;

      // กรองตาม category
      if (categoryFilter !== 'all') {
        filtered = filtered.filter((product) => product.category.name === categoryFilter);
      }

      // กรองตามคำค้นหา
      if (searchQuery) {
        filtered = filtered.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setFilteredProducts(filtered);
    };

    filterProducts();
  }, [products, categoryFilter, searchQuery]); // ทำการกรองทุกครั้งเมื่อเปลี่ยนค่า


  const handleDelete = (id) => async () => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }
    try {
      await axios.delete(`/api/menu/${id}`);
      alert("Deletion successful!");
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <Selectpath path={path} />
        <div className="ml-auto flex items-center gap-2">

          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked={categoryFilter === 'all'} onClick={() => setCategoryFilter('all')}>
                All
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={categoryFilter === 'teh'} onClick={() => setCategoryFilter('teh')}>
                Teh
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={categoryFilter === 'nasi goreng'} onClick={() => setCategoryFilter('nasi goreng')}>
                Nasi Goreng
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={categoryFilter === 'special'} onClick={() => setCategoryFilter('special')}>
                Special
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>



          <Link href={"/admin/addMenu"}>
            <Button size="sm" className="h-10 gap-1">
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
          </CardHeader>
          <CardContent>
            <TableLoop products={filteredProducts} handleDelete={handleDelete} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
