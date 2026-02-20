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
        surface: '#0A0A0B',
        border: '#1A1A1C',
        secondary: '#88888E',
        luminous: '#10B981',
        luminousAlt: '#818CF8',
        whatsapp: '#25D366',
        rabbitmq: '#FF6600',
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
