"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { File, ListFilter, MoreHorizontal, PlusCircle, Mail, House, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { DropdownEmpPath } from './componant';

// Component for displaying table rows
const EmployeeCard = ({ emp, onDelete }) => (
  <Card className="w-full">
    <CardContent>
      <div className="grid w-full items-center gap-4">
        <div className="flex justify-between items-center pt-5">
          <div className="flex space-x-2">
            <Avatar>
              <AvatarImage src={emp.avatar || "https://github.com/shadcn.png"} alt={emp.name} />
              <AvatarFallback>{emp.name[0]}{emp.lastname[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-sm font-medium leading-none">
                {emp.name} {emp.lastname}
              </h4>
              <p className="text-sm text-muted-foreground">{emp.role?.name}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <Link href={`/employees/addemployee/${emp.id}`}>
                <DropdownMenuItem className="cursor-pointer">
                  Edit
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={() => onDelete(emp.id)}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <hr />
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <p>{emp.email}</p>
          </div>
          <div className="flex items-center space-x-2">
            <House className="h-4 w-4" />
            <p>{emp.address}</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Main Employee component
export default function Employee() {
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const filtered = employees.filter(emp =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("/api/employee/emp");
      setEmployees(response.data);
      setFilteredEmployees(response.data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  const onDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`/api/employee/emp/${id}`);
        alert('Deletion successful!');
        fetchEmployees();
      } catch (error) {
        console.error('Deletion failed:', error);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <DropdownEmpPath />
        <div className="flex items-center gap-2">
          <Link href="/employees/role">
            <Button size="sm" variant="outline" className="h-8">
              <PlusCircle className="h-3.5 w-3.5 mr-1" />
              Add Role
            </Button>
          </Link>
          <Link href="/employees/addemployee">
            <Button size="sm" className="h-8">
              <PlusCircle className="h-3.5 w-3.5 mr-1" />
              Add Employee
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Tabs value={'all'} >

        <TabsContent value="all" className="min-h-[500px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees.map((emp) => (
              <EmployeeCard key={emp.id} emp={emp} onDelete={onDelete} />
            ))}
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}