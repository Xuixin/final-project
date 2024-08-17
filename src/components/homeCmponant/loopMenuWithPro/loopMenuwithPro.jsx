'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'

export default function MenuWithPro() {
  const [menusDiscount, setMenusDiscount] = useState([])
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get('/api/promotion')
        setMenusDiscount(response.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchMenu()
  }, [])
  return (
    <div>
      <h1>Menu with Pro</h1>
      {/* Menu components */}
    </div>
  )
}
