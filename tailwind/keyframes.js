const keyframes = {
  "scale-out-in": {
    "0%": {
      transform: "scale(1)",
    },
    "50%": {
      transform: "scale(0.95)",
    },
    "100%": {
      transform: "scale(1)",
    },
  },
  "scale-out-in-strong": {
    "0%": {
      transform: "scale(1)",
    },
    "50%": {
      transform: "scale(0.85)",
    },
    "100%": {
      transform: "scale(1)",
    },
  },
  "scale-in": {
    "0%": {
      transform: "scale(0)",
    },
    "100%": {
      transform: "scale(100%)",
    },
  },
  "scale-out": {
    "0%": {
      transform: "scale(100%)",
    },
    "100%": {
      transform: "scale(0)",
    },
  },
  "move-24px": {
    "0%": {
      transform: "translate(0, 0)",
    },
    "100%": {
      transform: "translate(24px, 0)",
    },
  },
  rotate: {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },

  // shadcn
  "accordion-down": {
    from: { height: "0" },
    to: { height: "var(--radix-accordion-content-height)" },
  },
  "accordion-up": {
    from: { height: "var(--radix-accordion-content-height)" },
    to: { height: "0" },
  },
};

export default keyframes;
