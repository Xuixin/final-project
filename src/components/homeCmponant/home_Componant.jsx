'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CircleArrowRight } from 'lucide-react';
import { motion, useInView, useAnimation } from "framer-motion";

export const Hero = () => {
  const router = useRouter();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView]);

  return (
    <section
      ref={ref}
      className="relative flex items-center justify-center min-h-screen mb-8 overflow-hidden"
    >
      <Image
        src="/banner.jpg"
        alt="Restaurant banner"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="absolute z-0"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-10"></div>

      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="relative z-20 text-center text-white px-4 max-w-4xl"
      >
        <h1 className="text-5xl font-bold mb-6">
          Welcome to Our <AnimatedText text="Restaurant" className="text-primary" />
        </h1>
        <p className="text-xl mb-8 text-gray-300">
          Discover our specialties, delicious dishes, and unparalleled service.
        </p>
        <Button
          className="rounded-full text-lg font-semibold px-8 py-4"
          onClick={() => router.push('/menu')}
        >
          Order Now <CircleArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10"
      ></motion.div>
    </section>
  );
};

const AnimatedText = ({ text, className }) => {
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      x: -20,
      y: 10,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.span
      style={{ display: "inline-block" }}
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={child}
          style={{ display: "inline-block" }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
};