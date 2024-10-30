'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'

//import ui
import { Loader2, AlertCircle } from 'lucide-react'
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
import { ScrollArea } from '../ui/scroll-area'
import { Separator } from '../ui/separator'
import {
  Alert,
  AlertDescription,
  AlertTitle,

} from "@/components/ui/alert"


export function OrderDetails({ order, fetchOrder }) {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const deleteOrder = async () => {
    if (order.status === 'InProgress') {
      toast({
        variant: 'destructive',
        title: 'ยกเลิกไม่สำเร็จ',
        description: 'เนื่องจากออเดอร์กำลังปรุงแล้ว',
      })
      return
    }

    setIsLoading(true)
    try {
      await axios.post(`/api/order/online/cancel/${order.orderId}`)
      toast({
        variant: 'success',
        title: 'ยกเลิกออเดอร์แล้ว',
        description: 'ออเดอร์ของคุณถูกยกเลิกเรียบร้อยแล้ว',
      })
      await fetchOrder()
      router.refresh()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถยกเลิกออเดอร์ได้ กรุณาลองใหม่อีกครั้ง',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="flex justify-between items-center">
          <span>ออเดอร์ #{order.orderId}</span>
          {order.status === 'InQueue' && (
            <Button
              variant="destructive"
              size="sm"
              onClick={deleteOrder}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  กำลังยกเลิก
                </>
              ) : (
                'ยกเลิกออเดอร์'
              )}
            </Button>
          )}
        </DialogTitle>
        <DialogDescription>
          สั่งเมื่อ {formatDate(order.createdAt)}
        </DialogDescription>
      </DialogHeader>

      <ScrollArea className="h-[50vh] pr-4">
        {order.status === 'InQueue' && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>โปรดทราบ</AlertTitle>
            <AlertDescription>
              คุณสามารถยกเลิกออเดอร์ได้เฉพาะเมื่อสถานะเป็น "รอดำเนินการ" เท่านั้น
            </AlertDescription>
          </Alert>
        )}

        {order.normalmenu.length > 0 && (
          <>
            <h4 className="text-sm font-medium mb-2">รายการอาหาร</h4>
            {order.normalmenu.map((menu) => (
              <div key={menu.id} className="flex justify-between items-center py-2">
                <span>{menu.name}</span>
                <span className="font-medium">x{menu.quantity}</span>
              </div>
            ))}
            <Separator className="my-4" />
          </>
        )}

        {order?.setmenu?.length > 0 && (
          <>
            <h4 className="text-sm font-medium mb-2">ชุดอาหาร</h4>
            {order.setmenu.map((set) => (
              <div key={set.setId} className="mb-4">
                <h5 className="font-medium">{set.setName}</h5>
                {set.details.map((menu) => (
                  <div key={menu.id} className="flex justify-between items-center py-1 pl-4">
                    <span className="text-sm">{menu.name}</span>
                    <span className="text-sm font-medium">x{menu.quantity}</span>
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
      </ScrollArea>

      <div className="mt-4 flex justify-between items-center font-medium">
        <span>ยอดรวมทั้งสิ้น</span>
        <span>฿{order.totalPrice.toFixed(2)}</span>
      </div>
    </DialogContent>
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

