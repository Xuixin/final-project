'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Trash2 } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import React, { useState, useEffect } from 'react'

const FormSchema = z.object({
  name: z.string().min(1, { message: 'Menu name is required.' }),
})

export default function InputForm({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  const { id } = params
  const [menuData, setMenuData] = useState([])
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [valueID, setValueID] = useState(0)
  const [quantity, setQuantity] = useState(0)
  const [selectedMenuData, setSelectedMenuData] = useState([])
  const [totalQuantity, setTotalQuantity] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      totalMenu: 0,
      price: 0,
      menu: [],
    },
  })

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get('/api/menu')
        setMenuData(response.data.data)
      } catch (error) {
        console.log('Fail to fetch menu: ', error)
      }
    }
    fetchMenu()
  }, [])

  useEffect(() => {
    const fetchMenuset = async () => {
      try {
        const response = await axios.get(`/api/menuset/${id}`)
        const menusetData = response.data
        form.setValue('name', menusetData.name)
        form.setValue('totalMenu', menusetData.totalMenu)
        form.setValue('price', menusetData.price)
        form.setValue(
          'menu',
          menusetData.details.map((detail) => ({
            ...detail.menu,
            quantity: detail.quantity,
          }))
        )
        setSelectedMenuData(
          menusetData.details.map((detail) => ({
            ...detail.menu,
            quantity: detail.quantity,
          }))
        )
        setTotalQuantity(menusetData.totalMenu)
        setTotalPrice(menusetData.price)
      } catch (error) {
        console.log('Fail to fetch menuset: ', error)
      }
    }
    fetchMenuset()
  }, [id])

  const handleIncreaseQuantity = (index) => {
    const updatedMenu = [...selectedMenuData]
    updatedMenu[index].quantity += 1
    setSelectedMenuData(updatedMenu)
    form.setValue('menu', updatedMenu)

    const newTotalQuantity = updatedMenu.reduce(
      (total, item) => total + item.quantity,
      0
    )
    setTotalQuantity(newTotalQuantity)
    form.setValue('totalMenu', newTotalQuantity)

    const newTotalPrice = updatedMenu.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
    setTotalPrice(newTotalPrice)
    form.setValue('price', newTotalPrice)
  }

  const handleDecreaseQuantity = (index) => {
    const updatedMenu = [...selectedMenuData]
    if (updatedMenu[index].quantity > 1) {
      updatedMenu[index].quantity -= 1
      setSelectedMenuData(updatedMenu)
      form.setValue('menu', updatedMenu)

      const newTotalQuantity = updatedMenu.reduce(
        (total, item) => total + item.quantity,
        0
      )
      setTotalQuantity(newTotalQuantity)
      form.setValue('totalMenu', newTotalQuantity)

      const newTotalPrice = updatedMenu.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      )
      setTotalPrice(newTotalPrice)
      form.setValue('price', newTotalPrice)
    }
  }

  const handleRemoveMenu = (index) => {
    const updatedMenu = [...selectedMenuData]
    updatedMenu.splice(index, 1)
    setSelectedMenuData(updatedMenu)
    form.setValue('menu', updatedMenu)

    const newTotalQuantity = updatedMenu.reduce(
      (total, item) => total + item.quantity,
      0
    )
    setTotalQuantity(newTotalQuantity)
    form.setValue('totalMenu', newTotalQuantity)

    const newTotalPrice = updatedMenu.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
    setTotalPrice(newTotalPrice)
    form.setValue('price', newTotalPrice)
  }

  const onSubmit = async (data) => {
    const newData = {
      name: data.name,
      totalMenu: totalQuantity,
      price: totalPrice,
      menu: form.getValues('menu').map((item) => ({
        id: item.id,
        quantity: item.quantity,
      })),
    }

    try {
      await axios.put(`/api/menuset/${id}`, newData)
      alert('success')
      router.back() // เปลี่ยนเส้นทางกลับไปยังหน้ารายการเมนูเซ็ต
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Failed to update menuset.',
      })
    }
  }

  const submitMenu = () => {
    const selectedMenu = menuData.find((menu) => menu.id === valueID)

    if (!selectedMenu) {
      console.error('Menu not found')
      return
    }

    const existingMenuIndex = selectedMenuData.findIndex(
      (menu) => menu.id === valueID
    )

    let updatedMenuData = [...selectedMenuData]

    if (existingMenuIndex !== -1) {
      updatedMenuData[existingMenuIndex].quantity += quantity
    } else {
      updatedMenuData = [...updatedMenuData, { ...selectedMenu, quantity }]
    }

    setSelectedMenuData(updatedMenuData)
    form.setValue('menu', updatedMenuData)

    const newTotalQuantity = updatedMenuData.reduce(
      (total, item) => total + item.quantity,
      0
    )
    setTotalQuantity(newTotalQuantity)
    form.setValue('totalMenu', newTotalQuantity)

    const newTotalPrice = updatedMenuData.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
    setTotalPrice(newTotalPrice)
    form.setValue('price', newTotalPrice)

    setQuantity(0)
    setValue('')
    setValueID(0)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='w-full space-y-3 border py-10 px-56 rounded bg-white '
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Menuset name</FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter menuset name'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='price'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='totalMenu'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Menu</FormLabel>
              <FormControl>
                <Input
                  disabled
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex space-x-5'>
          <Table className='mt-5 border'>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[100px]'>NO.</TableHead>
                <TableHead>Menu</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className='text-right'>Amount</TableHead>
                <TableHead className='w-[100px]'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedMenuData.length > 0 ? (
                selectedMenuData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className='font-medium'>{index + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className='flex justify-center'>
                      <Button
                        variant='outline'
                        className='mr-2'
                        type='button'
                        onClick={() => handleDecreaseQuantity(index)}
                      >
                        -
                      </Button>
                      <div>{item.quantity}</div>
                      <Button
                        variant='outline'
                        className='ml-2'
                        type='button'
                        onClick={() => handleIncreaseQuantity(index)}
                      >
                        +
                      </Button>
                    </TableCell>
                    <TableCell className='text-right'>
                      ฿ {item.price * item.quantity}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant='outline'
                        type='button'
                        className='w-full'
                        onClick={() => handleRemoveMenu(index)}
                      >
                        <Trash2 color='#ff0000' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className='text-center'
                  >
                    No menu selected
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div>
            <Popover
              open={open}
              onOpenChange={setOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={open}
                  className='w-full justify-between'
                >
                  {value
                    ? menuData.find((menu) => menu.id === valueID)?.name
                    : 'Select menu'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-full p-0'>
                <Command>
                  <CommandInput placeholder='Search framework...' />
                  <CommandList>
                    <CommandEmpty>No menu found.</CommandEmpty>
                    <CommandGroup>
                      {menuData.map((menu) => (
                        <CommandItem
                          key={menu.id}
                          onSelect={(currentValue) => {
                            setValue(menu.name)
                            setValueID(menu.id)
                            setOpen(false)
                          }}
                        >
                          {menu.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <div className='mt-5'>
              <Label htmlFor='quantity'>Quantity</Label>
              <Input
                id='quantity'
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                type='number'
                className='col-span-3'
              />
            </div>

            <Button
              type='button'
              className='w-full mt-2'
              onClick={submitMenu}
              variant='outline'
            >
              Add Menu
            </Button>
          </div>
        </div>

        <Button
          type='submit'
          className='w-full mt-5'
        >
          Update Menuset
        </Button>
      </form>
    </Form>
  )
}
