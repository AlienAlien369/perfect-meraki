import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  tone?: "green" | "espresso" | "sand";
}

const TONES: Record<string, string> = {
  green: "bg-green-light text-green-dark",
  espresso: "bg-espresso text-white",
  sand: "bg-sand-light text-espresso",
};

const Badge: React.FC<BadgeProps> = ({ children, tone = "sand" }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${TONES[tone]}`}>
    {children}
  </span>
);

export default Badge;
