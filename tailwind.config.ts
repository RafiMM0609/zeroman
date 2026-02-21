import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        surface: "#0A0A0B",
        border: "#1A1A1C",
        secondary: "#88888E",
        luminous: "#10B981",
        luminousAlt: "#818CF8",
        whatsapp: "#25D366",
        rabbitmq: "#FF6600",
        orange: {
          500: "#f97316",
        },
        emerald: {
          400: "#34d399",
          500: "#10b981",
          900: "#064e3b",
        },
        blue: {
          400: "#60a5fa",
          500: "#3b82f6",
        },
        purple: {
          400: "#a78bfa",
          500: "#8b5cf6",
        },
        amber: {
          500: "#f59e0b",
        },
        zinc: {
          100: "#f4f4f5",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
          600: "#52525b",
          700: "#3f3f46",
          800: "#27272a",
          900: "#18181b",
          950: "#09090b",
        },
      },
      animation: {
        'slide': 'slide 8s infinite cubic-bezier(0.65, 0, 0.35, 1)',
        'flow-line': 'flowLine 1s linear infinite',
      },
      keyframes: {
        slide: {
          '0%': { transform: 'translateY(0)' },
          '25%': { transform: 'translateY(-1.2em)' },
          '50%': { transform: 'translateY(-2.4em)' },
          '75%': { transform: 'translateY(-3.6em)' },
          '100%': { transform: 'translateY(0)' },
        },
        flowLine: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '20px 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
