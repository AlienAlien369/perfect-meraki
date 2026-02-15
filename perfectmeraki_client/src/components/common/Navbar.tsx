"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import perfectmeraki_logo from "../../../public/assets/images/perfectmeraki_logo.jpg";
import { AnimatedRevealButton } from "./AnimatedRevealButton";

// 1️⃣  Static links
const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Workshops", href: "/workshops" },
  { name: "Products", href: "/products" },
  { name: "Catalogue", href: "/products-catalogue" },
  { name: "Sign In", href: "/signin" },
  { name: "Sign Up", href: "/signup" },
  { name: "Admin", href: "/admin/admin-dashboard" },
];

// 2️⃣  Redux types
interface AuthState {
  isAuthenticated: boolean;
  userDetails?: { name?: string; role?: string };
}
interface RootState {
  auth: AuthState;
}

// 3️⃣  URLs (kept outside JSX so we don’t paste XML)
const WHATS_APP_URL = "https://wa.link/k2vcjx";
const WHATS_APP_HELP_URL = "https://wa.link/odndf9";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  // 4️⃣  Auth state
  const { isAuthenticated, userDetails } = useSelector(
    (state: RootState) => state.auth
  );

  // 5️⃣  Filter links
  const filteredLinks = navLinks.filter((l) => {
    if (!isAuthenticated && l.name === "Admin") return false;
    if (isAuthenticated) {
      if (l.name === "Sign In" || l.name === "Sign Up") return false;
      if (l.name === "Admin" && userDetails?.role !== "admin") return false;
    }
    return true;
  });

  // 6️⃣  Navigation helper
  const navigate = (href: string) => {
    setMenuOpen(false);
    if (href.startsWith("http")) window.open(href, "_blank");
    else router.push(href);
  };

  return (
    <>
      <nav className="w-full sticky top-0 z-40 bg-white border-b border-[#e0d6c5]">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <Image
                src={perfectmeraki_logo}
                alt="Perfect Meraki"
                className="w-14 h-14 rounded-full object-cover"
                priority
                unoptimized
              />
            </button>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-6">
              {filteredLinks.map((l) => (
                <button
                  key={l.name}
                  onClick={() => navigate(l.href)}
                  className="group relative px-1 py-1"
                >
                  <span className="block text-sm text-[#2d2926] transition-all duration-300 group-hover:-translate-y-full group-hover:opacity-0">
                    {l.name}
                  </span>
                  <span className="absolute left-0 top-full text-sm text-[#63ccbb] transition-all duration-300 group-hover:top-0 group-hover:opacity-100 opacity-0">
                    {l.name}
                  </span>
                </button>
              ))}
              {isAuthenticated && userDetails?.name && (
                <>
                  <span className="text-sm text-[#2d2926]">
                    Hi {userDetails.name}
                  </span>
                  <button
                    onClick={() => {
                      dispatch({ type: "LOGOUT" });
                      if (typeof window !== "undefined") {
                        window.localStorage.clear();
                        window.sessionStorage.clear();
                        window.location.reload();
                      }
                      router.push("/signin");
                    }}
                    className="ml-3 px-3 py-1 rounded bg-[#e0d6c5] text-[#2d2926] text-xs hover:bg-[#63ccbb] hover:text-white transition"
                  >
                    Log out
                  </button>
                </>
              )}

              <AnimatedRevealButton href={WHATS_APP_URL}>
                Order Now
              </AnimatedRevealButton>

              {/* Help button */}
              <button
                onClick={() => navigate(WHATS_APP_HELP_URL)}
                className="text-2xl rounded-full w-10 h-10 border border-[#2d2926] flex items-center justify-center bg-white hover:bg-[#e0d6c5] transition"
                aria-label="Need help?"
              >
                ?
              </button>
            </div>

            {/* Mobile hamburger */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-md text-[#2d2926] focus:outline-none"
                aria-label="Toggle menu"
              >
                <span className="sr-only">Open menu</span>
                <div className="w-6 h-5 flex flex-col justify-around">
                  <span
                    className={`h-0.5 bg-[#2d2926] transition-all ${
                      menuOpen ? "rotate-45 translate-y-1.5" : ""
                    }`}
                  />
                  <span
                    className={`h-0.5 bg-[#2d2926] transition-all ${
                      menuOpen ? "opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`h-0.5 bg-[#2d2926] transition-all ${
                      menuOpen ? "-rotate-45 -translate-y-1.5" : ""
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        <div
          className={`lg:hidden fixed inset-0 z-30 bg-white/95 backdrop-blur-sm pt-24 transition-transform ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col items-center gap-6 text-lg">
            {filteredLinks.map((l) => (
              <button
                key={l.name}
                onClick={() => navigate(l.href)}
                className="hover:text-[#63ccbb]"
              >
                {l.name}
              </button>
            ))}

            {isAuthenticated && userDetails?.name && (
              <span className="text-sm">Hi {userDetails.name}</span>
            )}

            <button
              onClick={() => navigate(WHATS_APP_URL)}
              className="mt-4 px-6 py-2 rounded-full bg-[#63ccbb] text-white"
            >
              Order Now
            </button>

            <button
              onClick={() => navigate(WHATS_APP_HELP_URL)}
              className="mt-2 w-10 h-10 rounded-full border border-[#2d2926] flex items-center justify-center"
            >
              ?
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 text-3xl leading-none text-[#2d2926] hover:text-[#63ccbb]"
            aria-label="Close menu"
          >
            &times;
          </button>
        </div>
      </nav>

      {/* Overlay to close mobile menu */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-20 bg-black/20 lg:hidden"
        />
      )}
    </>
  );
}
