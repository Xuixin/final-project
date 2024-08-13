'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  lastname: z.string().min(1, { message: 'lastname is required.' }),
  address: z.string().min(1, { message: 'address is required.' }),
  email: z.string().min(1, { message: 'email is required.' }),
  roleId: z.string().min(0, { message: 'role is required.' }),
})

export default function InputForm() {
  const { toast } = useToast()
  const router = useRouter()
  const [roles, setRoles] = useState([])
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      lastname: '',
      email: '',
      address: '',
      roleId: '',
    },
  })

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await axios.get('/api/employee/role')
        setRoles(response.data) // Assuming your API returns an array of categories
      } catch (error) {
        console.error('Failed to fetch role:', error)
      }
    }

    fetchRole()
  }, [])

  const onSubmit = async (data) => {
    console.log(data)
    const selectedRoles = roles.find((role) => role.name === data.roleId)
    if (!selectedRoles) {
      console.error('Selected role not found.')
      return
    }

    console.log('role', selectedRoles.id)

    try {
      const formData = new FormData()
      // Prepare and send the rest of the form data
      const newData = {
        ...data,
        roleId: selectedRoles.id,
      }

      // Send form data to the main API endpoint
      await axios.post('/api/employee/emp', newData)

      alert('success')
      router.back()
    } catch (error) {
      console.error('Submission failed:', error)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='w-full space-y-6 border py-10 px-56 rounded bg-white'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter name'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='lastname'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lastname</FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter  lastname'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>email</FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter email'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='address'
          render={({ field }) => (
            <FormItem>
              <FormLabel>address</FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter  address'
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
          name='roleId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                  }}
                  value={field.value}
                  placeholder='Select role'
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select role' />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem
                        key={role.id}
                        value={role.name}
                      >
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
