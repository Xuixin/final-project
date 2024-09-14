'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'

//import ui
import { useAppContext } from '@/app/Context/AppContext'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '../ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { useRouter } from 'next/navigation'

export function OrderDetails({ order, fetchOrder }) {
  // เพิ่ม fetchOrder
  const { toast } = useToast()
  const router = useRouter()

  const deleteOrder = async () => {
    if (order.status === 'กำลังดำเนินการ') {
      toast({
        variant: 'destructive',
        title: 'ยกเลิกไม่สำเร็จ',
        description: 'เนื่องจากออเดอร์กำลังปรุงแล้ว',
      })
      return
    }
    try {
      await axios.delete(`/api/order/online/${order.orderId}`)
      toast({
        variant: 'success',
        title: 'ยกเลิกออเดอร์แล้ว.',
      })
      // Refresh the order list after deleting
      await fetchOrder() // เรียก fetchOrder เพื่อรีเฟรชข้อมูลในหน้า parent
      router.refresh()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to delete order.',
      })
    }
  }

  return (
    <>
      <DialogContent className='max-w-[425px] lg:max-h-[425px] lg:overflow-auto'>
        <DialogHeader className={'grid grid-cols-2'}>
          <div>
            <DialogTitle>OL{order.orderId}</DialogTitle>
            <DialogDescription>
              Order At{' '}
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                month: 'short', // ใช้ 'short' เพื่อแสดงชื่อเดือนย่อ (เช่น Feb)
                day: '2-digit', // แสดงวันเป็น 2 หลัก (เช่น 04)
                year: 'numeric', // แสดงปีแบบเต็ม (เช่น 2024)
              })}
            </DialogDescription>
          </div>

          {order.status !== 'Finished' && (
            <div className='flex justify-end'>
              <Button
                variant='destructive'
                className='w-[40%]'
                onClick={() => deleteOrder()}
              >
                Cancel
              </Button>
            </div>
          )}
        </DialogHeader>
        {order.normalmenu.length > 0 && (
          <DialogDescription>Menu</DialogDescription>
        )}

        <div className='grid gap-4 py-4 px-5'>
          {order.normalmenu.length > 0 &&
            order.normalmenu.map((menu) => {
              return (
                <div
                  key={menu.id}
                  className='grid grid-cols-4 items-center gap-4'
                >
                  <Label
                    htmlFor='name'
                    className='text-left col-span-3'
                  >
                    {menu.name}
                  </Label>
                  <Label
                    htmlFor='name'
                    className='text-right '
                  >
                    X {menu.quantity}
                  </Label>
                </div>
              )
            })}
        </div>
        {order.normalmenu.length > 0 && (
          <DialogDescription>Menuset</DialogDescription>
        )}
        <div className='grid gap-4 py-4'>
          {order.setmenu.length > 0 &&
            order.setmenu.map((set) => {
              return (
                <div
                  key={set.setId}
                  className='grid grid-cols-4 items-start gap-4'
                >
                  <Label
                    htmlFor='name'
                    className=' text-start'
                  >
                    {set.setName}
                  </Label>
                  <div className='col-span-3'>
                    {set.details.map((menu) => {
                      return (
                        <div
                          key={menu.id}
                          className='grid gap-2 grid-cols-2'
                        >
                          <Label
                            htmlFor='name'
                            className='text-left'
                          >
                            {menu.name}
                          </Label>
                          <Label
                            htmlFor='name'
                            className='text-right'
                          >
                            X {menu.quantity}
                          </Label>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
        </div>
      </DialogContent>
    </>
  )
}
export function EditProfile() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const { user, setUser } = useAppContext()
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    address: '',
    tel: '',
  })

  useEffect(() => {
    if (user == null) {
      router.push('/login')
      return
    }
    console.log('user', user)

    setFormData({
      name: user.name || '',
      lastname: user.lastname || '',
      email: user.email,
      address: user.address || '',
      tel: user.tel || '',
    })
  }, [user])

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    toast({
      title: 'Updating profile...',
      description: 'Please wait while we update your information.',
      status: 'info',
      duration: 2000,
      isClosable: true,
    })

    try {
      console.log('formData', formData)
      const response = await axios.post(`/api/customer/${user.id}`, formData)

      console.log('API response:', response.data.updateResponse) // ตรวจสอบโครงสร้างของ response.data

      if (response.status === 200) {
        // ตรวจสอบว่าข้อมูลอยู่ใน response.data.updateResponse หรือไม่
        await setUser([])
        await setUser(response.data.updateResponse || response.data) // ใช้ข้อมูลที่ถูกต้อง
        toast({
          variant: 'success',
          title: 'Profile updated!',
          description: 'Your profile has been successfully updated.',
          status: 'success',
          duration: 3000,
          action: <ToastAction altText='Try again'>Done</ToastAction>,
        })
      }
    } catch (error) {
      console.error('Failed to update profile', error)
      toast({
        title: 'Update failed',
        description: 'There was an error updating your profile.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DialogContent className='sm:max-w-[425px]'>
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label
              htmlFor='name'
              className='text-right'
            >
              Name
            </Label>
            <Input
              id='name'
              value={formData.name}
              onChange={handleInputChange}
              className='col-span-3'
              disabled={loading}
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label
              htmlFor='lastname'
              className='text-right'
            >
              LastName
            </Label>
            <Input
              id='lastname'
              value={formData.lastname}
              onChange={handleInputChange}
              className='col-span-3'
              disabled={loading}
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label
              htmlFor='email'
              className='text-right'
            >
              Email
            </Label>
            <Input
              id='email'
              value={formData.email}
              onChange={handleInputChange}
              className='col-span-3'
              disabled={loading}
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label
              htmlFor='address'
              className='text-right'
            >
              Address
            </Label>
            <Input
              id='address'
              value={formData.address}
              onChange={handleInputChange}
              className='col-span-3'
              disabled={loading}
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label
              htmlFor='tel'
              className='text-right'
            >
              Tel
            </Label>
            <Input
              id='tel'
              value={formData.tel}
              onChange={handleInputChange}
              className='col-span-3'
              disabled={loading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type='submit'
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
