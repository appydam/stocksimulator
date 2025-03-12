
import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(142 72% 29%)",
          50: "hsl(138 76% 97%)",
          100: "hsl(141 84% 93%)",
          200: "hsl(141 79% 85%)",
          300: "hsl(142 77% 73%)",
          400: "hsl(142 69% 58%)",
          500: "hsl(142 71% 45%)",
          600: "hsl(142 72% 29%)",
          700: "hsl(142 75% 20%)",
          800: "hsl(143 75% 14%)",
          900: "hsl(144 78% 10%)",
        },
        green: {
          DEFAULT: "hsl(142 72% 29%)",
          50: "hsl(138 76% 97%)",
          100: "hsl(141 84% 93%)",
          200: "hsl(141 79% 85%)",
          300: "hsl(142 77% 73%)",
          400: "hsl(142 69% 58%)",
          500: "hsl(142 71% 45%)",
          600: "hsl(142 72% 29%)",
          700: "hsl(142 75% 20%)",
          800: "hsl(143 75% 14%)",
          900: "hsl(144 78% 10%)",
        },
        error: {
          DEFAULT: "hsl(0 72% 44%)",
          50: "hsl(6 100% 98%)",
          100: "hsl(6 100% 95%)",
          200: "hsl(6 100% 89%)",
          300: "hsl(6 94% 80%)",
          400: "hsl(4 91% 64%)",
          500: "hsl(1 90% 56%)",
          600: "hsl(0 72% 44%)",
          700: "hsl(0 73% 39%)",
          800: "hsl(0 70% 31%)",
          900: "hsl(0 65% 24%)",
        },
        red: {
          DEFAULT: "hsl(0 72% 44%)",
          50: "hsl(6 100% 98%)",
          100: "hsl(6 100% 95%)",
          200: "hsl(6 100% 89%)",
          300: "hsl(6 94% 80%)",
          400: "hsl(4 91% 64%)",
          500: "hsl(1 90% 56%)",
          600: "hsl(0 72% 44%)",
          700: "hsl(0 73% 39%)",
          800: "hsl(0 70% 31%)",
          900: "hsl(0 65% 24%)",
        },
        warning: {
          DEFAULT: "hsl(43 96% 40%)",
          50: "hsl(50 100% 96%)",
          100: "hsl(49 98% 89%)",
          200: "hsl(47 97% 77%)",
          300: "hsl(45 96% 63%)",
          400: "hsl(44 96% 55%)",
          500: "hsl(43 96% 50%)",
          600: "hsl(43 96% 40%)",
          700: "hsl(38 95% 32%)",
          800: "hsl(37 96% 24%)",
          900: "hsl(35 92% 20%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-opacity": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-opacity": "pulse-opacity 2s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
