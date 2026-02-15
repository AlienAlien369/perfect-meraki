"use client";
import { useRouter } from "next/router";
import React from "react";

interface OutlineCTAButtonProps {
  href: string;
  children: string;
}

export const OutlineCTAButton: React.FC<OutlineCTAButtonProps> = ({
  href,
  children,
}) => {
  const router = useRouter();

  function clsx(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(" ");
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={clsx(
        "inline-block rounded-full border border-[#5db8a8] px-6 py-2 font-semibold text-[#5db8a8] transition-all duration-300 hover:bg-[#5db8a8] hover:shadow-md hover:scale-105 active:scale-95 hover:text-white hover:bg-[#5db8a8]"
      )}
    >
      {children}
    </button>
  );
};
