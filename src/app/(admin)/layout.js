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
  ShoppingBasket,
  UserRound
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
} from '@/components/ui/menubar'

import { usePathname, useRouter } from 'next/navigation'

import Bread from '../../components/breadcrump'
import { useEffect, useState } from 'react'
import Head from 'next/head';


export default function AdminLayout({ children }) {
  const pathname = usePathname() // รับตำแหน่งปัจจุบันของผู้ใช้
  const router = useRouter() // รับ��ู้ใช้ในส่วนของเว็บ

  const [role, setRole] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const CheckRoleAdmin = async () => {
    const role = localStorage.getItem('role')
    if (role === null) {
      router.push('/adminLogin')
      return
    }

    if (role === 'owner') {
      setRole(true)
      setShowDropdown(true)
    } else {
      setRole(false)
      setShowDropdown(true)
    }
  }


  useEffect(() => {
    CheckRoleAdmin()
  }, [])


  const handelLogout = () => {
    localStorage.removeItem('role')
    router.push('/adminLogin')
  }


  return (
    <>
      <Head>
        <title>Title ของหน้านี้</title>
        <meta name="description" content="คำอธิบายสำหรับ SEO" />
      </Head>
      <div className='flex min-h-screen w-full flex-col bg-muted/40'>
        {/* sidebar */}
        <aside className='fixed inset-y-0 left-0 z-20 hidden w-14 flex-col border-r bg-background sm:flex'>
          <TooltipProvider>
            <nav className='flex flex-col items-center gap-4 px-2 sm:py-5'>

              {role === true && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href='/dashboard'
                      className={`group flex h-9 w-9 items-center justify-center rounded-lg ${pathname.startsWith('/dashboard')
                        ? 'bg-accent'
                        : 'text-muted-foreground'
                        } transition-colors hover:text-foreground`}
                    >
                      <Home className='h-5 w-5' />
                      <span className='sr-only'>Dashboard</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side={"right"} >Dashboard</TooltipContent>
                </Tooltip>
              )}


              <Tooltip >
                <TooltipTrigger asChild>
                  <Link
                    href='/customer'
                    className={`group flex h-9 w-9 items-center justify-center rounded-lg ${pathname.startsWith('/customer')
                      ? 'bg-accent'
                      : 'text-muted-foreground'
                      } transition-colors hover:text-foreground`}
                  >

                    <UserRound className='h-5 w-5' />
                    <span className='sr-only'>customer</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side={"right"}>customer</TooltipContent>
              </Tooltip>

              <Tooltip >
                <TooltipTrigger asChild>
                  <Link
                    href='/orders'
                    className={`group flex h-9 w-9 items-center justify-center rounded-lg ${pathname.startsWith('/orders')
                      ? 'bg-accent'
                      : 'text-muted-foreground'
                      } transition-colors hover:text-foreground`}
                  >
                    <ShoppingCart className='h-5 w-5' />
                    <span className='sr-only'>Orders</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side={"right"}>Orders</TooltipContent>
              </Tooltip>






              <Menubar className='border-none'>
                <MenubarMenu>
                  <MenubarTrigger className='border-none bg-white'>
                    <Package className='h-5 w-5 cursor-pointer text-muted-foreground' />
                    <span className='sr-only'>Products</span>
                  </MenubarTrigger>
                  <MenubarContent side={'right'}>
                    <MenubarItem>
                      <Link href='/menu/allmenu'>Menu</Link>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>
                      <Link href='/menuset/allmenuset'>Menuset</Link>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>
                      <Link href='/category'>Category Menu</Link>
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>


              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href='/ingredient'
                    className={`group flex h-9 w-9 items-center justify-center rounded-lg ${pathname.startsWith('/ingredient')
                      ? 'bg-accent'
                      : 'text-muted-foreground'
                      } transition-colors hover:text-foreground`}
                  >
                    <ShoppingBasket className='h-5 w-5' />
                    <span className='sr-only'>Ingredient</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side={"right"}>Ingredient</TooltipContent>
              </Tooltip>

              {role === true && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href='/employees'
                      className={`group flex h-9 w-9 items-center justify-center rounded-lg ${pathname.startsWith('/employee')
                        ? 'bg-accent'
                        : 'text-muted-foreground'
                        } transition-colors hover:text-foreground`}
                    >
                      <Users2 className='h-5 w-5' />
                      <span className='sr-only'>Employees</span>
                    </Link>

                  </TooltipTrigger>
                  <TooltipContent side={"right"}>Employees</TooltipContent>
                </Tooltip>
              )}




              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href='/discount'
                    className={`group flex h-9 w-9 items-center justify-center rounded-lg ${pathname.startsWith('/discount') ? 'bg-accent' : 'text-muted-foreground'
                      } transition-colors hover:text-foreground`}
                  >
                    <CirclePercent className='h-5 w-5' />
                    <span className='sr-only'>Discounts</span>
                  </Link>

                </TooltipTrigger>
                <TooltipContent side={"right"}>Discounts</TooltipContent>
              </Tooltip>


            </nav>

            <nav className='mt-auto flex flex-col items-center gap-4 px-2 sm:py-5'>
              <Link
                href='/menu/settings'
                className={`group flex h-9 w-9 items-center justify-center rounded-lg ${pathname === '/menu/settings'
                  ? 'bg-accent'
                  : 'text-muted-foreground'
                  } transition-colors hover:text-foreground`}
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
                <Button
                  size='icon'
                  variant='outline'
                  className='sm:hidden'
                >
                  <span className='sr-only'>Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side='left'
                className='sm:max-w-xs'
              >
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
                <Button
                  variant='outline'
                  size='icon'
                  className='overflow-hidden rounded-full'
                >
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
                {showDropdown !== false ? (
                  <>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Support</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <Button className={'w-full'} variant='outline' onClick={handelLogout}>Logout</Button>
                  </>
                ) : (
                  <DropdownMenuItem>signin</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8'>
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
