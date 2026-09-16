import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import Link from "next/link";
import { API_ROUTES } from "@/api/APIRoutes";
import apiClient from "@/api/apiClient";
import { fadeInUp, fadeIn } from "@/lib/motion";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
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
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});
    try {
      await apiClient.post(API_ROUTES.AUTH.REGISTER, formData);
      setSuccess(true);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Something went wrong. Please try again.";
      setErrors({ general: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-light flex items-center justify-center px-4 py-16">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl border border-sand p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl text-espresso mb-2">
              Join Perfect Meraki
            </h1>
            <p className="text-espresso/60 text-sm">
              Create an account for exclusive workshops and offers
            </p>
          </div>

          {success ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-center p-6 rounded-xl bg-teal/10 border border-teal/30"
              role="status"
            >
              <h3 className="font-display text-xl text-espresso mb-1">
                Welcome aboard
              </h3>
              <p className="text-espresso/70 text-sm mb-4">
                Your account has been created. Sign in to continue.
              </p>
              <button
                onClick={() => router.push("/signin")}
                className="px-6 py-2 bg-espresso text-white rounded-full font-medium hover:bg-teal-dark transition-colors duration-base"
              >
                Go to sign in
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-espresso mb-1">
                    Full name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    aria-invalid={!!errors.name}
                    className={`w-full px-4 py-3 rounded-xl border bg-white text-espresso transition-colors duration-fast ${
                      errors.name ? "border-red-300 focus:border-red-400" : "border-sand focus:border-teal"
                    } focus:outline-none`}
                    placeholder="Enter your name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-espresso mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={!!errors.email}
                    className={`w-full px-4 py-3 rounded-xl border bg-white text-espresso transition-colors duration-fast ${
                      errors.email ? "border-red-300 focus:border-red-400" : "border-sand focus:border-teal"
                    } focus:outline-none`}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-espresso mb-1">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    autoComplete="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    maxLength={10}
                    aria-invalid={!!errors.phoneNumber}
                    className={`w-full px-4 py-3 rounded-xl border bg-white text-espresso transition-colors duration-fast ${
                      errors.phoneNumber ? "border-red-300 focus:border-red-400" : "border-sand focus:border-teal"
                    } focus:outline-none`}
                    placeholder="10 digit number"
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-espresso mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    aria-invalid={!!errors.password}
                    className={`w-full px-4 py-3 rounded-xl border bg-white text-espresso transition-colors duration-fast ${
                      errors.password ? "border-red-300 focus:border-red-400" : "border-sand focus:border-teal"
                    } focus:outline-none`}
                    placeholder="••••••••"
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>

                {errors.general && (
                  <p className="text-sm text-red-600 text-center" role="alert">
                    {errors.general}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-base ${
                    isSubmitting ? "bg-teal/60 cursor-not-allowed" : "bg-espresso hover:bg-teal-dark"
                  }`}
                >
                  {isSubmitting ? "Creating account..." : "Sign up"}
                </button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-espresso/70">
            Already have an account?{" "}
            <Link href="/signin" className="font-medium text-teal-dark hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
