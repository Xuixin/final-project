'use client'
import { Hero } from '@/components/homeCmponant/home_Componant'
import {
  Menuset,
  MenuWithPro,
} from '@/components/homeCmponant/loopMenuWithPro/loopMenuwithPro'

// Import componants

export default function Home() {
  return (
    <>
      <Hero />
      <MenuWithPro />
      <div className='bg-white mb-2 rounded-xl px-8 py-5 shadow-lg'>
        <Menuset />
      </div>
    </>
  )
}
