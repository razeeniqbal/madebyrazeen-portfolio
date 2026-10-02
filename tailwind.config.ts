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
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
        // Display = Inter at heavy weight with tight tracking (brand sheet: Inter Bold).
        display: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
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
        'page': 'var(--page-max)',
        'prose': '40rem',
      },
    },
  },
  plugins: [],
};

export default config;
