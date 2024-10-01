'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
// UI import
import { Button } from '@/components/ui/button';
import { CircleArrowRight } from 'lucide-react';
import ReactTypingEffect from 'react-typing-effect';
import { motion, useInView, useAnimation, Variant } from "framer-motion";

export const Hero = () => {
  const router = useRouter();


  return (
    <section
      className="flex justify-end items-center min-h-96 mb-8 shadow-lg rounded-b-[30%] relative"
      style={{
        backgroundImage: `url("/banner.jpg")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm rounded-b-[30%]"></div>
      <div className="relative px-4 grid h-full rounded-lg text-white">
        <div className="w-full">
          <h1 className="text-4xl font-semibold flex">
            Welcome to Our <AnimatedText
              once
              text="Restaurant"
              el="span"
              className="text-4xl mx-2 text-primary"
            />
          </h1>
          <p className="my-4 text-gray-300">
            Discover our specialties, delicious dishes, and unparalleled service.
          </p>
        </div>
        <div className="space-x-5">
          <Button
            className="rounded-full gap-2 uppercase text-white px-4 py-2 text-sm"
            onClick={() => router.push('/menu')}
          >
            Order now
            <CircleArrowRight />
          </Button>
        </div>
      </div>
    </section>
  );
};


const AnimatedText = ({
  text,
  el: Wrapper = "p",
  className,
  once,
  repeatDelay,
  animation,
}) => {
  const controls = useAnimation();
  const textArray = Array.isArray(text) ? text : [text];
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5, once });

  useEffect(() => {
    let timeout;
    const show = () => {
      controls.start("visible");
      if (repeatDelay) {
        timeout = setTimeout(async () => {
          await controls.start("hidden");
          controls.start("visible");
        }, repeatDelay);
      }
    };

    if (isInView) {
      show();
    } else {
      controls.start("hidden");
    }

    return () => clearTimeout(timeout);
  }, [isInView]);

  return (
    <Wrapper className={className}>
      <span className="sr-only">{textArray.join(" ")}</span>
      <motion.span
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
          hidden: {},
        }}
        aria-hidden
      >
        {textArray.map((line, lineIndex) => (
          <span className="block" key={`${line}-${lineIndex}`}>
            {line.split(" ").map((word, wordIndex) => (
              <span className="inline-block" key={`${word}-${wordIndex}`}>
                {word.split("").map((char, charIndex) => (
                  <motion.span
                    key={`${char}-${charIndex}`}
                    className="inline-block"
                    variants={animation}
                  >
                    {char}
                  </motion.span>
                ))}
                <span className="inline-block">&nbsp;</span>
              </span>
            ))}
          </span>
        ))}
      </motion.span>
    </Wrapper>
  );
};
