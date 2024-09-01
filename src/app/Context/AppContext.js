'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const AppContext = createContext()

export default function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState([])
  const router = useRouter()

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

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setCart([])
    router.push('/login')
  }

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

  useEffect(() => {
    console.log('cart', cart)
  }, [cart])

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId))
  }

  const cartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <AppContext.Provider
      value={{
        user,
        cart,
        login,
        logout,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount,
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
