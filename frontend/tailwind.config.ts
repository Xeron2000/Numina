// tailwind.config.ts
import type { Config } from 'tailwindcss'
import daisyui from 'daisyui'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      boxShadow: {
        'google': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      }
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#1a73e8",
          "secondary": "#fbbc04",
          "accent": "#34a853",
          "neutral": "#f8f9fa",
          "base-100": "#ffffff",
          "info": "#1a73e8",
          "success": "#34a853",
          "warning": "#fbbc04",
          "error": "#ea4335",
          "--rounded-box": "8px",
          "--rounded-btn": "24px"
        },
        dark: {
          "primary": "#8ab4f8",
          "secondary": "#fbbc04",
          "accent": "#34a853",
          "neutral": "#202124",
          "base-100": "#303134",
          "info": "#8ab4f8",
          "success": "#34a853",
          "warning": "#fbbc04",
          "error": "#ea4335",
          "--rounded-box": "8px",
          "--rounded-btn": "24px"
        }
      }
    ] as any[], // 类型断言解决ts类型问题
    darkTheme: "dark", // 明确指定暗黑主题名称
    base: true,
    styled: true,
    utils: true,
  },
}

export default config