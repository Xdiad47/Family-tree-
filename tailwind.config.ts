import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./viewmodels/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./constants/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        border: "var(--color-border)",
        primary: "var(--color-primary)",
        primaryHover: "var(--color-primary-hover)",
        text: "var(--color-text)",
        muted: "var(--color-text-muted)",
        success: "var(--color-success)",
        error: "var(--color-error)",
        warning: "var(--color-warning)"
      },
      fontFamily: {
        body: ["var(--font-body)", "sans-serif"],
        display: ["var(--font-display)", "serif"]
      },
      borderRadius: {
        card: "var(--radius-card)",
        node: "var(--radius-node)"
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0,0,0,0.08)",
        elevated: "0 8px 24px rgba(0,0,0,0.14)"
      },
      transitionTimingFunction: {
        snappy: "cubic-bezier(0.16,1,0.3,1)"
      }
    }
  },
  plugins: []
};

export default config;
