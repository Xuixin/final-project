'use client'

import { File, ListFilter, MoreHorizontal, PlusCircle } from 'lucide-react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Selectpath from '@/components/select'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'

// Component for displaying table rows
const TableLoop = ({ menuSet, onDelete }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[100px]'>NO.</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Menu</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>
            <span className='sr-only'>Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {menuSet.map((set, index) => (
          <TableRow key={set.id}>
            <TableCell className='font-medium'>{index + 1}</TableCell>
            <TableCell>{set.name}</TableCell>
            <TableCell>
              {set.details.map((detail, index) => (
                <div key={index}>
                  {detail.menu.name} X {detail.quantity}
                </div>
              ))}
            </TableCell>

            <TableCell>{set.totalMenu}</TableCell>
            <TableCell>RM {set.price}</TableCell>
            <TableCell>
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
                  <Link href={`/admin/menuset/addMenuSet/${set.id}`}>
                    <DropdownMenuItem className='cursor-pointer'>
                      Edit
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={() => onDelete(set.id)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

// Main MenuType component
export default function MenuType() {
  const path = usePathname()
  const [menuSet, setMenuset] = useState([])

  useEffect(() => {
    const fetchMenuSet = async () => {
      try {
        const response = await axios.get('/api/menuset')
        setMenuset(response.data) // Assuming your API returns { data: [...] }
      } catch (error) {
        console.error('Failed to fetch menuset:', error)
        // Handle error (e.g., show an error message to the user)
      }
    }

    fetchMenuSet()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return
    }

    try {
      await axios.delete(`/api/menuset/${id}`)
      setMenuset((prevMenuSet) => prevMenuSet.filter((set) => set.id !== id)) // Update the state to remove the deleted item
      alert('Menuset deleted successfully!')
    } catch (error) {
      alert(
        'Deletion failed: ' +
          (error.response?.data?.message || 'Something went wrong.')
      )
    }
  }

  return (
    <Tabs defaultValue='all'>
      <div className='flex items-center'>
        <Selectpath path={path} />
        <div className='ml-auto flex items-center gap-2'>
          <Link href='/admin/menuset/addMenuSet'>
            <Button
              size='sm'
              className='h-8 gap-1'
            >
              <PlusCircle className='h-3.5 w-3.5' />
              <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                Add MenuSet
              </span>
            </Button>
          </Link>
        </div>
      </div>
      <TabsContent value='all'>
        <Card x-chunk='dashboard-06-chunk-0'>
          <CardHeader>
            <CardTitle>MenuSet</CardTitle>
          </CardHeader>
          <CardContent>
            <TableLoop
              menuSet={menuSet}
              onDelete={handleDelete}
            />
          </CardContent>
          <CardFooter>
            {/* <div className="text-xs text-muted-foreground">
              Showing <strong>1-10</strong> of <strong>32</strong> products
            </div> */}
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
