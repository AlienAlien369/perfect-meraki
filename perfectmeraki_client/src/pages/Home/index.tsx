"use client";

import React from "react";
// import Navbar from "@/components/common/Navbar";
import Typewriter from "typewriter-effect";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import heroGif from "../../../public/assets/gifs/House.gif";
// import mandalaImg from "../../../public/assets/images/mandala.jpg";
// import lippanImg from "../../../public/assets/images/lippan.jpg";
// import nameplateImg from "../../../public/assets/images/nameplate.jpg";
import workshopImg from "../../../public/assets/gifs/shop.gif";
import { OutlineCTAButton } from "../../components/common/OutlineCTAButton";
import { RoundedCTAButton } from "../../components/common/RoundedCTAButton";
// import Footer from "@/components/common/Footer";

// import Testimonials from "@/components/Testimonials";
// import Footer from "@/components/Footer";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-br from-[#f9f5f0] via-white to-[#f0f7f5] text-[#2d2926] overflow-hidden">
      {/*  */}
      {/* <Navbar /> */}
      {/* Hero Section */}
      <section className="relative z-10 grid w-full grid-cols-1 items-center gap-6 px-6 text-left md:grid-cols-2 md:px-10 ">
        <div>
          <motion.h1
            className="text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl leading-tight"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <span className="block text-[#2d2926]">
              <Typewriter
                options={{
                  strings: ["Timeless Creations", "Artisan Craftsmanship"],
                  autoStart: true,
                  loop: true,
                  delay: 50,
                  deleteSpeed: 30,
                  cursor: "",
                }}
              />
            </span>
            <span className="block mt-3 bg-gradient-to-r from-[#5db8a8] via-[#3a8a7a] to-[#5db8a8] bg-clip-text text-transparent">
              <Typewriter
                options={{
                  strings: ["Made with Passion", "Crafted with Love"],
                  autoStart: true,
                  loop: true,
                  delay: 50,
                  deleteSpeed: 30,
                  cursor: "",
                }}
              />
            </span>
          </motion.h1>

          <motion.p
            className="mt-6 max-w-md text-lg text-gray-700"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
            Welcome to{" "}
            <strong className="text-[#3a8a7a]">Perfect Meraki</strong> – where
            every piece tells a story of culture, creativity, and meticulous
            craftsmanship.
          </motion.p>

          <motion.div
            className="mt-8 flex gap-4"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.4 }}
          >
            <RoundedCTAButton href="/gallery">
              Explore Artworks
            </RoundedCTAButton>
            <OutlineCTAButton href="/workshops">Book Workshop</OutlineCTAButton>
          </motion.div>
        </div>

        <motion.div
          className="relative flex items-center justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {/* Soft glow behind image (optional, artistic touch) */}
          <div className="absolute -inset-12 z-0 rounded-full bg-[#63ccbb]/20 blur-3xl" />

          {/* The image itself — clean, unboxed */}
          <div className="relative z-10 w-[280px] md:w-[380px] lg:w-[420px]">
            <Image
              src={heroGif}
              alt="Handcrafted wood art showcase"
              width={500}
              height={500}
              className="w-full h-auto object-contain drop-shadow-md"
              priority
            />
          </div>
        </motion.div>
      </section>
      {/* Brand Promise */}
      <section className="mt-24 px-6 md:px-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {[
            {
              icon: "🖐️",
              title: "Handcrafted",
              description:
                "Each piece meticulously made by hand with attention to detail",
            },
            {
              icon: "🌿",
              title: "Natural Materials",
              description: "Using sustainable wood and eco-friendly finishes",
            },
            {
              icon: "❤️",
              title: "Made with Meraki",
              description: "Infused with passion, creativity, and soul",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              variants={fadeInUp}
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-[#3a8a7a] mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Workshops Section */}
      <section className="mt-32 bg-[#f9f5f0] py-20 px-6 md:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute -inset-6 rounded-2xl bg-[#5db8a8]/10 -z-10"></div>
            <Image
              src={workshopImg}
              width={28}
              height={28}
              alt="Creative workshop session"
              className="rounded-xl shadow-lg w-full h-auto"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-[#2d2926]">
              Creative Workshops & Experiences
            </h2>
            <p className="mt-4 text-gray-600">
              Immerse yourself in the art of craftsmanship with our hands-on
              workshops. Perfect for individuals, corporate teams, and creative
              events.
            </p>

            <div className="mt-6 space-y-4">
              {[
                "Mandala Art on Wood",
                "Lippan Craft Techniques",
                "Wood Painting Fundamentals",
                "Custom Nameplate Making",
              ].map((item, idx) => (
                <div key={idx} className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg
                      className="h-5 w-5 text-[#5db8a8]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-700">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <RoundedCTAButton href="/workshops">
                Browse Workshops
              </RoundedCTAButton>
              <OutlineCTAButton href="/contact">
                Custom Event Inquiry
              </OutlineCTAButton>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Testimonials */}
      {/* <Testimonials /> */}
      {/* Final CTA */}
      <section className="py-20 px-6 md:px-16 bg-[#3a8a7a] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            Ready to Bring Artistry into Your Space?
          </motion.h2>
          <motion.p
            className="mt-4 text-lg opacity-90"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
            Whether you&#39;re looking for a custom piece or want to experience
            the joy of creating, we&#39;re here to make it happen.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/contact"
              className="inline-block rounded-full bg-white px-8 py-3 text-[#3a8a7a] font-semibold transition hover:bg-gray-100 shadow-md hover:shadow-lg"
            >
              Get a Custom Quote
            </Link>
            <Link
              href="/collections"
              className="inline-block rounded-full border-2 border-white px-8 py-3 text-white font-semibold transition hover:bg-white/10"
            >
              Browse Collections
            </Link>
          </motion.div>
        </div>
      </section>
      {/* <Footer /> */}
    </div>
  );
}
