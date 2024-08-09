"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast  } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

const FormSchema = z.object({
  name: z.string().min(1, { message: "Menu name is required." }),
  category: z.string().min(1, { message: "Category is required." }), // category will store categoryId
  price: z.number().min(0, { message: "Price must be a positive number." }),
  image: z.any().optional(), // Image is now optional
});

export default function InputForm() {
  const { toast} = useToast();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      category: "",
      price: 0,
      image: null, // Image is initially set to null
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/menutype");
        setCategories(response.data.data); // Assuming your API returns an array of categories
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (data) => {
    const selectedCategory = categories.find(
      (cat) => cat.name === data.category
    );
    if (!selectedCategory) {
      console.error("Selected category not found.");
      return;
    }

    try {
      const formData = new FormData();
      
      if (data.image && data.image[0]) { // data.image is a FileList object
        formData.append("file", data.image[0]); // Assuming you want to upload the first file
      }

      // Upload the image
      const imageResponse = await axios.post("http://localhost:3001/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Image upload response:", imageResponse.data);

      // Prepare and send the rest of the form data
      const newData = {
        ...data,
        category: selectedCategory.id,
        image: imageResponse.data.filePath, // Add the image URL to your form data
      };

      // Send form data to the main API endpoint
      await axios.post("/api/menu", newData);

      toast({
        title: "Submission successful.",
        description: "Your data has been submitted successfully.",
      });

      router.back();
    } catch (error) {
      console.error("Submission failed:", error);
      toast({
        title: "Submission failed.",
        description: error.response?.data?.message || "Something went wrong.",
      });
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

        {/* Category Field */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                  value={field.value}
                  placeholder="Select category"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price Field */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter price"
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Upload Field */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                </div>
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
