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
  image: z.any().optional(),
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
      image: null, // Image is initially set to null
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

    console.log('role', selectedRoles)

    // try {
    //   const formData = new FormData()

    //   if (data.image && data.image[0]) {
    //     // data.image is a FileList object
    //     formData.append('file', data.image[0]) // Assuming you want to upload the first file
    //   }

    //   // Upload the image
    //   const imageResponse = await axios.post(
    //     'http://localhost:3001/api/upload',
    //     formData,
    //     {
    //       headers: {
    //         'Content-Type': 'multipart/form-data',
    //       },
    //     }
    //   )

    //   console.log('Image upload response:', imageResponse.data)

    //   // Prepare and send the rest of the form data
    //   const newData = {
    //     ...data,
    //     roleId: selectedRoles.id,
    //     image: imageResponse.data.filePath, // Add the image URL to your form data
    //   }

    //   // Send form data to the main API endpoint
    //   await axios.post('/api/menu', newData)

    //   toast({
    //     title: 'Submission successful.',
    //     description: 'Your data has been submitted successfully.',
    //   })

    //   router.back()
    // } catch (error) {
    //   console.error('Submission failed:', error)
    //   toast({
    //     title: 'Submission failed.',
    //     description: error.response?.data?.message || 'Something went wrong.',
    //   })
    // }
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

        {/* Image Upload Field */}
        <FormField
          control={form.control}
          name='image'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                  <Input
                    type='file'
                    accept='image/*'
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                </div>
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
