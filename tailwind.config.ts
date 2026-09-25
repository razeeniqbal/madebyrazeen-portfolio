import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ---- V2 brand (PRD §7). Fixed values: ----
        carbon: 'rgb(var(--carbon) / <alpha-value>)',
        warm: 'rgb(var(--warm) / <alpha-value>)',
        grey: 'rgb(var(--grey) / <alpha-value>)',
        lime: 'rgb(var(--lime) / <alpha-value>)',
        // ---- V2 semantic, follow the nearest [data-surface]: ----
        surface: 'rgb(var(--bg) / <alpha-value>)',
        raised: 'rgb(var(--bg-raised) / <alpha-value>)',
        ink: 'rgb(var(--fg) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        signal: 'rgb(var(--signal-text) / <alpha-value>)',
        line: 'rgb(var(--line))',

        // ---- V1 (archived) ----
        // Neutral grayscale palette (Modern theme)
        primary: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#121212',
        },
        // Modern accent colors
        accent: {
          orange: '#f97316',
          blue: '#3b82f6',
          purple: '#a855f7',
          green: '#4ade80',
          teal: '#14b8a6',
        },
        // Retro color palette (Unified for legacy pages)
        'burnt-orange': '#d97706',
        'mustard-yellow': '#fbbf24',
        'retro-teal': '#14b8a6',
        'olive-green': '#84cc16',
        'dark-brown': '#78350f',
        'warm-beige': '#fef3c7',
        'cream': '#fefce8',
        'retro-brown': '#92400e',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
        // Display = Inter at heavy weight with tight tracking (brand sheet: Inter Bold).
        display: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        handwriting: ['var(--font-allura)', 'cursive'],
      },
      fontSize: {
        // Fluid display scale. [size, { lineHeight, letterSpacing, fontWeight }]
        'display-xl': ['clamp(3rem, 7.2vw, 8.5rem)', { lineHeight: '0.9', letterSpacing: '-0.045em', fontWeight: '800' }],
        'display-lg': ['clamp(2.5rem, 6vw, 5.75rem)', { lineHeight: '0.92', letterSpacing: '-0.04em', fontWeight: '800' }],
        'display-md': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '0.98', letterSpacing: '-0.035em', fontWeight: '700' }],
        'display-sm': ['clamp(1.5rem, 2.5vw, 2rem)', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '700' }],
        lead: ['clamp(1.125rem, 1.6vw, 1.375rem)', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
      },
      spacing: {
        // Vertical rhythm between sections.
        section: 'clamp(5rem, 12vw, 10rem)',
        gutter: 'var(--gutter)',
      },
      maxWidth: {
        'container': '1280px',
        'content': '854px',
        'page': 'var(--page-max)',
        'prose': '40rem',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'shine': 'shine 5s linear infinite',
        'gradient': 'gradient 8s linear infinite',
        'glitch': 'glitch 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shine: {
          '0%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '-100% 50%' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        glitch: {
          '0%': { clipPath: 'inset(40% 0 61% 0)' },
          '20%': { clipPath: 'inset(92% 0 1% 0)' },
          '40%': { clipPath: 'inset(43% 0 1% 0)' },
          '60%': { clipPath: 'inset(25% 0 58% 0)' },
          '80%': { clipPath: 'inset(54% 0 7% 0)' },
          '100%': { clipPath: 'inset(58% 0 43% 0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
