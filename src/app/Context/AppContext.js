'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const AppContext = createContext()

export default function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState([])
  const [cartSet, setCartSet] = useState([]) // สำหรับจัดการ MenuSet
  const [orderId, setOrderId] = useState(null)
  const router = useRouter()

  // ดึงข้อมูลผู้ใช้เมื่อมี token
  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      const userId = parseJwt(token).userId

      axios
        .get(`/api/customer/${userId}`)
        .then((response) => {
          const data = response.data
          if (data.error) {
            console.error(data.error)
          } else {
            setUser(data)
          }
        })
        .catch((error) => {
          console.error('Error fetching user:', error)
        })
    }




  }, [])

  //admin 



  const login = (token) => {
    localStorage.setItem('token', token)
    const userId = parseJwt(token).userId

    axios
      .get(`/api/customer/${userId}`)
      .then((response) => {
        const data = response.data
        if (data.error) {
          console.error(data.error)
        } else {
          setUser(data)
        }
      })
      .catch((error) => {
        console.error('Error fetching user:', error)
      })

    router.push('/home')
  }

  const clearOrderId = () => {
    setOrderId(null)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setCart([])
    setCartSet([])
    router.push('/login')
  }


  // ฟังก์ชันสำหรับจัดการ Cart ปกติ
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id)
      if (existingItem) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        )
      } else {
        return [...prevCart, item]
      }
    })
  }

  // ฟังก์ชันสำหรับลบจาก Cart ปกติ
  const minusfromCart = (item) => {
    const newCart = [...cart]
    const index = newCart.findIndex((i) => i.id === item.id)
    if (index !== -1 && newCart[index].quantity > 1) {
      newCart[index].quantity--
    }
    setCart(newCart)
  }

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId))
  }

  // ฟังก์ชันสำหรับจัดการ MenuSet
  const addToCartSet = (item) => {
    const newCartSet = [...cartSet]
    const existingItem = newCartSet.find((i) => i.id === item.id)

    if (existingItem) {
      newCartSet.forEach((i) => {
        if (i.id === item.id) {
          i.details = i.details.map((detail) => {
            const existingDetail = item.details.find(
              (newDetail) => newDetail.menuId === detail.menuId
            )
            if (existingDetail) {
              return {
                ...detail,
                quantity: detail.quantity + existingDetail.quantity,
              }
            } else {
              return detail
            }
          })

          // อัปเดต totalMenu ตามจำนวนเมนูที่เพิ่มเข้ามา
          i.totalMenu = i.details.reduce(
            (total, detail) => total + detail.quantity,
            0
          )

          i.price = i.price + item.price
        }
      })
    } else {
      // ถ้าไม่มีอยู่ใน cartSet ให้เพิ่ม item และคำนวณ totalMenu
      newCartSet.push({
        ...item,
        totalMenu: item.details.reduce(
          (total, detail) => total + detail.quantity,
          0
        ),
      })
    }

    setCartSet(newCartSet)
  }

  const minusfromCartSet = (item) => {
    const newCartSet = [...cartSet]
    const index = newCartSet.findIndex((i) => i.id === item.id)
    if (index !== -1) {
      const detailIndex = newCartSet[index].details.findIndex((detail) => detail.id === item.details[0].id)
      if (detailIndex !== -1 && newCartSet[index].details[detailIndex].quantity > 1) {
        newCartSet[index].details[detailIndex].quantity--
      } else {
        newCartSet.splice(index, 1)
      }
    }
    setCartSet(newCartSet)
  }

  const removeFromCartSet = (itemid) => {
    const newCartSet = [...cartSet]
    newCartSet.splice(newCartSet.findIndex((item) => item.id === itemid), 1)
    setCartSet(newCartSet)
  }

  // นับจำนวนสินค้าใน Cart ทั้งแบบปกติและ MenuSet
  const cartCount = () => {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
    const cartSetCount = cartSet.reduce((total, item) => total + item.details.reduce((total, detail) => total + detail.quantity, 0), 0)

    return cartCount + cartSetCount
  }

  const clearCart = () => {
    setCart([])
    setCartSet([]) // ล้าง MenuSet เมื่อเคลียร์ Cart
  }

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        cart,
        cartSet,
        login,
        logout,
        addToCart,
        addToCartSet,
        removeFromCart,
        removeFromCartSet,
        clearCart,
        cartCount,
        minusfromCart,
        minusfromCartSet,
        orderId,
        setOrderId,
        clearOrderId
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}

function parseJwt(token) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )

  return JSON.parse(jsonPayload)
}
