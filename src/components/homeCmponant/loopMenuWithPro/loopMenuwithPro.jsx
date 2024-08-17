"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function MenuWithPro() {
  const [menusDiscount, setMenusDiscount] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get("/api/menu/withDiscount");
        setMenusDiscount(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const response = await axios.get("/api/promotion");
        setDiscounts(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPromotion();
  }, []);

  const getDiscountAmount = (discountId) => {
    const discount = discounts.find((d) => d.id === discountId);
    return discount ? discount.discount : 0;
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 4, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 4, menusDiscount.length - 4)
    );
  };

  return (
    <div className="relative">
      <div className="relative overflow-hidden">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 relative px-10">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
            variant={"outline"}
          >
            <ChevronLeft />
          </Button>
          {menusDiscount.slice(currentIndex, currentIndex + 4).map((item) => {
            const discountAmount = getDiscountAmount(item.discountId);
            const finalPrice = item.price - discountAmount;
            return (
              <div key={item.id} className="border rounded p-4">
                <div className="relative w-full h-24"> {/* Set a fixed height for the image container */}
                  <Image
                    src={item.img}
                    alt={item.name}
                    layout="fill" /* Fill the container */
                    objectFit="cover" /* Ensure the image covers the container */
                    className="rounded" /* Optional: styling */
                  />
                </div>
                <h2 className="text-lg font-semibold ">{item.name}</h2>
                <p className="text-red-500 line-through text-xs">
                  RM {item.price.toFixed(2)}
                </p>
                <p className="text-green-500 font-bold">
                  RM {finalPrice.toFixed(2)}
                </p>
              </div>
            );
          })}
          <Button
            onClick={handleNext}
            disabled={currentIndex >= menusDiscount.length - 4}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
            variant={"outline"}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
