// Shared motion language - mirrors the CSS tokens in styles/globals.css
// (--ease-brand, --duration-*). Use these instead of picking new
// durations/easings per component so motion feels like one system.
export const easeBrand = [0.22, 1, 0.36, 1] as const;

export const duration = {
  fast: 0.15,
  base: 0.25,
  slow: 0.45,
} as const;

export const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: easeBrand },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.base, ease: easeBrand } },
};

export const staggerContainer = (staggerChildren = 0.08) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren, delayChildren: 0.1 },
  },
});
