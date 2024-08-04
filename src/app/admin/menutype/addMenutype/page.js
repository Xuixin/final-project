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

const FormSchema = z.object({
  name: z.string().min(1, { message: "Menu name is required." }),
});

export default function InputForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data) => {
    console.log("Submitted data:", data);

    try {
      await axios.post("/api/menutype", data);
      toast({
        title: "Submission successful!",
        description: "Succcess"
      });
      alert('sucess')
    } catch (error) {
      toast({
        title: "Submission failed.",
        description: error.response?.data?.message || "Something went wrong.",
        variant: "destructive",
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

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
