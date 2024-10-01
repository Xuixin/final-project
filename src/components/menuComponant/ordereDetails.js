'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'

//import ui
import { Loader2 } from 'lucide-react'
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
import { parseJwt } from '@/lib/jwt'

export function OrderDetails({ order, fetchOrder }) {
  // เพิ่ม fetchOrder
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const deleteOrder = async () => {
    setIsLoading(true)
    if (order.status === 'InProgress') {
      toast({
        variant: 'destructive',
        title: 'ยกเลิกไม่สำเร็จ',
        description: 'เนื่องจากออเดอร์กำลังปรุงแล้ว',
      })
      return
    }
    try {
      await axios.post(`/api/order/online/cancel/${order.orderId}`)
      toast({
        variant: 'success',
        title: 'ยกเลิกออเดอร์แล้ว.',
      })
      await fetchOrder()
      router.refresh()
      setIsLoading(false)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to delete order.',
      })
      setIsLoading(false)
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

          {order.status === 'InQueue' && (
            <div className='flex justify-end'>
              {isLoading ? (
                <Button
                  disabled
                  variant={'destructive'}
                  className='w-[40%]'
                >
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  cancelling
                </Button>
              ) : (
                <Button
                  variant='destructive'
                  className='w-[40%]'
                  onClick={() => deleteOrder()}
                >
                  Cancel
                </Button>
              )}
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
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    address: '',
    tel: '',
  });

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const userId = parseJwt(token).userId;

      const fetchUser = async () => {
        const response = await axios.get(`/api/customer/${userId}`);
        const fetchedUser = response.data;
        setUser(fetchedUser);
        setFormData({
          name: fetchedUser.name || '',
          lastname: fetchedUser.lastname || '',
          email: fetchedUser.email || '',
          address: fetchedUser.address || '',
          tel: fetchedUser.tel || '',
        });
      };

      fetchUser();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast({
      title: 'Updating profile...',
      description: 'Please wait while we update your information.',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });

    try {
      const response = await axios.post(`/api/customer/${user.id}`, formData);
      if (response.status === 200) {
        setUser(response.data.updateResponse || response.data);
        toast({
          variant: 'success',
          title: 'Profile updated!',
          description: 'Your profile has been successfully updated.',
          status: 'success',
          duration: 3000,
          action: <ToastAction altText="Try again">Done</ToastAction>,
        });
      }
    } catch (error) {
      console.error('Failed to update profile', error);
      toast({
        title: 'Update failed',
        description: 'There was an error updating your profile.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              className="col-span-3"
              disabled={loading}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastname" className="text-right">
              LastName
            </Label>
            <Input
              id="lastname"
              value={formData.lastname}
              onChange={handleInputChange}
              className="col-span-3"
              disabled={loading}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              className="col-span-3"
              disabled={loading}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Address
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={handleInputChange}
              className="col-span-3"
              disabled={loading}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tel" className="text-right">
              Tel
            </Label>
            <Input
              id="tel"
              value={formData.tel}
              onChange={handleInputChange}
              className="col-span-3"
              disabled={loading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

