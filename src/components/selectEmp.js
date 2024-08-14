"use client";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SelectPathEmp({ path }) {
  const router = useRouter();
  const [pathselect, setPathselect] = useState("");

  useEffect(() => {
    console.log("Current path:", path);
    switch (path) {
      case "/admin/employees":
        setPathselect("employee");
        break;
      case "/admin/menutype":
        setPathselect("menutype");
        break;
      case "/admin/menuset":
        setPathselect("menuset");
        break;
      case "/admin/menuitem": 
      default:
        setPathselect(""); // Reset if path doesn't match
    }
  }, [path]);

  const onValueChange = (value) => {
    router.push(value);
  };

  return (
    <Select onValueChange={onValueChange} defaultValue={path}>
      <SelectTrigger className="w-[180px] cursor-pointer"> {/* Add cursor-pointer here */}
        <SelectValue placeholder={pathselect} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="/admin/employees" className="cursor-pointer"> {/* Add cursor-pointer here */}
            employee
          </SelectItem>
          <SelectItem value="/admin/discount" className="cursor-pointer"> {/* Add cursor-pointer here */}
            discount
          </SelectItem>

        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
