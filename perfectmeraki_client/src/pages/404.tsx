import React from "react";
import Link from "next/link";

const Custom404: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-sand-light text-center px-4">
    <p className="font-display text-7xl md:text-8xl text-green mb-2">404</p>
    <h1 className="font-display text-2xl md:text-3xl text-espresso mb-2">
      Page not found
    </h1>
    <p className="text-espresso/60 mb-8 max-w-sm">
      The page you&apos;re looking for doesn&apos;t exist or may have moved.
    </p>
    <Link
      href="/"
      className="px-6 py-3 rounded-full bg-green text-white font-semibold hover:bg-green-dark transition-colors duration-base"
    >
      Go back home
    </Link>
  </div>
);

export default Custom404;
