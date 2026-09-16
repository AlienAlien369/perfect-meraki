import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/common/ProductCard";
import { FiAlertCircle } from "react-icons/fi";
import { API_ROUTES } from "@/api/APIRoutes";
import Spinner from "@/components/common/Spinner";
import { fadeIn, staggerContainer } from "@/lib/motion";

type Product = {
  _id: string;
  name: string;
  image: string;
  type: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
};

const PAGE_TITLE = "Spiritual Hangings";
const FETCH_TYPE = "spiritual hangings";

const waLink = (action: "order" | "customize", p: Product) =>
  `https://api.whatsapp.com/send?phone=918860646364&text=${encodeURIComponent(
    `I would like to ${action === "order" ? "order" : "customize the order for"} the ${p.name}, ${p.type} from your website. ${p.description}`
  )}`;

const SpiritualHangingsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        API_ROUTES.PRODUCTS.GET_BY_TYPE,
        { type: FETCH_TYPE },
        { headers: { "Content-Type": "application/json" } }
      );
      setProducts(response.data.data || []);
    } catch {
      setError("Failed to fetch products. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="min-h-screen bg-sand-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-5xl text-espresso mb-3">
            {PAGE_TITLE}
          </h1>
          <p className="text-espresso/60 max-w-xl mx-auto">
            Discover unique pieces crafted with passion and precision
          </p>
        </div>

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20"
            >
              <Spinner size={40} label="Loading our collection..." />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-2xl mb-8"
            >
              <FiAlertCircle className="h-10 w-10 text-red-500 mb-4" />
              <p className="text-red-600 text-center max-w-md">{error}</p>
              <button
                onClick={fetchProducts}
                className="mt-4 px-6 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-fast"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!loading && !error && (
            <motion.div
              variants={staggerContainer()}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
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
                      name={product.name}
                      type={product.type}
                      description={product.description}
                      originalPrice={product.originalPrice}
                      discountedPrice={product.discountedPrice}
                      orderLink={waLink("order", product)}
                      customizationLink={waLink("customize", product)}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-20"
                >
                  <p className="text-espresso/50 text-lg">
                    No products found. Check back later!
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SpiritualHangingsPage;
