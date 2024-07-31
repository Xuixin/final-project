'use client'
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"


export default function Login() {

  
    return (
      <main className="mx-10 my-20">
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-1 xl:min-h-[800px]">
          <div className="flex items-center justify-center py-12">
            <div className="mx-auto grid w-[350px] gap-6 border p-10 rounded">
              <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Login</h1>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Username"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Input id="password" type="password" placeholder="Password" required />
                </div>
                <Link href={'/home'}>login</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }