"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import React, { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";

const FormSchema = z.object({
  name: z.string().min(1, { message: "Menu name is required." }),
});

export default function InputForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [menuData, setMenuData] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [valueID, setValueID] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [selectedMenuData, setSelectedMenuData] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get("/api/menu");
        setMenuData(response.data.data);
      } catch (error) {
        console.log("Fail to fetch menu: ", error);
      }
    };

    fetchMenu();
  }, []);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      totalMenu: 0,
      price: 0,
      menu: [],
    },
  });

  const addMenuForm = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      quantity: 0,
    },
  });

  const handleIncreaseQuantity = (index) => {
    const updatedMenu = [...form.getValues("menu")];
    updatedMenu[index].quantity += 1;
    setSelectedMenuData(updatedMenu);
    form.setValue("menu", updatedMenu);

    const newTotalQuantity = updatedMenu.reduce(
      (total, item) => total + item.quantity,
      0
    );
    setTotalQuantity(newTotalQuantity);
    form.setValue("totalMenu", newTotalQuantity);

    const newTotalPrice = updatedMenu.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    setTotalPrice(newTotalPrice);
  };

  const handleDecreaseQuantity = (index) => {
    const updatedMenu = [...form.getValues("menu")];
    if (updatedMenu[index].quantity > 1) {
      updatedMenu[index].quantity -= 1;
      setSelectedMenuData(updatedMenu);
      form.setValue("menu", updatedMenu);

      const newTotalQuantity = updatedMenu.reduce(
        (total, item) => total + item.quantity,
        0
      );
      setTotalQuantity(newTotalQuantity);
      form.setValue("totalMenu", newTotalQuantity);

      const newTotalPrice = updatedMenu.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      setTotalPrice(newTotalPrice);
    }
  };

  const onSubmit = async (data) => {
    const newdata = {
      name: data.name,
      totalMenu: totalQuantity,
      price: form.getValues("price"),
      menu: form.getValues("menu"),
    };

  

    try {
      await axios.post('/api/menuset', newdata)
      alert('success')
    } catch (error) {
      console.error(error);
    }
  };

  const submitMenu = () => {
    console.log("Submitted data:", quantity);

    // หาเมนูที่ตรงกับ ID ที่เลือกใน `valueID`
    const selectedMenu = menuData.find((menu) => menu.id === valueID);

    // ตรวจสอบว่าเจอเมนูหรือไม่
    if (!selectedMenu) {
      console.error("Menu not found");
      return;
    }

    // ตรวจสอบว่าเมนูนี้มีอยู่ใน `selectedMenuData` แล้วหรือไม่
    const existingMenuIndex = form
      .getValues("menu")
      .findIndex((menu) => menu.id === valueID);

    let updatedMenuData = [...form.getValues("menu")];

    if (existingMenuIndex !== -1) {
      // ถ้าเมนูนี้มีอยู่แล้ว ให้เพิ่มจำนวน (`quantity`) เข้าไป
      updatedMenuData[existingMenuIndex].quantity += quantity;
    } else {
      // ถ้าเมนูนี้ยังไม่มี ให้เพิ่มเมนูเข้าไปใน array ของ `menu` ในฟอร์ม
      updatedMenuData = [...updatedMenuData, { ...selectedMenu, quantity }];
    }

    setSelectedMenuData(updatedMenuData);
    form.setValue("menu", updatedMenuData);

    // คำนวณ `totalQuantity` ใหม่โดยการรวม `quantity` ของเมนูทั้งหมด
    const newTotalQuantity = updatedMenuData.reduce(
      (total, item) => total + item.quantity,
      0
    );
    setTotalQuantity(newTotalQuantity);
    form.setValue("totalMenu", newTotalQuantity);

    const newtotalPrice = updatedMenuData.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    setTotalPrice(newtotalPrice);

    console.log("data", form.getValues("menu"));
    setQuantity(0);
    setValue("");
    setValueID(0);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-3 border py-10 px-56 rounded bg-white "
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Menuset name</FormLabel>
              <FormControl>
                <Input placeholder="Enter menuset name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input placeholder="Enter price" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="totalMenu"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Menu</FormLabel>
              <FormControl>
                <Input disabled {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Table className="mt-5 border">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">NO.</TableHead>
              <TableHead>Menu</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {form.getValues("menu") && form.getValues("menu").length > 0 ? (
              form.getValues("menu").map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDecreaseQuantity(index)}
                    >
                      <Minus />
                    </Button>
                    {item.quantity}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleIncreaseQuantity(index)}
                    >
                      <Plus />
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    RM {item.price * item.quantity}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="4" className="text-center">
                  No menu found.
                </TableCell>
              </TableRow>
            )}
            {form.getValues("menu") && form.getValues("menu").length > 0 ? (
              <TableRow>
                <TableCell
                  colSpan="4"
                  className="text-right font-medium text-sm"
                >
                  Total: RM {totalPrice}
                </TableCell>
              </TableRow>
            ) : (
              ""
            )}
          </TableBody>
        </Table>

        <div className="w-full">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Add</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Form</h4>
                  <p className="text-sm text-muted-foreground">
                    Add menu into menuset
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="width">Menu</Label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-[175px] justify-between"
                        >
                          {value
                            ? menuData.find((menu) => menu.name === value)?.name
                            : "Select menu..."}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search menu..." />
                          <CommandList>
                            <CommandEmpty>No menu found.</CommandEmpty>
                            <CommandGroup>
                              {menuData.map((menu) => (
                                <CommandItem
                                  key={menu.id}
                                  value={menu.id}
                                  onSelect={(currentValue) => {
                                    setValue(
                                      currentValue === value ? "" : currentValue
                                    );
                                    setValueID(menu.id);
                                    setOpen(false);
                                  }}
                                >
                                  {menu.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="maxHeight">Quantity</Label>
                    <Input
                      defaultValue="0"
                      className="col-span-2 h-8"
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Button onClick={submitMenu}>เพิ่มเมนู</Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="w-full flex justify-center">
          <Button className="" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
