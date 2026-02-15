import React from "react";
import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { OutlineCTAButton } from "@/components/common/OutlineCTAButton";
import { RoundedCTAButton } from "./RoundedCTAButton";

interface ProductCardProps {
  image: string;
  type: string;
  name: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  orderLink: string;
  customizationLink: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  type,
  name,
  description,
  originalPrice,
  discountedPrice,
  orderLink,
  customizationLink,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out",
      });
    }
  }, []);

  const handleHover = () => {
    gsap.to(cardRef.current, {
      y: -5,
      duration: 0.3,
      ease: "power1.out",
    });
    if (priceRef.current) {
      gsap.to(priceRef.current, {
        scale: 1.05,
        duration: 0.3,
      });
    }
  };

  const handleHoverEnd = () => {
    gsap.to(cardRef.current, {
      y: 0,
      duration: 0.3,
      ease: "power1.out",
    });
    if (priceRef.current) {
      gsap.to(priceRef.current, {
        scale: 1,
        duration: 0.3,
      });
    }
  };

  return (
    <motion.div
      //   ref={cardRef}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={handleHover}
      onHoverEnd={handleHoverEnd}
      className="max-w-s bg-white rounded-2xl shadow-lg overflow-hidden font-sans border border-gray-100 relative group transition-all duration-300 hover:shadow-xl"
    >
      {/* Ribbon for discount */}
      <div className="absolute -right-8 -top-4 bg-black text-white text-xs font-bold px-8 py-1 transform rotate-45 z-10 shadow-md">
        {Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)}%
        OFF
      </div>

      {/* Image container with hover effect */}
      <div className="overflow-hidden relative">
        <motion.img
          src={image}
          alt={type}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
          whileHover={{ scale: 1.05 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="p-5">
        {/* Product type */}
        <h3 className="text-xl font-bold text-gray-800 mb-1">{name}</h3>
        <h2 className="text-xl font-bold text-gray-800 mb-1">{type}</h2>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 min-h-[40px]">{description}</p>

        {/* Price */}
        <div ref={priceRef} className="flex items-center gap-3 mb-4">
          <span className="text-2xl font-bold text-gray-900">
            ₹{discountedPrice}
          </span>
          <span className="line-through text-gray-400 text-sm">
            ₹{originalPrice}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <RoundedCTAButton href={orderLink}>Order Now</RoundedCTAButton>
          <OutlineCTAButton href={customizationLink}>
            Customize Now
          </OutlineCTAButton>
        </div>

        {/* Additional info */}
        {/* <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <span>★ ★ ★ ★ ★ (24)</span>
          <span className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Fast Shipping
          </span>
        </div> */}
      </div>
    </motion.div>
  );
};

export default ProductCard;
