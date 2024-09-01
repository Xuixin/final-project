'use client'
import {Hero} from '@/components/homeCmponant/home_Componant'
import { Menuset, MenuWithPro } from '@/components/homeCmponant/loopMenuWithPro/loopMenuwithPro'

// Import componants

export default function Home() {
  return (
    <>
      <Hero />
      <MenuWithPro />
      <Menuset />
    </>
  )
}
