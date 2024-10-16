"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import axios from "axios";
import { useState } from "react";
import Link from "next/link";

const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
});

export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    console.log("Submitted data:", data);
    setIsLoading(true);
    try {
      const response = await axios.post("/api/login", data);
      toast({
        title: "Success!",
        description: response.data.message || "Login successful!",
      });
      router.push('/admin');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast({
          title: "Error!",
          description: error.response.data.message || "Something went wrong.",
        });
      } else {
        // Handle general errors
        toast({
          title: "Error!",
          description: "An unexpected error occurred.",
        });
      }
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <main className="mx-10 my-5 bg-red-50 relative"
      style={{
        backgroundImage: `url("/banner.jpg")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <div className="absolute inset-0 backdrop-blur-lg"></div>
      <div className="relative w-full  lg:grid lg:min-h-[600px] lg:grid-cols-1 xl:min-h-[800px]">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto bg-white  grid w-[660px] gap-6 border p-10 rounded">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Sign In</h1>
            </div>
            <div className="bg-white ">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full space-y-6 py-10 px-10 rounded bg-white "
                >
                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter email"
                            {...field}
                            disabled={isLoading} // Disable input during loading
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password Field */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            {...field}
                            disabled={isLoading} // Disable input during loading
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* link to sign up */}
                  <div className="flex items-center justify-start mt-4">

                    Don't have an account? <Link href={''}> <Button variant='link'> Sign up</Button></Link>

                  </div>
                  <div className="flex items-center justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Loading..." : "Submit"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
