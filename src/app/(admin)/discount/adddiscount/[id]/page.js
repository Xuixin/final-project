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
import { useEffect } from "react";

const FormSchema = z.object({
  name: z.string().min(1, { message: "Menu name is required." }),
  discount: z.string().min(1, { message: "discount is required." }),
});

export default function InputForm({params}) {
  const router = useRouter();
  const { id } = params;

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      discount: ""
    },
  });

  useEffect(() => {
    const fetchdiscount = async () => {
        try {
          const response = await axios.get(`/api/promotion/${id}`);
          form.setValue("name", response.data.name);
          form.setValue("discount", response.data.discount);
        } catch (error) {
          console.error("discount get fail", error);
        }
      };

      fetchdiscount();

    }, [id]); // fetch discount when id changes

  const onSubmit = async (data) => {
    console.log("Submitted data:", data);

    try {
      await axios.post(`/api/promotion/${id}`, data);
      alert('sucess')
      router.back()
    } catch (error) {
      console.error("discount update fail",error)
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 border py-10 px-56 rounded bg-white"
      >
        {/* Menu Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter menu name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="discount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount</FormLabel>
              <FormControl>
                <Input placeholder="Enter discount" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
