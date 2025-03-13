/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core Colors
        primary: '#155DFC',       // Main brand color
        secondary: '#1E2939',    // Dark color for navbars
        accent: '#10B981',       // For success/positive actions
        danger: '#EF4444',       // For errors/destructive actions
        neutral: '#F8FAFC',      // Background color
      },
    },
  },
  plugins: [],
}