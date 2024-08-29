"use client";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

//alert
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from '@/components/ui/progress'

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(100);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if(result.error){
        console.error(result.error)
        setError(result.error)
        return false
      }

      router.push('/home')
    } catch (error) {
      console.error(error);
      setError(error.message);
      setProgress(100)
    }
  };

  useEffect(() => {
    let timer;
    if (error) {
      timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress <= 0) {
            clearInterval(timer);
            setError(""); 
            return 0;
          }
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [error]);

  return (
    <section className="flex justify-center items-center min-h-screen relative">
      {error && (
        <div className="absolute right-5 top-5">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <div>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </div>
          </Alert>
        </div>
      )}
      <Card className="mx-auto max-w-sm my-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {/* <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link> */}
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="#" className="underline">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
