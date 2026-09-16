"use client";

import React from "react";
import Typewriter from "typewriter-effect";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import heroGif from "../../../public/assets/gifs/House.gif";
import workshopImg from "../../../public/assets/gifs/shop.gif";
import { OutlineCTAButton } from "../../components/common/OutlineCTAButton";
import { RoundedCTAButton } from "../../components/common/RoundedCTAButton";
import { FaHandHoldingHeart, FaLeaf, FaHeart, FaCheckCircle } from "react-icons/fa";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const WHATS_APP_URL = "https://wa.link/k2vcjx";
const WHATS_APP_HELP_URL = "https://wa.link/odndf9";

const FEATURES = [
  {
    icon: FaHandHoldingHeart,
    title: "Handcrafted",
    description: "Each piece meticulously made by hand with attention to detail",
  },
  {
    icon: FaLeaf,
    title: "Natural Materials",
    description: "Using sustainable wood and eco-friendly finishes",
  },
  {
    icon: FaHeart,
    title: "Made with Meraki",
    description: "Infused with passion, creativity, and soul",
  },
];

const WORKSHOP_HIGHLIGHTS = [
  "Mandala Art on Wood",
  "Lippan Craft Techniques",
  "Wood Painting Fundamentals",
  "Custom Nameplate Making",
];

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white text-espresso overflow-hidden">
      {/* Hero Section */}
      <section className="relative z-10 grid w-full grid-cols-1 items-center gap-10 px-6 py-16 text-left md:grid-cols-2 md:px-10 md:py-24">
        <div>
          <motion.h1
            className="font-display text-4xl font-semibold sm:text-5xl md:text-6xl leading-tight"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <span className="block text-espresso">
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
            <span className="block mt-2 text-green">
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
            className="mt-6 max-w-md text-lg text-espresso/70"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
            Welcome to <strong className="text-green-dark">Perfect Meraki</strong> –
            where every piece tells a story of culture, creativity, and
            meticulous craftsmanship.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap gap-4"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.4 }}
          >
            <RoundedCTAButton href="/products">Explore Artworks</RoundedCTAButton>
            <OutlineCTAButton href="/workshops">Book a Workshop</OutlineCTAButton>
          </motion.div>
        </div>

        <motion.div
          className="relative flex items-center justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="absolute -inset-12 z-0 rounded-full bg-green/15 blur-3xl" />
          <div className="relative z-10 w-[280px] md:w-[380px] lg:w-[420px]">
            <Image
              src={heroGif}
              alt="Handcrafted wood art showcase"
              width={500}
              height={500}
              className="w-full h-auto object-contain drop-shadow-md"
              priority
              unoptimized
            />
          </div>
        </motion.div>
      </section>

      {/* Brand Promise */}
      <section className="px-6 py-16 md:px-16 bg-sand-light">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer()}
        >
          {FEATURES.map((item) => (
            <motion.div
              key={item.title}
              className="bg-white p-6 rounded-2xl shadow-sm border border-sand hover:shadow-md transition-shadow duration-base"
              variants={fadeInUp}
            >
              <div className="w-12 h-12 rounded-full bg-green-light flex items-center justify-center mb-4">
                <item.icon className="text-green-dark w-5 h-5" />
              </div>
              <h3 className="font-display text-xl text-espresso mb-2">
                {item.title}
              </h3>
              <p className="text-espresso/60">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Workshops Section */}
      <section className="py-20 px-6 md:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute -inset-6 rounded-2xl bg-green/10 -z-10" />
            <Image
              src={workshopImg}
              width={480}
              height={360}
              alt="Creative workshop session"
              className="rounded-2xl shadow-lg w-full h-auto"
              unoptimized
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl text-espresso">
              Creative Workshops &amp; Experiences
            </h2>
            <p className="mt-4 text-espresso/60">
              Immerse yourself in the art of craftsmanship with our hands-on
              workshops. Perfect for individuals, corporate teams, and
              creative events.
            </p>

            <div className="mt-6 space-y-4">
              {WORKSHOP_HIGHLIGHTS.map((item) => (
                <div key={item} className="flex items-start">
                  <FaCheckCircle className="mt-1 flex-shrink-0 h-5 w-5 text-green" />
                  <p className="ml-3 text-espresso/80">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <RoundedCTAButton href="/workshops">Browse Workshops</RoundedCTAButton>
              <OutlineCTAButton href={WHATS_APP_HELP_URL}>
                Custom Event Inquiry
              </OutlineCTAButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 md:px-16 bg-espresso text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="font-display text-3xl md:text-4xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            Ready to Bring Artistry into Your Space?
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-white/70"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.15 }}
          >
            Whether you&apos;re looking for a custom piece or want to
            experience the joy of creating, we&apos;re here to make it happen.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.3 }}
          >
            <a
              href={WHATS_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-green px-8 py-3 font-semibold text-white transition-colors duration-base hover:bg-green-dark shadow-md hover:shadow-lg"
            >
              Get a Custom Quote
            </a>
            <Link
              href="/products-catalogue"
              className="inline-block rounded-full border-2 border-white px-8 py-3 font-semibold text-white transition-colors duration-base hover:bg-white/10"
            >
              Browse Collections
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
