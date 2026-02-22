/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['Fira Code', 'Monaco', 'Cascadia Code', 'Ubuntu Mono', 'monospace']
      },
      colors: {
        terminal: {
          bg: '#0d1117',
          text: '#f0f6fc',
          prompt: '#7c3aed',
          success: '#238636',
          error: '#da3633',
          warning: '#d29922'
        }
      }
    },
  },
  plugins: [],
}