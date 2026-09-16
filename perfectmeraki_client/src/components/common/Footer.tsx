import { useRouter } from "next/router";
import { FaInstagram, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoCall, IoLocationSharp } from "react-icons/io5";

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

const QUICK_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Workshops", href: "/workshops" },
  { label: "Products", href: "/products" },
  { label: "Catalogue", href: "/products-catalogue" },
];

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="relative z-10 bg-espresso text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <button
              onClick={() => router.push("/")}
              className="flex items-center focus:outline-none"
            >
              <span className="font-display text-2xl text-teal">Perfect Meraki</span>
            </button>
            <p className="text-white/60 text-sm leading-relaxed">
              Handcrafted resin and wood decor, made piece by piece with
              intention - nameplates, wall art, and gifts that carry a little
              soul (that&apos;s the &ldquo;meraki&rdquo;).
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/perfectmeraki?igsh=M3kzdGhubmE2MXRv"
                className="text-white/60 hover:text-teal transition-colors duration-base"
                aria-label="Perfect Meraki on Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/8860646364"
                className="text-white/60 hover:text-teal transition-colors duration-base"
                aria-label="Chat with Perfect Meraki on WhatsApp"
              >
                <FaWhatsapp className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com/@perfectmerakii?si=aQbsG6Vgw_kLoBUa"
                className="text-white/60 hover:text-teal transition-colors duration-base"
                aria-label="Perfect Meraki on YouTube"
              >
                <FaYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => router.push(link.href)}
                    className="text-white/60 hover:text-teal transition-colors duration-base text-sm text-left w-full"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Workshops */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Our Workshops</h3>
            <ul className="space-y-3 mb-8">
              {WORKSHOP_TYPES.map((workshop) => (
                <li key={workshop}>
                  <button
                    onClick={() =>
                      router.push(`/workshops/${workshop.toLowerCase().replace(/\s+/g, "-")}`)
                    }
                    className="text-white/60 hover:text-teal transition-colors duration-base text-sm text-left w-full capitalize"
                  >
                    {workshop}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Our Products</h3>
            <ul className="space-y-3">
              {PRODUCT_TYPES.map((product) => (
                <li key={product}>
                  <button
                    onClick={() =>
                      router.push(`/products/${product.toLowerCase().replace(/\s+/g, "-")}`)
                    }
                    className="text-white/60 hover:text-teal transition-colors duration-base text-sm text-left w-full capitalize"
                  >
                    {product}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* WhatsApp CTA */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Custom order?</h3>
            <p className="text-white/60 text-sm mb-4">
              Tell us what you have in mind and we&apos;ll bring it to life.
            </p>
            <a
              href="https://wa.link/k2vcjx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-teal text-espresso px-6 py-3 rounded-lg font-medium hover:bg-teal-dark hover:text-white transition-colors duration-base text-sm"
            >
              <FaWhatsapp className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-white/10 pt-8 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 p-3 rounded-full">
                <IoCall className="w-5 h-5 text-teal" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Call Us</p>
                <p className="text-white font-medium">+91 8860646364</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 p-3 rounded-full">
                <MdEmail className="w-5 h-5 text-teal" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Email Us</p>
                <p className="text-white font-medium">perfectmerakii@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 p-3 rounded-full">
                <IoLocationSharp className="w-5 h-5 text-teal" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Visit Us</p>
                <p className="text-white font-medium">Sector 17, Rohini, Delhi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 mt-8 text-center">
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} Perfect Meraki. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
