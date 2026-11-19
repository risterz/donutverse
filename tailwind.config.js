/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFDF9',
          100: '#FFF8F1',
          200: '#F8ECDF',
          300: '#EED9C4',
        },
        blush: {
          50: '#FFF2F6',
          100: '#FCE4EC',
          200: '#F7C9D8',
          300: '#EEA3BC',
        },
        strawberry: {
          500: '#E23B5B',
          600: '#D92B4B',
          700: '#B91E3B',
          800: '#93162D',
        },
        cocoa: {
          500: '#8A5F52',
          600: '#6D463B',
          700: '#533228',
          800: '#3B2019',
          900: '#2A1510',
          950: '#1C0D0A',
        },
        caramel: {
          400: '#E3A45B',
          500: '#D18634',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.75rem',
      },
      boxShadow: {
        editorial: '0 24px 60px -24px rgba(42, 21, 16, 0.16)',
        card: '0 14px 36px -18px rgba(42, 21, 16, 0.12)',
        elevated: '0 32px 72px -24px rgba(42, 21, 16, 0.24)',
      },
    },
  },
  plugins: [],
};
