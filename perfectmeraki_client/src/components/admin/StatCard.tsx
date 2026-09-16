import React from "react";
import { IconType } from "react-icons";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: IconType;
  accent?: "green" | "espresso" | "sand";
}

const ACCENTS: Record<string, string> = {
  green: "bg-green-light text-green-dark",
  espresso: "bg-espresso/10 text-espresso",
  sand: "bg-sand-light text-espresso",
};

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, accent = "green" }) => (
  <div className="bg-white rounded-2xl border border-sand p-5 flex items-center gap-4 shadow-sm">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${ACCENTS[accent]}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="min-w-0">
      <p className="text-espresso/50 text-xs font-medium uppercase tracking-wide truncate">{label}</p>
      <p className="font-display text-2xl text-espresso">{value}</p>
    </div>
  </div>
);

export default StatCard;
