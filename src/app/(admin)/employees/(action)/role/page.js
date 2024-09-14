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
import { useEffect, useState } from 'react'
import axios from 'axios'

const FormSchema = z.object({
  name: z.string().min(1, { message: 'name is required.' }),
  wagepermonth: z.string().min(1, { message: 'wagepermonth is required.' }), // category will store categoryId
})

export default function InputForm() {
  const { toast } = useToast()
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      wagepermonth: 0,
      wageperday: 0,
    },
  })

  const handleChangeWage = (event) => {
    event.preventDefault()
    const wpm = event.target.value

    // Here you can calculate the wage based on the selected category
    form.setValue('wagepermonth', wpm) // Example calculation
    form.setValue('wageperday', wpm / 30) // Example calculation
  }

  const onSubmit = async (data) => {
    const newData = {
      name: data.name,
      wagepermonth: data.wagepermonth,
      wageperday: form.getValues('wageperday'),
    }

    try {
      const response = await axios.post('/api/employee/role', newData)
      toast({
        variant: 'success',
        title: 'Success',
        description: 'New role created successfully',
      });

      router.push('/employees')

    } catch (error) {
      console.log('Fail to create new role: ' + error.message)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='w-full space-y-6 border py-10 px-56 rounded bg-white'
      >
        {/* Menu Name Field */}
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role Name</FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter role name'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category Field */}
        <FormField
          control={form.control}
          name='wagepermonth'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wage per month</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => handleChangeWage(e)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category Field */}
        <FormField
          control={form.control}
          name='wageperday'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wage per day</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  )
}
