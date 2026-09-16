import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { FiArrowRight } from "react-icons/fi";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const COLLECTIONS = [
  { name: "Nameplates", description: "Custom wooden nameplates that tell your story" },
  { name: "Spiritual Hangings", description: "Sacred designs that bring positive energy" },
  { name: "Kitchen Decor", description: "Functional art for your culinary space" },
  { name: "Fridge Magnets", description: "Whimsical kitchen companions" },
  { name: "Danglers", description: "Delicate dances with the wind" },
  { name: "Evil Eye", description: "Ancient protection modernized" },
  { name: "Jarokha", description: "Traditional window-inspired art" },
  { name: "Mandala Mirrors", description: "Hypnotic circular reflections" },
  { name: "Kids Special", description: "Playful creations for young minds" },
];

const Products = () => {
  const router = useRouter();

  return (
    <section className="w-full flex justify-center items-center pt-12 pb-16 px-6 md:px-16 bg-sand-light">
      <div className="text-center max-w-7xl mx-auto w-full">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mb-16">
          <h1 className="font-display text-3xl md:text-5xl text-espresso mb-4">
            Our Handcrafted <span className="text-green">Collections</span>
          </h1>
          <p className="text-lg text-espresso/60 max-w-2xl mx-auto">
            Explore signature pieces blending tradition with contemporary design
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer()}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {COLLECTIONS.map((item) => (
            <motion.div
              key={item.name}
              variants={fadeInUp}
              whileHover={{ y: -6 }}
              className="h-full p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-base border border-sand bg-white"
            >
              <h3 className="font-display text-xl text-center text-espresso mb-3">
                {item.name}
              </h3>
              <p className="text-espresso/60 text-center mb-6 min-h-[48px]">
                {item.description}
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() =>
                    router.push(`/products/${item.name.toLowerCase().replace(/\s+/g, "-")}`)
                  }
                  className="flex items-center gap-2 text-green-dark hover:text-green font-medium transition-colors duration-fast"
                >
                  <span>View Collection</span>
                  <FiArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Products;
