import { useRouter } from "next/router";
import React from "react";

interface AnimatedRevealButtonProps {
  href: string;
  children: string;
  className?: string;
  hoverFont?: string; // custom font class if needed
}

export const AnimatedRevealButton: React.FC<AnimatedRevealButtonProps> = ({
  href,
  children,
  // className = "",
  // hoverFont = "font-[cursive]",
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
        "group relative inline-block overflow-hidden rounded-full border border-[#2d2926] bg-gradient-to-br from-[#a5f3eb] to-[#63ccbb] px-6 py-2 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#2d2926] focus:ring-offset-2"
      }
    >
      {/* Default font */}
      <span className="block transition-all duration-300 group-hover:-translate-y-full group-hover:opacity-0">
        <span className="text-base font-semibold text-[#2d2926] font-sans">
          {children}
        </span>
      </span>

      {/* Hover font (customizable) */}
      <span className="absolute top-full pt-2 block transition-all duration-300 group-hover:top-0 group-hover:opacity-100 opacity-0">
        <span className={"text-base font-semibold text-[#2d2926]"}>
          {children}
        </span>
      </span>

      {/* Shimmer overlay */}
      <span
        className="pointer-events-none absolute left-[-100%] top-0 h-full w-full bg-white/20 opacity-0 transition-all duration-500 group-hover:left-full group-hover:opacity-100"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 50%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 50%, transparent 100%)",
        }}
      />
    </button>
  );
};
