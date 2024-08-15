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

export default function SelectPath({ path }) {
  const router = useRouter();
  const [pathselect, setPathselect] = useState("");

  useEffect(() => {
    console.log("Current path:", path);
    switch (path) {
      case "/admin":
        setPathselect("menu");
        break;
      case "/admin/menutype":
        setPathselect("menutype");
        break;
      case "/admin/menuset":
        setPathselect("menuset");
        break;
      default:
        setPathselect(""); // Reset if path doesn't match
    }
  }, [path]);

  const onValueChange = (value) => {
    router.push(value);
  };

  return (
    <Select onValueChange={onValueChange} defaultValue={path}>
      <SelectTrigger className="w-[180px] cursor-pointer">
        {" "}
        {/* Add cursor-pointer here */}
        <SelectValue placeholder={pathselect} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="/admin" className="cursor-pointer">
            {/* Add cursor-pointer here */}
            menu
          </SelectItem>
          <SelectItem value="/admin/menutype" className="cursor-pointer">
            {/* Add cursor-pointer here */}
            menutype
          </SelectItem>
          <SelectItem value="/admin/menuset" className="cursor-pointer">
            {/* Add cursor-pointer here */}
            menuset
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
