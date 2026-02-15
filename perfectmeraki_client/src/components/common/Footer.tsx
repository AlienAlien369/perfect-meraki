import { useRouter } from "next/router";
import {
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoCall } from "react-icons/io5";

const WORKSHOP_TYPES = [
  "corperate team building",
  "festival themed",
  "fridge magnets",
  "kids",
  "lipan art",
  "mandala",
  "nameplate",
];
const PRODUCT_TYPES = [
  "nameplates",
  "spiritual hangings",
  "kitchen decor",
  "fridge magnets",
  "danglers",
  "evil eye",
  "jarokha",
  "mandala mirrors",
  "kids special",
  "key holders",
];

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="relative z-10 bg-black text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <button
              onClick={() => router.push("/")}
              className="flex items-center focus:outline-none"
            >
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-600">
                Perfect Meraki
              </span>
            </button>
            <p className="text-gray-400 text-sm leading-relaxed">
              Crafting digital experiences that inspire and transform. We blend
              creativity with technology to bring your vision to life.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/perfectmeraki?igsh=M3kzdGhubmE2MXRv"
                className="text-gray-400 hover:text-emerald-400 transition-colors duration-300"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              {/* <a
                href="#"
                className="text-gray-400 hover:text-green-500 transition-colors duration-300"
              >
                <FaTwitter className="w-5 h-5" />
              </a>*/}
              <a
                href="https://wa.me/8860646364"
                className="text-gray-400 hover:text-green-600 transition-colors duration-300"
              >
                <FaWhatsapp className="w-5 h-5" />
              </a> 
              <a
                href="https://youtube.com/@perfectmerakii?si=aQbsG6Vgw_kLoBUa"
                className="text-gray-400 hover:text-emerald-500 transition-colors duration-300"
              >
                <FaYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => router.push("/about")}
                  className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 text-sm text-left w-full"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push("/services")}
                  className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 text-sm text-left w-full"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push("/portfolio")}
                  className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 text-sm text-left w-full"
                >
                  Portfolio
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push("/blog")}
                  className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 text-sm text-left w-full"
                >
                  Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push("/contact")}
                  className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 text-sm text-left w-full"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Services Section */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">
              Our Workshops
            </h3>
            <ul className="space-y-3 mb-8">
              {WORKSHOP_TYPES.map((workshop) => (
                <li key={workshop}>
                  <button
                    onClick={() =>
                      router.push(
                        `/workshops/${workshop
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`
                      )
                    }
                    className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 text-sm text-left w-full capitalize"
                  >
                    {workshop}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">
              Our Products
            </h3>
            <ul className="space-y-3">
              {PRODUCT_TYPES.map((product) => (
                <li key={product}>
                  <button
                    onClick={() =>
                      router.push(
                        `/products/${product
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`
                      )
                    }
                    className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 text-sm text-left w-full capitalize"
                  >
                    {product}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">
              Stay Updated
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for the latest updates and insights.
            </p>
            <form className="flex flex-col space-y-4">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-gray-500 text-sm"
                required
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity duration-300 text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-800 p-3 rounded-full">
                <IoCall className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Call Us</p>
                <p className="text-white font-medium">+91 8860646364</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gray-800 p-3 rounded-full">
                <MdEmail className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email Us</p>
                <p className="text-white font-medium">
                  perfectmerakii@gmail.com
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gray-800 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-emerald-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Visit Us</p>
                <p className="text-white font-medium">
                  Sector - 17 , Rohini , Delhi
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 mt-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Perfect Meraki. All rights
            reserved.
          </p>
          <div className="flex justify-center space-x-6 mt-4">
            <button
              onClick={() => router.push("/privacy-policy")}
              className="text-gray-500 hover:text-emerald-400 text-sm transition-colors duration-300"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => router.push("/terms-of-service")}
              className="text-gray-500 hover:text-emerald-400 text-sm transition-colors duration-300"
            >
              Terms of Service
            </button>
            <button
              onClick={() => router.push("/cookies")}
              className="text-gray-500 hover:text-emerald-400 text-sm transition-colors duration-300"
            >
              Cookie Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
