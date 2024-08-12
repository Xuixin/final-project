'use client'

import { File, ListFilter, MoreHorizontal, PlusCircle } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Mail, PhoneCall } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'

// Component for displaying table rows
const TableLoop = () => {
  return (
    <Card className='w-[300px] ring-1 ring-gray-300'>
      <CardContent>
        <div className='grid w-full items-center gap-4'>
          <div className='flex space-x-2 space-y-1.5 pt-5'>
            <Avatar>
              <AvatarImage src='https://github.com/shadcn.png' />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className='space-y-1'>
              <h4 className='text-sm font-medium leading-none'>
                Radix Primitives
              </h4>
              <p className='text-sm text-muted-foreground'>Web dev</p>
            </div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-haspopup='true'
                    size='icon'
                    variant='ghost'
                  >
                    <MoreHorizontal className='h-4 w-4' />
                    <span className='sr-only'>Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <Link href='#'>
                    <DropdownMenuItem className='cursor-pointer'>
                      Edit
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <hr />
          <div className='flex space-x-4 text-muted-foreground'>
            <div>
              <Mail />
            </div>
            <div>
              <p>imrom@email.com</p>
            </div>
          </div>
          <div className='flex space-x-4 text-muted-foreground'>
            <div>
              <PhoneCall />
            </div>
            <div>
              <p>0123456789</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className='flex justify-end'></CardFooter>
    </Card>
  )
}

// Main MenuType component
export default function Employee() {
  const path = usePathname()
  const [menutypes, setMenutypes] = useState([])

  useEffect(() => {
    const fetchMenutypes = async () => {
      try {
        const response = await axios.get('/api/menutype')
        setMenutypes(response.data.data) // Assuming your API returns { data: [...] }
      } catch (error) {
        console.error('Failed to fetch menu types:', error)
        // Handle error (e.g., show an error message to the user)
      }
    }

    fetchMenutypes()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return
    }

    try {
      await axios.delete(`/api/menutype/${id}`)
      setMenutypes((prevMenutypes) =>
        prevMenutypes.filter((type) => type.id !== id)
      ) // Update the state to remove the deleted item
      alert('Category deleted successfully!')
    } catch (error) {
      alert(
        'Deletion failed: ' +
          (error.response?.data?.message || 'Something went wrong.')
      )
    }
  }

  return (
    <Tabs defaultValue='all'>
      <div className='flex'>
        <div className=' w-full flex items-center justify-between gap-2 '>
          <Card x-chunk='dashboard-06-chunk-0 '>
            <CardHeader>
              <CardTitle>Employees</CardTitle>
            </CardHeader>
          </Card>
          <Link href='/admin/menutype/addMenutype'>
            <Button
              size='sm'
              className='h-8 gap-1'
            >
              <PlusCircle className='h-3.5 w-3.5' />
              <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                Add Employee
              </span>
            </Button>
          </Link>
        </div>
      </div>
      <TabsContent
        value='all'
        className='ring-1 ring-gray-300 min-h-[500px]'
      >
        <Card x-chunk='dashboard-06-chunk-0'>
          <CardContent className={'m-5'}>
            {/* <TableLoop
              menutypes={menutypes}
              onDelete={handleDelete}
            /> */}
            <TableLoop />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
