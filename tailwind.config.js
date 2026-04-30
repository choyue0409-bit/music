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
        serif: [
          '"Noto Serif SC"',
          'Fraunces',
          'Lora',
          '"Source Han Serif SC"',
          'Georgia',
          'serif',
        ],
        display: [
          'Fraunces',
          '"Noto Serif SC"',
          'Georgia',
          'serif',
        ],
      },
      colors: {
        ink: {
          950: '#f7f3ea',
          900: '#f1ebde',
          800: '#e8e1d0',
          700: '#c9bfa6',
          500: '#8a7f6a',
          300: '#5a5141',
          100: '#2a2419',
        },
        accent: {
          DEFAULT: '#b53430',
          violet: '#3b5b8a',
        },
        paper: {
          line: '#d8cfb8',
          tape: '#e8d4a3',
        },
      },
      boxShadow: {
        polaroid: '0 1px 2px rgba(42,36,25,0.08), 0 8px 24px rgba(42,36,25,0.06)',
        stamp: '0 2px 0 rgba(181,52,48,0.15)',
      },
    },
  },
  plugins: [],
}
