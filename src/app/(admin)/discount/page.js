"use client";

import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";
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
import Link from "next/link";
import Selectpath from "@/components/select";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

// Component for displaying table rows
const TableLoop = ({ promotions, onDelete }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Discount</TableHead>
          <TableHead>Menu</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {promotions.map((pro, index) => {
          console.log(pro.id);
          return (

            <TableRow key={pro.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{pro.name}</TableCell>
              <TableCell> ลด <span className="text-red-500">{pro.discount}</span></TableCell>
              <TableCell>Menu</TableCell>
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
                    <Link href={`/discount/adddiscount/${pro.id}`}>
                      <DropdownMenuItem className="cursor-pointer">
                        Edit
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem
                      onClick={() => onDelete(pro.id)} // Call onDelete with pro.id
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  );
};

// Main Menupro component
export default function Menupro() {
  const [promotion, setPromotions] = useState([]);

  useEffect(() => {
    const fetchMenupros = async () => {
      try {
        const response = await axios.get("/api/promotion");
        setPromotions(response.data); // Assuming your API returns { data: [...] }
      } catch (error) {
        console.error("Failed to fetch menu pros:", error);
        // Handle error (e.g., show an error message to the user)
      }
    };

    fetchMenupros();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      await axios.delete(`/api/promotion/${id}`);
      setPromotions((prevMenupros) =>
        prevMenupros.filter((pro) => pro.id !== id)
      ); // Update the state to remove the deleted item
      alert("Category deleted successfully!");
    } catch (error) {
      alert(
        "Deletion failed: " +
        (error.response?.data?.message || "Something went wrong.")
      );
    }
  };

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2">
          <Link href="/discount/adddiscount">
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Discount
              </span>
            </Button>
          </Link>
        </div>
      </div>
      <TabsContent value="all">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Discount</CardTitle>
          </CardHeader>
          <CardContent className={"mx-56"}>
            <TableLoop promotions={promotion} onDelete={handleDelete} />
          </CardContent>
          <CardFooter>
            {/* <div className="text-xs text-muted-foreground">
              Showing <strong>1-10</strong> of <strong>32</strong> products
            </div> */}
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
