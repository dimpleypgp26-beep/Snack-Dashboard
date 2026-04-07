import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#FAF7F2',
        'bg-alt': '#F8F5F0',
        primary: '#E8D8C3',
        secondary: '#A8C3A0',
        accent: '#F4B8A8',
        brand: '#3A2F2F',
      },
    },
  },
  plugins: [],
};

export default config;
