'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { useAppContext } from '@/app/Context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronDown, ShoppingBag, Tag } from 'lucide-react'
import Link from 'next/link'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Menuset } from '../homeCmponant/loopMenuWithPro/loopMenuwithPro'
import { fetchUserInfo } from '@/lib/userInfo'

const CategoryButton = ({ selected, onClick, children }) => (
  <Button
    onClick={onClick}
    variant={selected ? "default" : "outline"}
    className={`
      rounded-full px-4 py-2 transition-all duration-200
      ${selected ? 'shadow-lg scale-105' : 'hover:scale-105'}
    `}
  >
    {children}
  </Button>
)

const MenuCard = ({ item, onAddToCart, user }) => {
  const finalPrice = item.price - (item.discount?.discount || 0)

  const addToCartButton = user ? (
    <Button
      className="w-full group"
      onClick={() => onAddToCart({ ...item, quantity: 1 })}
    >
      <ShoppingBag className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
      Add to Cart
    </Button>
  ) : (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Button asChild className="w-full">
              <Link href="/login">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Sign in to Order
              </Link>
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Please sign in to place an order</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={item.img}
            alt={item.name}
            layout="fill"
            objectFit="cover"
            className="transform hover:scale-105 transition-transform duration-300"
          />
          {item.discount && (
            <Badge
              variant="destructive"
              className="absolute top-2 right-2"
            >
              <Tag className="w-4 h-4 mr-1" />
              Save RM {item.discount.discount.toFixed(2)}
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">
            {item.name}
          </h3>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-green-600">
              RM {finalPrice.toFixed(2)}
            </span>
            {item.discount && (
              <span className="text-sm text-muted-foreground line-through">
                RM {item.price.toFixed(2)}
              </span>
            )}
          </div>
          {addToCartButton}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function Menu() {
  const [menu, setMenu] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [visibleCategories, setVisibleCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const { addToCart } = useAppContext()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get('/api/menu')
        const publishedMenu = response.data.filter(
          (item) => item.status === 'Published'
        )

        const categoriesWithMenu = publishedMenu.reduce((acc, item) => {
          const category = acc.find((c) => c.id === item.categoryId)
          if (category) {
            category.menu.push(item)
          } else {
            acc.push({
              id: item.category.id,
              name: item.category.name,
              menu: [item],
            })
          }
          return acc
        }, [])

        setMenu(categoriesWithMenu)
        setVisibleCategories(categoriesWithMenu.slice(0, 3))
      } catch (error) {
        console.error('Error fetching menu:', error)
      }
    }

    fetchMenu()
  }, [])

  useEffect(() => {
    const getUserAndFetchOrders = async () => {
      try {
        const userData = await fetchUserInfo()
        setUser(userData)
      } catch (error) {
        console.error('Failed to fetch user info:', error)
      }
    }
    getUserAndFetchOrders()
  }, [])

  const filteredMenu = selectedCategory
    ? menu.filter((category) => category.id === selectedCategory)
    : menu

  const handleCategorySwap = (category) => {
    const updatedVisibleCategories = [...visibleCategories]
    updatedVisibleCategories[2] = category
    setVisibleCategories(updatedVisibleCategories)
    setSelectedCategory(category.id)
  }

  const filteredItems = filteredMenu
    .map((category) => ({
      ...category,
      menu: category.menu.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.menu.length > 0)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryButton
            selected={!selectedCategory}
            onClick={() => setSelectedCategory(null)}
          >
            All Categories
          </CategoryButton>

          {visibleCategories.map((category) => (
            <CategoryButton
              key={category.id}
              selected={selectedCategory === category.id}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </CategoryButton>
          ))}

          {menu.length > visibleCategories.length && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-full">
                  More <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {menu.slice(visibleCategories.length).map((category) => (
                  <DropdownMenuItem
                    key={category.id}
                    onClick={() => handleCategorySwap(category)}
                  >
                    {category.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search menu..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <AnimatePresence>
        {filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">No menu items found.</p>
          </motion.div>
        ) : (
          filteredItems.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-12"
            >
              <CardHeader className="px-0">
                <CardTitle className="text-3xl font-bold capitalize">
                  {category.name}
                </CardTitle>
              </CardHeader>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.menu.map((item) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    onAddToCart={addToCart}
                    user={user}
                  />
                ))}
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>

      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Special Set Menus</CardTitle>
        </CardHeader>
        <CardContent>
          <Menuset />
        </CardContent>
      </Card>
    </div>
  )
}