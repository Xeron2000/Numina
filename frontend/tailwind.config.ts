import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a73e8',
          light: '#4285f4',
          dark: '#1557b7',
        },
        secondary: {
          DEFAULT: '#34a853',
          light: '#4caf50',
          dark: '#2e7d32',
        },
        background: {
          DEFAULT: '#ffffff',
          dark: '#202124',
        },
        text: {
          DEFAULT: '#202124',
          dark: '#e8eaed',
        },
        surface: {
          DEFAULT: '#ffffff',
          dark: '#292a2d',
        },
        error: '#d93025',
        warning: '#f9ab00',
        success: '#34a853',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          primary: '#1a73e8',
          secondary: '#34a853',
          accent: '#fbbc04',
          neutral: '#5f6368',
          'base-100': '#ffffff',
          info: '#1a73e8',
          success: '#34a853',
          warning: '#f9ab00',
          error: '#d93025',
        },
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
          primary: '#8ab4f8',
          secondary: '#81c995',
          accent: '#fbbc04',
          neutral: '#9aa0a6',
          'base-100': '#202124',
          info: '#8ab4f8',
          success: '#81c995',
          warning: '#f9ab00',
          error: '#f28b82',
        },
      },
    ],
  },
};

export default config;
