import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        flashFade: {
          "0%": { transform: "translateX(calc(100% + 1rem))" },
          "20%": { transform: "translateX(0)"},
          "80%": { transform: "translateX(0)"},
          "100%": { transform: "translateX(calc(100% + 1rem))" },
        },
      },
      animation: {
        flash: "flashFade 6.0s forwards",
      },
    },
  },
  plugins: [],
}
export default config
