"use-client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { API_ROUTES } from "@/api/APIRoutes";
import { useRouter } from "next/router";

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const SignUp = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Verification states
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // OTP states
  const [emailOTP, setEmailOTP] = useState("");
  const [sentEmailOTP, setSentEmailOTP] = useState("");
  const [emailOTPSent, setEmailOTPSent] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);

  const [phoneOTP, setPhoneOTP] = useState("");
  const [sentPhoneOTP, setSentPhoneOTP] = useState("");
  const [phoneOTPSent, setPhoneOTPSent] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const floatingShapesRef = useRef<(HTMLDivElement | null)[]>([]);

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
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
    // Reset verification if email or phone changes
    if (name === "email") {
      setIsEmailVerified(false);
      setEmailOTPSent(false);
      setEmailOTP("");
    }
    if (name === "phoneNumber") {
      setIsPhoneVerified(false);
      setPhoneOTPSent(false);
      setPhoneOTP("");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "Phone number must be 10 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && isEmailVerified && isPhoneVerified) {
      setIsSubmitting(true);
      try {
        const axios = (await import("axios")).default;
        const response = await axios.post(
          API_ROUTES.AUTH.REGISTER,
          {
            name: formData.name,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            password: formData.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data && response.data.success) {
          setSuccess(true);
        } else {
          setErrors({ general: "Registration failed. Please try again." });
        }
      } catch (error: unknown) {
        setErrors({
          general:
            (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Network error. Please try again.",
        });
        console.error("Registration error:", error);
        setIsSubmitting(false);
      }
    }
  };

  // Email OTP
  const handleSendEmailOTP = () => {
    setVerifyingEmail(true);
    const otp = generateOTP();
    setSentEmailOTP(otp);
    setTimeout(() => {
      setEmailOTPSent(true);
      setVerifyingEmail(false);
      alert(`Simulated: OTP sent to email: ${otp}`); // Replace with real API
    }, 1000);
  };

  const handleVerifyEmailOTP = () => {
    setVerifyingEmail(true);
    setTimeout(() => {
      if (emailOTP === sentEmailOTP) {
        setIsEmailVerified(true);
        setEmailOTPSent(false);
      } else {
        setErrors((prev) => ({
          ...prev,
          email: "Invalid OTP for email",
        }));
      }
      setVerifyingEmail(false);
    }, 1000);
  };

  // Phone OTP
  const handleSendPhoneOTP = () => {
    setVerifyingPhone(true);
    const otp = generateOTP();
    setSentPhoneOTP(otp);
    setTimeout(() => {
      setPhoneOTPSent(true);
      setVerifyingPhone(false);
      alert(`Simulated: OTP sent to phone: ${otp}`); // Replace with real API
    }, 1000);
  };

  const handleVerifyPhoneOTP = () => {
    setVerifyingPhone(true);
    setTimeout(() => {
      if (phoneOTP === sentPhoneOTP) {
        setIsPhoneVerified(true);
        setPhoneOTPSent(false);
      } else {
        setErrors((prev) => ({
          ...prev,
          phoneNumber: "Invalid OTP for phone",
        }));
      }
      setVerifyingPhone(false);
    }, 1000);
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
                Join Perfect Meraki
              </motion.h1>
              <p className="text-gray-600">
                Create an account to unlock exclusive workshops & offers!
              </p>
            </div>

            {success ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center p-6 rounded-xl bg-green-50 border border-green-200"
              >
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-green-800 mb-2">
                  Welcome Aboard!
                </h3>
                <p className="text-green-600">
                  Your account has been created successfully.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 px-6 py-2 bg-green-600 text-white rounded-full font-medium"
                  onClick={() => {
                    // Use next/router to navigate to /signin
                    router.push("/signin");
                  }}
                >
                  Continue Exploring
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
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.name
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300 focus:ring-emerald-500"
                      } focus:outline-none focus:ring-2 transition`}
                      placeholder="Enter your name"
                    />
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-red-600"
                      >
                        {errors.name}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Email with OTP */}
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <div className="flex gap-2">
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
                        disabled={isEmailVerified}
                      />
                      {!isEmailVerified && !emailOTPSent && (
                        <button
                          type="button"
                          onClick={handleSendEmailOTP}
                          disabled={
                            verifyingEmail ||
                            !formData.email ||
                            !!errors.email ||
                            isEmailVerified
                          }
                          className="px-3 py-2 rounded-lg bg-emerald-500 text-white text-xs font-semibold disabled:bg-gray-300"
                        >
                          {verifyingEmail ? "Sending..." : "Send OTP"}
                        </button>
                      )}
                      {isEmailVerified && (
                        <span className="text-green-600 font-bold px-2 py-2">
                          ✔
                        </span>
                      )}
                    </div>
                    {emailOTPSent && !isEmailVerified && (
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          value={emailOTP}
                          onChange={(e) => setEmailOTP(e.target.value)}
                          maxLength={6}
                          className="w-32 px-3 py-2 rounded-lg border border-gray-300 focus:ring-emerald-500 focus:outline-none focus:ring-2 transition"
                          placeholder="Enter OTP"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyEmailOTP}
                          disabled={verifyingEmail || !emailOTP}
                          className="px-3 py-2 rounded-lg bg-emerald-500 text-white text-xs font-semibold disabled:bg-gray-300"
                        >
                          {verifyingEmail ? "Verifying..." : "Verify OTP"}
                        </button>
                        <button
                          type="button"
                          onClick={handleSendEmailOTP}
                          disabled={verifyingEmail}
                          className="px-3 py-2 rounded-lg bg-gray-200 text-xs font-semibold"
                        >
                          Resend
                        </button>
                      </div>
                    )}
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

                  {/* Phone with OTP */}
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.45 }}
                  >
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.phoneNumber
                            ? "border-red-300 focus:ring-red-500"
                            : "border-gray-300 focus:ring-emerald-500"
                        } focus:outline-none focus:ring-2 transition`}
                        placeholder="Enter 10 digit number"
                        disabled={isPhoneVerified}
                        maxLength={10}
                      />
                      {!isPhoneVerified && !phoneOTPSent && (
                        <button
                          type="button"
                          onClick={handleSendPhoneOTP}
                          disabled={
                            verifyingPhone ||
                            !formData.phoneNumber ||
                            !!errors.phoneNumber ||
                            isPhoneVerified
                          }
                          className="px-3 py-2 rounded-lg bg-emerald-500 text-white text-xs font-semibold disabled:bg-gray-300"
                        >
                          {verifyingPhone ? "Sending..." : "Send OTP"}
                        </button>
                      )}
                      {isPhoneVerified && (
                        <span className="text-green-600 font-bold px-2 py-2">
                          ✔
                        </span>
                      )}
                    </div>
                    {phoneOTPSent && !isPhoneVerified && (
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          value={phoneOTP}
                          onChange={(e) => setPhoneOTP(e.target.value)}
                          maxLength={6}
                          className="w-32 px-3 py-2 rounded-lg border border-gray-300 focus:ring-emerald-500 focus:outline-none focus:ring-2 transition"
                          placeholder="Enter OTP"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyPhoneOTP}
                          disabled={verifyingPhone || !phoneOTP}
                          className="px-3 py-2 rounded-lg bg-emerald-500 text-white text-xs font-semibold disabled:bg-gray-300"
                        >
                          {verifyingPhone ? "Verifying..." : "Verify OTP"}
                        </button>
                        <button
                          type="button"
                          onClick={handleSendPhoneOTP}
                          disabled={verifyingPhone}
                          className="px-3 py-2 rounded-lg bg-gray-200 text-xs font-semibold"
                        >
                          Resend
                        </button>
                      </div>
                    )}
                    {errors.phoneNumber && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-red-600"
                      >
                        {errors.phoneNumber}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
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

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={
                        isSubmitting || !isEmailVerified || !isPhoneVerified
                      }
                      className={`w-full py-3 px-4 rounded-xl font-bold text-white ${
                        isSubmitting || !isEmailVerified || !isPhoneVerified
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
                          Creating Account...
                        </span>
                      ) : (
                        "Sign Up Now"
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
              Already have an account?{" "}
              <a
                href="#"
                className="font-medium text-emerald-600 hover:text-emerald-500"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/signin");
                }}
              >
                Log in
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
