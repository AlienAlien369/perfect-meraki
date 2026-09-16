import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppDispatch } from "@/store/hooks";
import { signIn } from "@/store/slices/authSlice";
import { setUser } from "@/store/slices/userSlice";
import { useRouter } from "next/router";
import Link from "next/link";
import { API_ROUTES } from "@/api/APIRoutes";
import apiClient from "@/api/apiClient";
import { fadeInUp, fadeIn } from "@/lib/motion";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
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
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});
    setSuccess(false);

    try {
      const res = await apiClient.post(API_ROUTES.AUTH.LOGIN, formData);
      const data = res.data;

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
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Something went wrong. Please try again.";
      setErrors({ general: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sessionNotice = router.query.sessionExpired
    ? "Your session expired. Please sign in again."
    : router.query.unauthorized
    ? "You don't have access to that page. Please sign in with an admin account."
    : router.query.redirect === "admin"
    ? "Please sign in to access the admin dashboard."
    : null;

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
              Welcome back
            </h1>
            <p className="text-espresso/60 text-sm">
              Sign in to your Perfect Meraki account
            </p>
          </div>

          {sessionNotice && !success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm text-center"
              role="status"
            >
              {sessionNotice}
            </motion.div>
          )}

          {success ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-center p-6 rounded-xl bg-teal/10 border border-teal/30"
              role="status"
            >
              <h3 className="font-display text-xl text-espresso mb-1">
                You&apos;re signed in
              </h3>
              <p className="text-espresso/70 text-sm">
                Taking you back to the storefront...
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-espresso mb-1"
                  >
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
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={`w-full px-4 py-3 rounded-xl border bg-white text-espresso transition-colors duration-fast ${
                      errors.email
                        ? "border-red-300 focus:border-red-400"
                        : "border-sand focus:border-teal"
                    } focus:outline-none`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-sm text-red-600">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-espresso mb-1"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    className={`w-full px-4 py-3 rounded-xl border bg-white text-espresso transition-colors duration-fast ${
                      errors.password
                        ? "border-red-300 focus:border-red-400"
                        : "border-sand focus:border-teal"
                    } focus:outline-none`}
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p id="password-error" className="mt-1 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
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
                    isSubmitting
                      ? "bg-teal/60 cursor-not-allowed"
                      : "bg-espresso hover:bg-teal-dark"
                  }`}
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-espresso/70">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-teal-dark hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;
