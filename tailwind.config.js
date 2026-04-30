/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"PingFang SC"',
          '"Microsoft YaHei"',
          'system-ui',
          'sans-serif',
        ],
      },
      colors: {
        ink: {
          950: '#0a0a0a',
          900: '#111113',
          800: '#1a1a1d',
          700: '#26262b',
          500: '#6b6b73',
          300: '#b8b8c0',
          100: '#f5f5f7',
        },
        accent: {
          DEFAULT: '#f472b6',
          violet: '#8b5cf6',
        },
      },
    },
  },
  plugins: [],
}
