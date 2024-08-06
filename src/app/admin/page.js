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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import Selectpath from '@/components/select'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'

const TableLoop = ({ products }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='hidden w-[100px] sm:table-cell'>
            <span className='sr-only'>Image</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead className='hidden md:table-cell'>Category</TableHead>
          <TableHead className='hidden md:table-cell'>Price</TableHead>
          <TableHead className='hidden md:table-cell'>Created at</TableHead>
          <TableHead>
            <span className='sr-only'>Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className='hidden sm:table-cell'>
              <Image
                alt='Product image'
                className='aspect-square rounded-md object-cover'
                height='64'
                src={product.image}
                width='64'
              />
            </TableCell>
            <TableCell className='font-medium'>{product.name}</TableCell>
            <TableCell className='hidden md:table-cell'>
              {product.category.name}
            </TableCell>
            <TableCell className='hidden md:table-cell'>
              RM {product.price.toFixed(2)}
            </TableCell>
            <TableCell className='hidden md:table-cell'>
              {product.createdAt}
            </TableCell>
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
                  <Link href={`admin/addMenu/${product.id}`}>
                    <DropdownMenuItem className='cursor-pointer'>
                      Edit
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function Admin() {
  const path = usePathname()
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get('/api/menu')
        setProducts(response.data.data)
      } catch (error) {
        console.log('Fail to fetch menu: ', error)
      }
    }

    fetchMenu()
  }, [])
  return (
    <Tabs defaultValue='all'>
      <div className='flex items-center'>
        <Selectpath path={path} />
        <div className='ml-auto flex items-center gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                size='sm'
                className='h-8 gap-1'
              >
                <ListFilter className='h-3.5 w-3.5' />
                <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Active
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            size='sm'
            variant='outline'
            className='h-8 gap-1'
          >
            <File className='h-3.5 w-3.5' />
            <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
              Export
            </span>
          </Button>
          <Link href={'/admin/addMenu'}>
            <Button
              size='sm'
              className='h-8 gap-1'
            >
              <PlusCircle className='h-3.5 w-3.5' />
              <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                Add Product
              </span>
            </Button>
          </Link>
        </div>
      </div>
      <TabsContent value='all'>
        <Card x-chunk='dashboard-06-chunk-0'>
          <CardHeader>
            <CardTitle>Menu</CardTitle>
            <CardDescription>
              Manage your products and view their sales performance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TableLoop products={products} />
          </CardContent>
          <CardFooter>
            <div className='text-xs text-muted-foreground'>
              Showing <strong>1-10</strong> of <strong>32</strong> products
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
