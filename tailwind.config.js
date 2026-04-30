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
          950: '#ffffff',
          900: '#fafafa',
          800: '#f4f4f5',
          700: '#e4e4e7',
          500: '#71717a',
          300: '#52525b',
          100: '#18181b',
        },
        accent: {
          DEFAULT: '#db2777',
          violet: '#7c3aed',
        },
      },
    },
  },
  plugins: [],
}
