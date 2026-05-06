/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sidebar: '#1A1A18',
        'sidebar-hover': '#2A2A26',
        'sidebar-active': '#2D2D28',
        accent: '#C8A96E',
        'accent-dark': '#B8966A',
        cream: '#F5F4EF',
        'cream-dark': '#EDEAE0',
        surface: '#FFFFFF',
        border: '#E8E5DC',
        'text-primary': '#1C1C1A',
        'text-muted': '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
