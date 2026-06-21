/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,vue}"],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '960px',
      },
    },
    extend: {
      colors: {
        cream: {
          50: '#FFFBF7',
          100: '#FFF8F0',
          200: '#FFE8D6',
          300: '#FFD4B3',
        },
        apricot: {
          400: '#FFA66D',
          500: '#FF8C42',
          600: '#F57C2E',
        },
        matcha: {
          400: '#BFD87A',
          500: '#A7C957',
          600: '#8FB344',
        },
        brown: {
          700: '#7A4E2E',
          800: '#6B4226',
          900: '#5A3620',
        },
      },
      fontFamily: {
        display: ['"ZCOOL KuaiLe"', '"Noto Sans SC"', 'sans-serif'],
        sans: ['"Noto Sans SC"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        'xl2': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -4px rgba(107, 66, 38, 0.15)',
        'card': '0 8px 30px -8px rgba(107, 66, 38, 0.2)',
        'btn': '0 4px 0 rgba(107, 66, 38, 0.2)',
        'btn-press': '0 2px 0 rgba(107, 66, 38, 0.2)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'steam': 'steam 2s ease-out infinite',
        'bounce-soft': 'bounceSoft 0.6s ease',
        'shake': 'shake 0.3s ease-in-out',
        'pop-in': 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'fade-slide': 'fadeSlide 0.4s ease',
        'breath-ring': 'breathRing 1.8s ease-in-out infinite',
        'unlock-glow': 'unlockGlow 1.5s ease-in-out infinite',
        'unlock-sparkle': 'unlockSparkle 1s ease-out forwards',
        'unlock-burst': 'unlockBurst 0.8s ease-out forwards',
        'unlock-reveal': 'unlockReveal 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'unlock-shine': 'unlockShine 2s ease-in-out infinite',
        'confetti-fall': 'confettiFall 2.5s ease-out forwards',
        'progress-glow': 'progressGlow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        steam: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0.6' },
          '100%': { transform: 'translateY(-40px) scale(1.5)', opacity: '0' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px) rotate(-2deg)' },
          '75%': { transform: 'translateX(4px) rotate(2deg)' },
        },
        popIn: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeSlide: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        breathRing: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '50%': { transform: 'scale(1.35)', opacity: '0' },
        },
        unlockGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 166, 109, 0.4), 0 0 40px rgba(255, 140, 66, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 166, 109, 0.7), 0 0 80px rgba(255, 140, 66, 0.4)' },
        },
        unlockSparkle: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '1' },
          '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: '1' },
          '100%': { transform: 'scale(0) rotate(360deg)', opacity: '0' },
        },
        unlockBurst: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '50%': { opacity: '0.8' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        unlockReveal: {
          '0%': { transform: 'scale(0.3) rotate(-10deg)', opacity: '0' },
          '60%': { transform: 'scale(1.1) rotate(3deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        unlockShine: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        confettiFall: {
          '0%': { transform: 'translateY(-20px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        progressGlow: {
          '0%, 100%': { boxShadow: '0 0 6px rgba(255, 140, 66, 0.5)' },
          '50%': { boxShadow: '0 0 16px rgba(255, 140, 66, 0.9)' },
        },
      },
    },
  },
  plugins: [],
};
