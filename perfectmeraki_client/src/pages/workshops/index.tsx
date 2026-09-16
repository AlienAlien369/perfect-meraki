import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { FiArrowRight } from "react-icons/fi";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const WORKSHOPS = [
  {
    name: "Mandala Art on Wood",
    type: "mandala",
    description:
      "Unlock inner peace and creativity as you learn to paint intricate mandala designs on wooden bases. Perfect for beginners and art lovers.",
  },
  {
    name: "Lippan Art Workshop",
    type: "lipan art",
    description:
      "Discover the beauty of this traditional Kutch art form, reimagined on wooden boards using mirrors, mud, and vibrant colors.",
  },
  {
    name: "Customized Wooden Nameplate Making",
    type: "nameplate",
    description:
      "Personalize your space with a nameplate designed and painted by you! Great for gifting or adding charm to your home.",
  },
  {
    name: "Fridge Magnet Painting",
    type: "fridge magnets",
    description:
      "A fun, short-format workshop where you paint tiny wooden magnets - ideal for kids, families, or casual creative breaks.",
  },
  {
    name: "Kids Craft Sessions",
    type: "kids",
    description:
      "Specially curated for little artists with safe materials and easy-to-follow techniques that encourage creativity and confidence.",
  },
  {
    name: "Corporate Team-Building Workshops",
    type: "corperate team building",
    description:
      "Interactive, creative sessions perfect for breaking the ice, sparking innovation, and bringing teams together through art.",
  },
  {
    name: "Festival & Themed Workshops",
    type: "festival themed",
    description:
      "Celebrate Holi, Diwali, Christmas, or any special occasion with themed workshops - add a handmade touch to your festivities.",
  },
];

const VIDEOS = [
  "/assets/videos/successful_workshop_video1.mp4",
  "/assets/videos/successful_workshop_video2.mp4",
  "/assets/videos/successful_workshop_video3.mp4",
];

const Workshops = () => {
  const router = useRouter();

  return (
    <>
      <section className="w-full flex justify-center items-center pt-12 pb-16 px-6 md:px-16 bg-sand-light">
        <div className="text-center max-w-7xl mx-auto w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mb-16"
          >
            <h1 className="font-display text-3xl md:text-5xl text-espresso mb-4">
              Our Creative <span className="text-green">Workshops</span>
            </h1>
            <p className="text-lg text-espresso/60 max-w-2xl mx-auto">
              Explore signature techniques blending tradition with contemporary design
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer()}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {WORKSHOPS.map((item) => (
              <motion.div
                key={item.type}
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                className="h-full p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-base border border-sand bg-white"
              >
                <h3 className="font-display text-xl text-center text-espresso mb-3">
                  {item.name}
                </h3>
                <p className="text-espresso/60 text-center mb-6 min-h-[60px]">
                  {item.description}
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => router.push(`/workshops/${item.type.toLowerCase()}`)}
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

      <section className="py-16 px-6 md:px-16">
        <div className="text-center max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mb-12"
          >
            <h2 className="font-display text-3xl md:text-5xl text-espresso mb-4">
              Our Successful <span className="text-green">Workshops</span>
            </h2>
            <p className="text-lg text-espresso/60 max-w-2xl mx-auto">
              A glimpse into the sessions we&apos;ve run
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer()}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {VIDEOS.map((src) => (
              <motion.video
                key={src}
                variants={fadeInUp}
                width="100%"
                height="auto"
                controls
                className="rounded-xl shadow-md"
              >
                <source src={src} type="video/mp4" />
                Your browser does not support the video tag.
              </motion.video>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Workshops;
