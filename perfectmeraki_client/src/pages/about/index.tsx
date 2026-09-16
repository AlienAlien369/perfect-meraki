import React from "react";
import { motion } from "framer-motion";
import { FaHandHoldingHeart, FaLeaf } from "react-icons/fa";
import { GiLotus, GiMagicLamp, GiFountainPen } from "react-icons/gi";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const WHATS_APP_WORKSHOP_URL = "https://wa.link/zd0hs9";
const WHATS_APP_CUSTOM_URL = "https://wa.link/13h504";

const VALUES = [
  {
    icon: FaHandHoldingHeart,
    title: "Handcrafted with Passion",
    description:
      "At Perfect Meraki, we pour our soul into every piece. From the first sketch to the final polish, each creation is infused with our love for wood and traditional craftsmanship, blending ancient techniques with contemporary design.",
  },
  {
    icon: FaLeaf,
    title: "Sustainable & Natural",
    description:
      "We believe in harmony with nature. All our materials are sustainably sourced, and we use natural finishes to protect both your home and the environment - every piece carries a story of ecological responsibility.",
  },
];

const SPECIALTIES = [
  {
    icon: GiLotus,
    title: "Mandalas & Sacred Geometry",
    description: "Intricate designs that bring balance and positive energy to your space",
  },
  {
    icon: GiMagicLamp,
    title: "Lippan Art Revival",
    description: "Traditional mud relief work reimagined in wood for modern homes",
  },
  {
    icon: GiFountainPen,
    title: "Personalized Creations",
    description: "Custom nameplates and gifts that carry your unique story",
  },
];

const AboutUs = () => (
  <div className="bg-white">
    <section className="bg-sand-light py-16 px-4 sm:px-6 lg:px-8 text-center">
      <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-4xl mx-auto">
        <h1 className="font-display text-4xl md:text-6xl text-espresso mb-4">
          Our Meraki
        </h1>
        <p className="text-lg md:text-2xl text-green-dark">
          (μεράκι) &mdash; Soul, Creativity, Love
        </p>
      </motion.div>
    </section>

    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer()}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
      >
        {VALUES.map((item) => (
          <motion.div
            key={item.title}
            variants={fadeInUp}
            className="bg-white p-8 rounded-2xl shadow-sm border border-sand"
          >
            <div className="w-12 h-12 rounded-full bg-green-light flex items-center justify-center mb-4">
              <item.icon className="text-green-dark w-5 h-5" />
            </div>
            <h2 className="font-display text-2xl text-espresso mb-3">{item.title}</h2>
            <p className="text-espresso/70 leading-relaxed">{item.description}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer()}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
      >
        {SPECIALTIES.map((item) => (
          <motion.div
            key={item.title}
            variants={fadeInUp}
            className="bg-sand-light p-6 rounded-2xl border border-sand"
          >
            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
              <item.icon className="text-green-dark w-5 h-5" />
            </div>
            <h3 className="font-display text-lg text-espresso mb-2">{item.title}</h3>
            <p className="text-espresso/60 text-sm">{item.description}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeInUp}
        className="bg-espresso rounded-3xl p-8 md:p-12 text-white"
      >
        <h2 className="font-display text-3xl md:text-4xl mb-4">Creative Workshops</h2>
        <p className="text-lg text-white/70 mb-8 max-w-3xl">
          Join our immersive workshops where art comes alive. Whether you&apos;re a
          beginner or looking to refine your skills, our sessions in mandala art,
          wood painting, and Lippan craft will awaken your creativity.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href={WHATS_APP_WORKSHOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-green text-white font-semibold rounded-full hover:bg-green-dark transition-colors duration-base"
          >
            Book a Workshop
          </a>
          <a
            href={WHATS_APP_CUSTOM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors duration-base"
          >
            Custom Order
          </a>
        </div>
      </motion.div>

      <div className="mt-16 text-center">
        <p className="font-display text-xl md:text-2xl text-espresso mb-2">
          Every piece tells a story. Made by hand, made to last.
        </p>
        <p className="text-espresso/60">
          Ready to bring Perfect Meraki into your home? Let&apos;s create something
          beautiful together.
        </p>
      </div>
    </div>
  </div>
);

export default AboutUs;
