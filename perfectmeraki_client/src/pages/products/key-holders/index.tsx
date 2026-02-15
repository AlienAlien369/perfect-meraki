import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ProductCard from "@/components/common/ProductCard";
import { FiAlertCircle, FiLoader } from "react-icons/fi";
import { API_ROUTES } from "@/api/APIRoutes";

type Product = {
  _id: string;
  image: string;
  name: string;
  type: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  orderLink: string;
  customizationLink: string;
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const SpiritualHangingsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(
          `${API_ROUTES.PRODUCTS.GET_BY_TYPE}`,
          { type: "key holders" },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProducts(response.data.data || []);
      } catch {
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProducts();
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      {/* <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Our <span className="text-[#63ccbb]">Handcrafted</span> Collection
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover unique pieces crafted with passion and precision
        </p>
      </motion.div> */}

      {/* Content Area */}
      <div className="max-w-7xl mx-auto">
        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <FiLoader className="h-12 w-12 text-indigo-500 animate-spin mb-4" />
              <p className="text-gray-600 text-lg">Loading our collection...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-xl mb-8"
            >
              <FiAlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-red-600 text-lg text-center max-w-md">
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <AnimatePresence>
          {!loading && !error && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-8"
            >
              {products.length > 0 ? (
                products.map((product) => (
                  <motion.div
                    key={product._id}
                    variants={fadeIn}
                    whileHover={{ y: -5 }}
                    className="h-full"
                  >
                    <ProductCard
                      image={product.image}
                      type={product.type}
                      name={product.name}
                      description={product.description}
                      originalPrice={product.originalPrice}
                      discountedPrice={product.discountedPrice}
                      orderLink=""
                      customizationLink=""
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-20"
                >
                  <div className="text-gray-500 text-lg">
                    No products found. Check back later!
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-100 rounded-full opacity-10 blur-xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-100 rounded-full opacity-10 blur-xl"></div>
      </div>
    </div>
  );
};

export default SpiritualHangingsPage;
