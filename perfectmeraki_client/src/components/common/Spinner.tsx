import React from "react";

interface SpinnerProps {
  size?: number;
  className?: string;
  label?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 32, className = "", label }) => (
  <div className={`flex flex-col items-center justify-center gap-3 ${className}`} role="status">
    <div
      className="rounded-full border-sand border-t-green animate-spin"
      style={{ width: size, height: size, borderWidth: Math.max(2, size / 12) }}
    />
    {label && <p className="text-sm text-espresso/60">{label}</p>}
    <span className="sr-only">Loading</span>
  </div>
);

export default Spinner;
