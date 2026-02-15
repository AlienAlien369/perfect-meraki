import React from "react";
import { motion, useAnimation } from "framer-motion";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { FiArrowRight } from "react-icons/fi";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99],
      staggerChildren: 0.1,
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const cardHover = {
  hover: {
    y: -10,
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
};

const Products = () => {
  const router = useRouter();
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const collections = [
    {
      name: "Nameplates",
      description: "Custom wooden nameplates that tell your story",
      color: "bg-amber-100",
    },
    {
      name: "Spiritual Hangings",
      description: "Sacred designs that bring positive energy",
      color: "bg-indigo-100",
    },
    {
      name: "Kitchen Decor",
      description: "Functional art for your culinary space",
      color: "bg-red-100",
    },
    {
      name: "Fridge Magnets",
      description: "Whimsical kitchen companions",
      color: "bg-blue-100",
    },
    {
      name: "Danglers",
      description: "Delicate dances with the wind",
      color: "bg-green-100",
    },
    {
      name: "Evil Eye",
      description: "Ancient protection modernized",
      color: "bg-purple-100",
    },
    {
      name: "Jarokha",
      description: "Traditional window-inspired art",
      color: "bg-rose-100",
    },
    {
      name: "Mandala Mirrors",
      description: "Hypnotic circular reflections",
      color: "bg-teal-100",
    },
    {
      name: "Kids Special",
      description: "Playful creations for young minds",
      color: "bg-yellow-100",
    },
  ];

  return (
    <section className="relative w-full flex justify-center items-center pt-12 pb-16 px-6 md:px-16 bg-gradient-to-b from-[#faf9f7] to-[#f5f3f0] overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-purple-300 mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-amber-200 mix-blend-multiply filter blur-xl animate-float-delay"></div>
      </div>

      <div className="relative text-center max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={fadeInUp}
          className="mb-16 text-center"
        >
          <motion.h1
            className="text-3xl md:text-5xl md:text-7xl font-bold text-[#2d2926] mb-6 tracking-tight leading-tight"
            whileHover={{ scale: 1.02 }}
          >
            <span className="relative inline-block">
              <span className="relative z-10">Our Handcrafted</span>
              <span className="absolute bottom-0 left-0 w-full h-3 bg-amber-200 opacity-40 -z-0"></span>
            </span>
            <br />
            <span className="text-[#63ccbb]">Collections</span>
          </motion.h1>

          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            whileHover={{ scale: 1.01 }}
          >
            Explore signature pieces blending tradition with contemporary design
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {collections.map((item, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              whileHover="hover"
              initial="hidden"
              animate={controls}
              className="group relative overflow-hidden"
            >
              <motion.div
                variants={cardHover}
                className={`h-full p-8 rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 bg-white relative z-10`}
              >
                {/* Color accent */}
                <div
                  className={`absolute top-0 left-0 w-full h-1 ${item.color}`}
                ></div>

                <h3 className="text-2xl text-center font-bold text-[#2d2926] mb-3 tracking-tight leading-tight">
                  {item.name}
                </h3>

                <p className="text-gray-600 text-center mb-6 min-h-[60px]">
                  {item.description}
                </p>

                <div className="flex justify-center">
                  <motion.button
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      router.push(
                        `/products/${item.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`
                      )
                    }
                    className="flex text-center items-center gap-2 text-[#2d2926] group-hover:text-[#4a044e] transition-colors font-medium"
                  >
                    <span>View Collection</span>
                    <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </motion.button>
                </div>
              </motion.div>

              {/* Decorative background element */}
              <div
                className={`absolute inset-0 rounded-xl ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-0`}
              ></div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Floating decorative elements */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        @keyframes float-delay {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-25px) rotate(-5deg);
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float-delay 10s ease-in-out infinite 2s;
        }
      `}</style>
    </section>
  );
};

export default Products;
