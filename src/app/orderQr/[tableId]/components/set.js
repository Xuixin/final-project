
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import BestSeller from '@/components/ui/bestseller'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { usePathname } from 'next/navigation'
import { useQr } from '../../qrContext'



export const SetMenuCom = () => {
    const [menuSet, setMenuSet] = useState([])
    const { addToCartSet } = useQr()

    useEffect(() => {
        const fetchMenuSet = async () => {
            try {
                const response = await axios.get('/api/menuset')
                setMenuSet(response.data)
            } catch (error) {
                console.error('Error fetching menu set:', error)
            }
        }
        fetchMenuSet()
    }, [])

    return (
        <div className='w-full'>
            <h2 className='text-3xl font-semibold text-center mb-4'>Menu Set</h2>
            <div className='w-full grid gap-4 px-5'>
                {menuSet &&
                    menuSet.map((item) => {
                        return (
                            <ScrollArea
                                key={item.id}
                                className='h-72 w-full rounded-2xl border shadow-lg  bg-white'
                            >
                                <div className="pb-3">
                                    <div className=' top-0 flex bg-white justify-between items-center px-4 h-14 mb-15 sticky'>

                                        <h4 className='mb-4 text-lg font-semibold leading-none'>
                                            {item.name}
                                        </h4>
                                        <div className='flex items-center relative'>
                                            <Button
                                                className='ml-2'
                                                onClick={() => addToCartSet(item)} // เรียกใช้ฟังก์ชันเพิ่ม MenuSet เข้า cartSet
                                            >
                                                Add to cart {' RM ' + item.price.toFixed(2) + ' '}
                                                <span className="absolute rounded-full text-black  line-through decoration-red-400 top-0 right-0 p-2">
                                                    {item.details.reduce((total, m) => total + (m.menu.price * m.quantity), 0)}
                                                </span>
                                            </Button>

                                        </div>
                                    </div>
                                    <div className='space-y-2 px-3 mt-2'>
                                        {item.details.map((menu, index) => {
                                            return (
                                                <div
                                                    key={index}
                                                    className='max-h-16 border-b rounded-lg'
                                                >
                                                    <div className='grid grid-cols-4 gap-2 px-2'>
                                                        <Image
                                                            src={menu.menu.img}
                                                            alt={menu.menu.name}
                                                            width={48}
                                                            height={48}
                                                            className='rounded'
                                                        />
                                                        <h6 className='text-sm font-medium leading-none flex items-center'>
                                                            {menu.menu.name}
                                                        </h6>
                                                        <p className='text-sm flex items-center'>
                                                            {menu.quantity} unit
                                                        </p>
                                                        <p className='text-sm flex justify-center items-center'>
                                                            RM {(menu.quantity * menu.menu.price).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <Separator className='my-2' />
                                </div>
                            </ScrollArea>
                        )
                    })}
            </div>
        </div>
    )
}