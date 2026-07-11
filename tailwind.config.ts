import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0C1116',
          soft: '#56606E',
        },
        paper: {
          DEFAULT: '#FFFFFF',
          dim: '#F2F6FB',
        },
        green: {
          DEFAULT: '#00b369',
          deep: '#009a5a',
        },
        // `amber` token repurposed as the brand blue so existing utilities recolour.
        amber: {
          DEFAULT: '#4a90e2',
          soft: '#E7F1FC',
        },
        blue: {
          DEFAULT: '#4a90e2',
          ink: '#1f5fa8',
        },
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'Fraunces', 'serif'],
        body: ['var(--font-public-sans)', 'Public Sans', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        book: '0 30px 60px -20px rgba(19,32,25,0.4)',
        card: '0 20px 40px -24px rgba(19,32,25,0.35)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
        marquee: 'marquee 40s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
