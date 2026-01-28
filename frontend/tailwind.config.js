/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Sky Blue Theme
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',  // Main sky blue
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        // Accent Colors
        accent: {
          blue: '#06b6d4',    // Cyan
          purple: '#8b5cf6',  // Purple accent
          green: '#10b981',   // Success
          orange: '#f59e0b',  // Warning
          red: '#ef4444',     // Error
        },
      },
      boxShadow: {
        'sky': '0 4px 14px 0 rgba(14, 165, 233, 0.15)',
        'sky-lg': '0 10px 40px 0 rgba(14, 165, 233, 0.20)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  safelist: [
    {
      pattern: /^(bg|text|border|ring)-(primary|accent)-(50|100|200|300|400|500|600|700|800|900|950)$/,
    },
  ],
  plugins: [],
}