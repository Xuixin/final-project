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
  roleId: z.string().min(1, { message: 'role is required.' }),
})

export default function EmployeeUpdateForm({ params }) {
  const { toast } = useToast()
  const { id } = params
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
    const fetchEmp = async () => {
      try {
        // Fetch employee data based on ID
        const employeeResponse = await axios.get(`/api/employee/role`)
        setRoles(employeeResponse.data) // Assuming your API returns an array of categories

      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }

    fetchEmp()
  }, [params.id])
  useEffect(() => {
    console.log(id)
    const fetchEmp = async () => {
      try {
        // Fetch employee data based on ID
        const employeeResponse = await axios.get(`/api/employee/emp/${id}`)
        console.log(employeeResponse.data.name)
        form.setValue('name', employeeResponse.data.name)
        form.setValue('lastname', employeeResponse.data.lastname)
        form.setValue('email', employeeResponse.data.email)
        form.setValue('address', employeeResponse.data.address)
        form.setValue('roleId', employeeResponse.data.role.id)
        S
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }

    fetchEmp()
  }, [params.id])

  const onSubmit = async (data) => {
    console.log(data)
    const selectedRole = roles.find((role) => role.name === data.roleId)
    if (!selectedRole) {
      console.error('Selected role not found.')
      return
    }

    console.log('role', selectedRole.id)

    try {
      const updatedData = {
        ...data,
        roleId: selectedRole.id,
      }

      await axios.post(`/api/employee/emp/${params.id}`, updatedData)

      alert('Update successful!')
      router.push('/employees') // Redirect to the employee list or a specific page
    } catch (error) {
      console.error('Update failed:', error)
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
                  placeholder='Enter lastname'
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
              <FormLabel>Email</FormLabel>
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
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter address'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Role Field */}
        <FormField
          control={form.control}
          name='roleId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
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

        <Button type='submit'>Update</Button>
      </form>
    </Form>
  )
}
