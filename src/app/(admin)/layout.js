'use client'
import Image from 'next/image'
import Link from 'next/link'
import {
  Home,
  Package,
  Users2,
  CirclePercent,
  LineChart,
  Settings,
  ShoppingCart,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"

import { usePathname } from 'next/navigation'

import Bread from '../../components/breadcrump'

export default function AdminLayout({ children }) {
  const pathname = usePathname(); // รับตำแหน่งปัจจุบันของผู้ใช้

  return (
    <div className='flex min-h-screen w-full flex-col bg-muted/40'>
      {/* sidebar */}
      <aside className='fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex'>
        <TooltipProvider>
          <nav className='flex flex-col items-center gap-4 px-2 sm:py-5'>
            <Link
              href='/dashboard'
              className={`group flex h-9 w-9 items-center justify-center rounded-lg ${pathname === '/dashboard' ? 'bg-accent' : 'text-muted-foreground'} transition-colors hover:text-foreground`}
            >
              <Home className='h-5 w-5' />
              <span className='sr-only'>Dashboard</span>
            </Link>

            <Menubar className="border-none">
              <MenubarMenu>
                <MenubarTrigger className="border-none">
                  <Package className='h-5 w-5 cursor-pointer' />
                  <span className='sr-only'>Products</span>
                </MenubarTrigger>
                <MenubarContent side={'right'}>
                  <MenubarItem>
                    <Link href="/menu/allmenu">
                      Menu
                    </Link>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    <Link href="/menuset/allmenuset">
                      Menuset
                    </Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>


            <Link
              href='/employees'
              className={`group flex h-9 w-9 items-center justify-center rounded-lg ${pathname === '/ad/employee' ? 'bg-accent' : 'text-muted-foreground'} transition-colors hover:text-foreground`}
            >
              <Users2 className='h-5 w-5' />
              <span className='sr-only'>Employees</span>
            </Link>

            <Link
              href='/discount'
              className={`group flex h-9 w-9 items-center justify-center rounded-lg ${pathname === '/discount' ? 'bg-accent' : 'text-muted-foreground'} transition-colors hover:text-foreground`}
            >
              <CirclePercent className='h-5 w-5' />
              <span className='sr-only'>Discounts</span>
            </Link>

          </nav>

          <nav className='mt-auto flex flex-col items-center gap-4 px-2 sm:py-5'>
            <Link
              href='/menu/settings'
              className={`group flex h-9 w-9 items-center justify-center rounded-lg ${pathname === '/menu/settings' ? 'bg-accent' : 'text-muted-foreground'} transition-colors hover:text-foreground`}
            >
              <Settings className='h-5 w-5' />
              <span className='sr-only'>Settings</span>
            </Link>
          </nav>
        </TooltipProvider>
      </aside>

      <div className='flex flex-col sm:py-4 sm:pl-14'>
        <header className='sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
          <Sheet>
            <SheetTrigger asChild>
              <Button size='icon' variant='outline' className='sm:hidden'>
                <span className='sr-only'>Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='sm:max-w-xs'>
              <nav className='grid gap-6 text-lg font-medium'>
                <Link
                  href='/dashboard'
                  className='flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground'
                >
                  <Home className='h-5 w-5' />
                  Dashboard
                </Link>
                <Link
                  href='/menu/products'
                  className='flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground'
                >
                  <Package className='h-5 w-5' />
                  Products
                </Link>
                <Link
                  href='/employee'
                  className='flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground'
                >
                  <Users2 className='h-5 w-5' />
                  Employees
                </Link>
                <Link
                  href='/discount'
                  className='flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground'
                >
                  <CirclePercent className='h-5 w-5' />
                  Discounts
                </Link>
                <Link
                  href='/menu/analytics'
                  className='flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground'
                >
                  <LineChart className='h-5 w-5' />
                  Analytics
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Bread />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='icon' className='overflow-hidden rounded-full'>
                <Image
                  src='/no image found'
                  width={36}
                  height={36}
                  alt='Avatar'
                  className='overflow-hidden rounded-full'
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8'>
          {children}
        </main>
      </div>
    </div>
  );
}
