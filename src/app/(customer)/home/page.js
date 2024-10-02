'use client'
import { Hero } from '@/components/homeCmponant/home_Componant'
import {
  Menuset,
  MenuWithPro,
} from '@/components/homeCmponant/loopMenuWithPro/loopMenuwithPro'

// Import componants

export default function Home() {
  return (
    <section className="">
      <Hero />
      <MenuWithPro />
      <div className="relative mb-2 px-8 py-5 shadow-lg"> {/* ใช้ relative ที่นี่ */}
        <div className="absolute inset-0 bg-primary bg-opacity-40 backdrop-blur-md"></div>
        <Menuset />
      </div>
    </section>
  );
}

