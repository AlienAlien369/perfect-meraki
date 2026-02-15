"use client";
import { useRouter } from "next/router";
import React from "react";

interface RoundedCTAButtonProps {
  href: string;
  children: string;
}

export const RoundedCTAButton: React.FC<RoundedCTAButtonProps> = ({
  href,
  children,
}) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        "inline-block rounded-full bg-[#5db8a8] px-6 py-2 text-white font-semibold shadow-md border border-[#5db8a8]  hover:shadow-lg hover:bg-white hover:text-[#5db8a8] transition-all duration-300 hover:scale-105 active:scale-95"
      }
    >
      {children}
    </button>
  );
};
