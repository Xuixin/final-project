"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
});

export default function InputForm({ params }) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/menutype/${params.id}`);
        form.setValue("name", response.data.category.name); // Assuming the API returns an object with a 'name' field
      } catch (error) {
        // Simple alert for errors
        alert("Failed to fetch data: " + (error.response?.data?.message || "Something went wrong."));
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id, form]);

  
  const onSubmit = async (data) => {
    console.log("Submitted data:", data);

    try {
      await axios.post(`/api/menutype/${params.id}`, data);
      alert("Submission successful! The menu type has been edit.");
      router.push("/admin/menutype"); // Redirect to the list page or any other page
    } catch (error) {
      alert("Submission failed: " + (error.response?.data?.message || "Something went wrong."));
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
              <FormLabel>Menu Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter menu name" {...field} />
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
