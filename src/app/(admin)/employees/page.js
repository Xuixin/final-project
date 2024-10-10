"use client";

import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Mail, House } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { DropdownEmpPath } from './componant'

// Component for displaying table rows
const TableLoop = ({ employee, func }) => {
  return employee.map((emp) => (
    <Card className="w-[300px]" key={emp.id}>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex space-x-2 space-y-1.5 pt-5">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <h4 className="text-sm font-medium leading-none">
                {emp.name} {emp.lastname}
              </h4>
              <p className="text-sm text-muted-foreground">{emp.role?.name}</p>
            </div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <Link href={`/employees/addemployee/${emp.id}`}>
                    <DropdownMenuItem className="cursor-pointer">
                      Edit
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={() => func(emp.id)}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <hr />
          <div className="flex space-x-4 text-muted-foreground">
            <div>
              <Mail />
            </div>
            <div>
              <p>{emp.email}</p>
            </div>
          </div>
          <div className="flex space-x-4 text-muted-foreground">
            <div>
              <House />
            </div>
            <div>
              <p>{emp.address}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end"></CardFooter>
    </Card>
  ));
};

// Main Employee component
export default function Employee() {
  const router = useRouter();
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("/api/employee/emp");
        setEmployees(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const onDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`/api/employee/emp/${id}`);
        alert('Deletion successful!');
        // Refresh employee list
        const response = await axios.get("/api/employee/emp");
        setEmployees(response.data);
      } catch (error) {
        console.error('Deletion failed:', error);
      }
    }
  };

  return (
    <>
      <div className="flex">
        <DropdownEmpPath />
        <div className="w-full flex items-center justify-end gap-2">
          <Link href="/employees/role">
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Role
              </span>
            </Button>
          </Link>
          <Link href="/employees/addemployee">
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Employee
              </span>
            </Button>
          </Link>
        </div>
      </div>
      <TabsContent value="all" className="min-h-[500px]">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardContent className="m-5 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4 ">
            <TableLoop employee={employees} func={onDelete} />
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
}
