"use-client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { useAppDispatch } from "@/store/hooks";
import { signIn } from "@/store/slices/authSlice";
import { setUser } from "@/store/slices/userSlice";
import { useRouter } from "next/router";
import { API_ROUTES } from "@/api/APIRoutes";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const floatingShapesRef = useRef<(HTMLDivElement | null)[]>([]);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    let ScrollTrigger:
      | typeof import("gsap/ScrollTrigger").ScrollTrigger
      | undefined;

    const registerAndAnimate = async () => {
      if (typeof window !== "undefined") {
        const mod = await import("gsap/ScrollTrigger");
        ScrollTrigger = mod.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);

        floatingShapesRef.current.forEach((shape, i) => {
          if (shape) {
            gsap.to(shape, {
              y: i % 2 === 0 ? -15 : 15,
              duration: 3 + i,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          }
        });

        if (containerRef.current) {
          gsap.to(containerRef.current, {
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top center",
              toggleActions: "play none none none",
            },
            backgroundColor: "rgba(236, 253, 245, 0.9)",
            duration: 2,
          });
        }
      }
    };

    registerAndAnimate();

    return () => {
      if (ScrollTrigger && typeof ScrollTrigger.getAll === "function") {
        ScrollTrigger.getAll().forEach(
          (trigger: import("gsap/ScrollTrigger").ScrollTrigger) =>
            trigger.kill()
        );
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setErrors({});
      setSuccess(false);

      try {
        const res = await fetch(`${API_ROUTES.AUTH.LOGIN}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();

        if (data.success) {
          dispatch(
            signIn({
              token: data.token,
              userDetails: {
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                role: data.user.role,
              },
            })
          );
          dispatch(
            setUser({
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              role: data.user.role,
            })
          );
          setSuccess(true);
          router.push("/");
        } else {
          setErrors({ general: "Invalid credentials" });
        }
      } catch (err: unknown) {
        setErrors({ general: "Something went wrong. Please try again." });
        console.error("Login error:", err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center p-4 overflow-hidden relative"
    >
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            floatingShapesRef.current[i] = el;
          }}
          className={`absolute hidden md:block ${
            i % 2 === 0 ? "text-emerald-300" : "text-green-400"
          }`}
          style={{
            top: `${10 + i * 15}%`,
            left: i < 3 ? `${5 + i * 10}%` : "auto",
            right: i >= 3 ? `${5 + (i - 3) * 10}%` : "auto",
            fontSize: `${1.5 + i * 0.5}rem`,
            opacity: 0.6,
          }}
        >
          {i % 2 === 0 ? "🍃" : "✨"}
        </div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <motion.h1
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-800 mb-2"
              >
                Welcome Back
              </motion.h1>
              <p className="text-gray-600">
                Sign in to your Perfect Meraki account
              </p>
            </div>

            {success ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center p-6 rounded-xl bg-green-50 border border-green-200"
              >
                <div className="text-5xl mb-4">🌟</div>
                <h3 className="text-xl font-bold text-green-800 mb-2">
                  Signed In!
                </h3>
                <p className="text-green-600">
                  You have successfully signed in.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 px-6 py-2 bg-green-600 text-white rounded-full font-medium"
                  onClick={() => {
                    window.location.href = "/";
                  }}
                >
                  Continue
                </motion.button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-5">
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.email
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300 focus:ring-emerald-500"
                      } focus:outline-none focus:ring-2 transition`}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-red-600"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.password
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300 focus:ring-emerald-500"
                      } focus:outline-none focus:ring-2 transition`}
                      placeholder="••••••••"
                    />
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-red-600"
                      >
                        {errors.password}
                      </motion.p>
                    )}
                  </motion.div>

                  {errors.general && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-2 text-sm text-red-600 text-center"
                    >
                      {errors.general}
                    </motion.p>
                  )}

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-white ${
                        isSubmitting
                          ? "bg-emerald-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-emerald-500 to-green-600 hover:shadow-lg"
                      } transition-all shadow-md`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Signing In...
                        </span>
                      ) : (
                        "Sign In"
                      )}
                    </motion.button>
                  </motion.div>
                </div>
              </form>
            )}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 text-center text-sm text-gray-600"
            >
              Don&apos;t have an account?{" "}
              <a
                href="#"
                className="font-medium text-emerald-600 hover:text-emerald-500"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/signup");
                }}
              >
                Sign up
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;
