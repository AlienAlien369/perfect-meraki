import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "ext.same-assets.com",
      "images.unsplash.com",
      "example.com",
      "res.cloudinary.com",
      "images.remotePatterns"
    ],
  },
};

export default nextConfig;
