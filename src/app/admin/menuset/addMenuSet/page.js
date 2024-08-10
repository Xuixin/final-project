'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
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
  TableCaption,
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
import { useState, useEffect } from 'react'

const FormSchema = z.object({
  name: z.string().min(1, { message: 'Menu name is required.' }),
})

export default function InputForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [menuData, setMenuData] = useState([])

  useEffect(() => {
    try {
      const fetchMenu = async () => {
        const response = await axios.get('/api/menu')
        setMenuData(response.data)
      }
    } catch (error) {}
  }, [])

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      totalMenu: 0,
      price: 0,
      menu: [],
    },
  })

  const addMenuForm = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      quantity: 0,
    },
  })

  const onSubmit = async (data) => {
    console.log('Submitted data:', data)

    try {
      await axios.post('/api/menutype', data)
      toast({
        title: 'Submission successful!',
        description: 'Succcess',
      })
      alert('sucess')
    } catch (error) {
      toast({
        title: 'Submission failed.',
        description: error.response?.data?.message || 'Something went wrong.',
        variant: 'destructive',
      })
    }
  }

  const subminMenu = (data) => {
    console.log('Submitted data:', data)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='w-full space-y-3 border py-10 px-56 rounded bg-white '
      >
        {/* Menu Name Field */}
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
              <FormLabel>price</FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter price'
                  {...field}
                />
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

        <Table className='mt-5 border'>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px]'>NO.</TableHead>
              <TableHead>Menu</TableHead>
              <TableHead>Qauntity</TableHead>
              <TableHead className='text-right'>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menu && menu.length > 0 ? (
              menu.map((item) => (
                <TableRow key={item.menu}>
                  <TableCell className='font-medium'>{item.menu}</TableCell>
                  <TableCell>{item.paymentStatus}</TableCell>
                  <TableCell>{item.paymentMethod}</TableCell>
                  <TableCell className='text-right'>
                    {item.totalAmount}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan='4'
                  className='text-center'
                >
                  No menu found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className='w-full'>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant='outline'>Add</Button>
            </PopoverTrigger>
            <PopoverContent className='w-80'>
              <div className='grid gap-4'>
                <div className='space-y-2'>
                  <h4 className='font-medium leading-none'>Form</h4>
                  <p className='text-sm text-muted-foreground'>
                    Add menu into menuset
                  </p>
                </div>
                <div className='grid gap-2'>
                  <div className='grid grid-cols-3 items-center gap-4'>
                    <Label htmlFor='width'>menu</Label>
                    <Input className='col-span-2 h-8' />
                  </div>
                  <div className='grid grid-cols-3 items-center gap-4'>
                    <Label htmlFor='maxHeight'>Quantity</Label>
                    <Input
                      defaultValue='0'
                      className='col-span-2 h-8'
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className='w-full flex justify-center'>
          <Button
            className=''
            type='submit'
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  )
}
