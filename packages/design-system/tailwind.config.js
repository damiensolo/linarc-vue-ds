/** @type {import('tailwindcss').Config} */
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load Figma tokens
let figmaTokens = { colors: {}, borderRadius: {}, boxShadow: {} }
try {
  const tokensPath = resolve(__dirname, './src/tokens/tailwind-extension.json')
  figmaTokens = JSON.parse(readFileSync(tokensPath, 'utf-8'))
} catch (error) {
  console.warn('⚠️  Could not load Figma tokens, using defaults')
}

export default {
  darkMode: ['class'],
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Figma tokens (auto-synced)
        ...(figmaTokens.colors || {}),
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        // Figma tokens (auto-synced)
        ...(figmaTokens.borderRadius || {}),
      },
      boxShadow: {
        // Figma tokens (auto-synced)
        ...(figmaTokens.boxShadow || {}),
      },
    },
  },
  plugins: [],
}
