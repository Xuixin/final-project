'use client'
import { ChevronLeft, Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useToast } from '@/components/ui/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from '@/components/ui/table'

export default function EditMenuSet({ params }) {
  const { setId } = params
  const { toast } = useToast()
  const router = useRouter()
  const [menus, setMenus] = useState([])
  const [formValues, setFormValues] = useState({
    name: '',
    totalMenu: 0,
    price: 0,
    status: '',
    menu: [],
  })

  const [menuForm, setMenuForm] = useState({
    id: '',
    quantity: 0,
  })

  const fetchMenu = async () => {
    try {
      const response = await axios.get('/api/menu')
      const allMenu = response.data
      const publishedMenu = allMenu.filter(
        (menu) => menu.status === 'Published'
      )
      setMenus(publishedMenu)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchMenusetWithId = async () => {
    try {
      const response = await axios.get(`/api/menuset/${setId}`)
      const set = response.data
      setFormValues({
        name: set.name,
        totalMenu: set.totalMenu,
        price: set.price,
        status: set.status,
        menu: set.details.map((detail) => ({
          ...detail.menu,
          quantity: detail.quantity,
        })),
      })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchMenu()
    fetchMenusetWithId()
  }, [])

  const addMenuIntoSet = (e) => {
    e.preventDefault()
    const menu = menus.find((m) => m.id === parseInt(menuForm.id))
    if (menu) {
      const existingMenu = formValues.menu.find((m) => m.id === menu.id)
      if (existingMenu) {
        existingMenu.quantity += parseInt(menuForm.quantity)
        setFormValues({ ...formValues })
      } else {
        setFormValues({
          ...formValues,
          menu: [
            ...formValues.menu,
            { ...menu, quantity: parseInt(menuForm.quantity) },
          ],
        })
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Menu not found!',
        description: 'Menu not found!',
      })
    }
  }

  // ฟังก์ชันลบเมนูออกจากชุดเมนู
  const removeMenuFromSet = (menuId) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      menu: prevFormValues.menu.filter((menu) => menu.id !== menuId),
    }))
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormValues({ ...formValues, [id]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`/api/menuset/${setId}`, formValues) // ใช้ PUT สำหรับการแก้ไขข้อมูล
      toast({
        variant: 'success',
        title: 'Menuset updated successfully!',
        description: 'Menuset updated successfully!',
      })
      router.push('/menuset/allmenuset')
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error updating menuset!',
        description: 'Error updating menuset!',
      })
    }
  }

  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
      <form
        onSubmit={handleSubmit}
        className='mx-auto grid min-w-[80%] flex-1 auto-rows-max gap-4'
      >
        <div className='flex items-center gap-4'>
          <Link href={'/menuset/allmenuset'}>
            <Button
              variant='outline'
              size='icon'
              className='h-7 w-7'
            >
              <ChevronLeft className='h-4 w-4' />
              <span className='sr-only'>Back</span>
            </Button>
          </Link>
          <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
            Add Menuset
          </h1>
          <div className='hidden items-center gap-2 md:ml-auto md:flex'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => router.push('/menuset/allmenuset')}
            >
              Discard
            </Button>
            <Button
              size='sm'
              type='submit'
            >
              Save Set
            </Button>
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8'>
          <div className='grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8'>
            <Card x-chunk='dashboard-07-chunk-2'>
              <CardContent className='pt-6'>
                <div className='grid gap-6 grid-cols-3'>
                  {/* select menu */}
                  <div className='grid gap-3'>
                    <Label htmlFor='menu'>Menu</Label>
                    <Select
                      onValueChange={(value) =>
                        setMenuForm({ ...menuForm, id: value })
                      }
                    >
                      <SelectTrigger
                        id='discount'
                        aria-label='Select Menu'
                      >
                        <SelectValue placeholder='Select Menu' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='null'>none</SelectItem>
                        {menus &&
                          menus.map((menu) => (
                            <SelectItem
                              key={menu.id}
                              value={menu.id}
                            >
                              {menu.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor='quantity'>Quantity</Label>
                    <Input
                      type='number'
                      id='quantity'
                      onChange={(e) =>
                        setMenuForm({ ...menuForm, quantity: e.target.value })
                      }
                    />
                  </div>
                  <div className='flex justify-start items-end'>
                    <Button onClick={addMenuIntoSet}>Add</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card x-chunk='dashboard-07-chunk-0'>
              <CardHeader>
                <CardTitle>Menuset Details</CardTitle>
              </CardHeader>
              <CardContent>
                {/* name */}
                {menus.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='w-[100px]'>#</TableHead>
                        <TableHead className='w-full'>Menu name</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead className='text-right'>Amount</TableHead>
                        <TableHead className='text-center'>
                          Actions
                        </TableHead>{' '}
                        {/* เพิ่มคอลัมน์สำหรับการลบ */}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formValues.menu.map((menu, index) => (
                        <TableRow key={menu.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{menu.name}</TableCell>
                          <TableCell>{menu.quantity}</TableCell>
                          <TableCell className='text-right'>
                            {menu.price * menu.quantity}
                          </TableCell>
                          <TableCell className='text-center'>
                            <Button
                              variant='destructive'
                              size='icon'
                              onClick={() => removeMenuFromSet(menu.id)}
                            >
                              <Trash className='h-4 w-4' />
                              <span className='sr-only'>Remove</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}

                      <TableRow className='bg-gray-200'>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell className='text-right'>
                          {formValues.menu.reduce(
                            (total, menu) => total + menu.price * menu.quantity,
                            0
                          )}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                ) : (
                  <p>No menu added yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className='grid auto-rows-max items-start gap-4 lg:gap-8'>
            <Card x-chunk='dashboard-07-chunk-3'>
              <CardHeader>
                <CardTitle>Product Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid gap-6'>
                  <div className='grid gap-3'>
                    <Label htmlFor='status'>Status</Label>
                    <Select
                      onValueChange={(value) =>
                        setFormValues({ ...formValues, status: value })
                      }
                    >
                      <SelectTrigger
                        id='status'
                        aria-label='Select status'
                      >
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Draft'>Draft</SelectItem>
                        <SelectItem value='Published'>Published</SelectItem>
                        <SelectItem value='Archived'>Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className='overflow-hidden'
              x-chunk='dashboard-07-chunk-4'
            >
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid gap-6'>
                  <div>
                    {/* input name */}
                    <Label htmlFor='name'>Name</Label>
                    <Input
                      type='text'
                      id='name'
                      value={formValues.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    {/* input name */}
                    <Label htmlFor='name'>Price</Label>
                    <Input
                      type='number'
                      id='price'
                      value={formValues.price}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className='flex items-center justify-center gap-2 md:hidden'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => router.back()}
          >
            Discard
          </Button>
          <Button
            size='sm'
            type='submit'
          >
            Save Set
          </Button>
        </div>
      </form>
    </main>
  )
}
