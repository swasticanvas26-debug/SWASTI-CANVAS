import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: '#2A7D6F',
          light: '#4AADA0',
          pale: '#E8F5F3',
          dark: '#1F5F55',
        },
        peach: {
          DEFAULT: '#F4A47A',
          pale: '#FEF3EC',
        },
        mustard: {
          DEFAULT: '#E8843A',
          dark: '#d4722d',
        },
        blue: {
          accent: '#4A90B8',
        },
        canvas: {
          bg: '#FAFAF8',
          card: '#FFFFFF',
          border: '#E5E7EB',
          muted: '#6B7280',
          dark: '#1A1A1A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.06)',
        'card-hover': '0 12px 40px rgba(42,125,111,0.15)',
        teal: '0 4px 14px rgba(42,125,111,0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.35s ease forwards',
        'pulse-ring': 'pulseRing 1.5s ease infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(42,125,111,0.4)' },
          '70%': { transform: 'scale(1)', boxShadow: '0 0 0 10px rgba(42,125,111,0)' },
          '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(42,125,111,0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
