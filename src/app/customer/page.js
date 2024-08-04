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

const FormSchema = z.object({
    name: z.string().min(1, { message: "First name is required." }),
    lastname: z.string().min(1, { message: "Last name is required." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
});

export default function SignUp() {
    const router = useRouter();
    const [isLoading, setIsloading] = useState(false)

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            lastname: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data) => {
        console.log("Submitted data:", data);
        setIsloading(true); // Set loading to true

        try {
            const response = await axios.post("/api/customer", data);
            toast({
                title: "Success!",
                description: response.data.message || "User registered successfully!",
            });
            router.push('/'); // Redirect to the home page or another route
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                // Handle specific error response from the API
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
            setIsloading(false); // Reset loading state
        }
    };

    return (
        <main className="mx-10 my-20 ">
            <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-1 xl:min-h-[800px]">
                <div className="flex items-center justify-center py-12">
                    <div className="mx-auto grid w-[660px] gap-6 border p-10 rounded">
                        <div className="grid gap-2 text-center">
                            <h1 className="text-3xl font-bold">Sign Up</h1>
                        </div>
                        <div className="">
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="w-full space-y-6 py-10 px-10 rounded bg-white "
                                >
                                    {/* First Name Field */}
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>First Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter first name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Last Name Field */}
                                    <FormField
                                        control={form.control}
                                        name="lastname"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Last Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter last name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

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
                                                    <Input type="password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button type="submit">Submit</Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}