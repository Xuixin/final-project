'use client'
import Link from 'next/link'
import { CircleUser, Menu, Package2, ShoppingCart } from 'lucide-react'
import BestSeller from '@/components/ui/bestseller'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label'

//Componant
import Footer from '@/components/Footer'
import { EditProfile } from '@/components/menuComponant/ordereDetails'

//context
import { useAppContext } from '../Context/AppContext'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Customerlayout({ children }) {
  const { logout, cartCount } = useAppContext()
  const [index, setIndex] = useState(0)
  const [isAuthen, setIsAuthen] = useState(false)

  const pathName = usePathname()
  const router = useRouter()

  const getISLogIn = () => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthen(true)
    } else {
      setIsAuthen(false)
    }
  }

  // ฟังก์ชันสำหรับดึงข้อมูลจาก toke

  useEffect(() => {
    changePath(pathName)
    getISLogIn()
  }, [pathName])

  const changePath = (path) => {
    switch (path) {
      case '/home':
        setIndex(1)
        break
      case '/menu':
        setIndex(2)
        break
      case '/order':
        setIndex(3)
        break
      case '/contact':
        setIndex(4)
        break
      default:
        setIndex(0)
        break
    }
  }

  return (
    <div className='flex min-h-screen w-full flex-col'>
      <header className='sticky top-0 flex h-16 z-50 items-center gap-4 border-b bg-background lg:px-32 '>
        {/* web */}
        <nav className='hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
          <Link
            href='/home'
            className={`flex items-center gap-2 text-lg font-semibold ${index === 1 ? 'text-foreground' : 'text-muted-foreground'
              }`}
          >
            <Package2 className='h-6 w-6' />
            <span className='sr-only'>Acme Inc</span>
          </Link>
          <Link
            href='/home'
            className={`transition-colors hover:text-foreground ${index === 1 ? 'text-foreground' : 'text-muted-foreground'
              }`}
          >
            Home
          </Link>
          <Link
            href='/menu'
            className={`text-muted-foreground transition-colors hover:text-foreground ${index === 2 ? 'text-foreground' : 'text-muted-foreground'
              }`}
          >
            Menu
          </Link>
          <Link
            href='/order'
            className={`text-muted-foreground transition-colors hover:text-foreground ${index === 3 ? 'text-foreground' : 'text-muted-foreground'
              }`}
          >
            Order
          </Link>
          <Link
            href='/contact'
            className={`text-muted-foreground transition-colors hover:text-foreground ${index === 4 ? 'text-foreground' : 'text-muted-foreground'
              }`}
          >
            Contact
          </Link>
        </nav>
        {/* mobile */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              className='shrink-0 md:hidden'
            >
              <Menu className='h-5 w-5' />
              <span className='sr-only'>Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side='left'>
            <nav className='grid gap-6 text-lg font-medium'>
              <Link
                href='#'
                className='flex items-center gap-2 text-lg font-semibold'
              >
                <Package2 className='h-6 w-6' />
                <span className='sr-only'>Acme Inc</span>
              </Link>
              <Link
                href='/home'
                className='text-muted-foreground hover:text-foreground'
              >
                Home
              </Link>
              <Link
                href='/menu'
                className='text-muted-foreground hover:text-foreground'
              >
                Menu
              </Link>
              <Link
                href='/order'
                className='text-muted-foreground hover:text-foreground'
              >
                Order
              </Link>
              <Link
                href='#'
                className='text-muted-foreground hover:text-foreground'
              >
                Contact
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <div className={`flex w-full items-center ${!isAuthen && 'justify-end'}  gap-4 md:ml-auto md:gap-2 lg:gap-4 `}>
          {isAuthen ? (
            <>
              <div className='ml-auto flex-1 sm:flex-initial'>
                <div
                  className='relative p-2 cursor-pointer'
                  onClick={() => router.push('/cart')}
                >
                  <p className='absolute text-white bg-primary rounded-full w-5 h-5 flex justify-center items-center top-0 right-0'>
                    {cartCount()}
                  </p>
                  <ShoppingCart
                    size={24}
                    className='text-primary'
                  />
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='secondary'
                    size='icon'
                    className='rounded-full'
                  >
                    <CircleUser className='h-5 w-5' />
                    <span className='sr-only'>Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className='w-full flex justify-start items-center border-none px-2'>Profile</Button>
                    </DialogTrigger>
                    <EditProfile />
                  </Dialog>

                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </>
          ) : (
            <>
              <Button variant='outline' className='mx-3'>
                Sign In
              </Button>
              <Button >
                Sign Up
              </Button>
            </>
          )}

        </div>
      </header>
      <main className='flex min-h-[calc(100vh_-_theme(spacing.16))] border flex-1 flex-col gap-4 pt-16 bg-primary-foreground md:gap-8 md:py-5 lg: px-24 '>
        {children}
        <Footer />
      </main>
    </div>
  )
}
