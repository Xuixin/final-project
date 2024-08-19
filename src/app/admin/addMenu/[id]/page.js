"use client";
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
import { toast } from "@/components/ui/use-toast";
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
import Image from "next/image";

const FormSchema = z.object({
  name: z.string().min(1, { message: "Menu name is required." }),
  category: z.string().min(1, { message: "Category is required." }), // category will store categoryId
  discount: z.string().min(1, { message: "Discount is required." }), // category will store categoryId
  price: z.number().min(0, { message: "Price must be a positive number." }),
  image: z.any().optional(), // Image is now optional
});

export default function InputForm({ params }) {
  const router = useRouter();
  const { id } = params;
  const [categories, setCategories] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      category: "",
      discount: "",
      price: 0,
      image: null,
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

    const fetchDiscount = async () => {
      try {
        const response = await axios.get("/api/promotion");
        setDiscounts(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Failed to fetch discount :", error);
      }
    };

    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/menu/${id}`);
        form.setValue("name", response.data.data.name);
        form.setValue("category", response.data.data.category.name);
        form.setValue("price", response.data.data.price);
        setSelectedImage(response.data.data.img); // Update state with the current image URL
      } catch (error) {
        console.error("Failed to fetch Menu :", error);
      }
    };

    fetchCategories();
    fetchData();
    fetchDiscount();
  }, [id]);

  useEffect(() => {
    const test = discounts.find((discount) => discount.id === 1)
    console.log("test ", test)
  },[discounts])

  const onSubmit = async (data) => {
    try {
      const selectedCategory = categories.find(
        (cat) => cat.name === data.category
      );
      if (!selectedCategory) {
        console.error("Selected category not found.");
        return;
      }
      
      const selectedDiscount = discounts.find(
        (discount) => discount.discount === data.discount
      );
      if (!selectedDiscount) {
        console.error("Selected discount not found.");
        return;
      }
      alert("hi submit");

      const formData = new FormData();

      if (data.image && data.image[0]) {
        // data.image is a FileList object
        formData.append("file", data.image[0]); // Assuming you want to upload the first file
      }

      // Upload the image
      const imageResponse = await axios.post(
        "http://localhost:3001/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Image upload response:", imageResponse.data);

      // Prepare and send the rest of the form data
      const newData = {
        ...data,
        category: selectedCategory.id,
        discountId: selectedDiscount.id,
        img: imageResponse.data.filePath, // Add the image URL to your form data
      };

      // Send form data to the main API endpoint
      await axios.post(`/api/menu/${id}`, newData);

      router.back();
    } catch (error) {
      console.error("Submission failed:", error);
      toast({
        title: "Submission failed.",
        description: error.response?.data?.message || "Something went wrong.",
      });
    }
  };

  // Handler for file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file)); // Create a local URL for the selected file
      form.setValue("image", e.target.files);
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
                    {categories.map((discount) => (
                      <SelectItem key={discount.id} value={discount.name}>
                        {discount.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                  value={field.value}
                  placeholder="Select discount"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select discount" />
                  </SelectTrigger>
                  <SelectContent>
                    {discounts.map((discount) => (
                      <SelectItem key={discount.id} value={discount.discount}>
                        {discount.discount}
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
          render={() => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  {selectedImage && (
                    <Image
                      src={selectedImage}
                      alt="Selected"
                      width={100}
                      height={100}
                      className="mb-4"
                    />
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
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
