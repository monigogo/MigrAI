import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      colors: {
        primary: {
          DEFAULT: 'hsl(200, 98%, 39%)',    // #0077B6
          light:   'hsl(193, 100%, 43%)',   // #00B4D8
          dark:    'hsl(219, 75%, 27%)',    // #023E8A
          50:      'hsl(200, 60%, 97%)',
          100:     'hsl(200, 55%, 93%)',
          200:     'hsl(200, 50%, 85%)',
        },
        accent: {
          DEFAULT: 'hsl(27, 100%, 49%)',    // #F77F00
          light:   'hsl(43, 97%, 65%)',     // #FCBF49
        },
        success: {
          DEFAULT: 'hsl(152, 55%, 40%)',    // #2D9D78
          light:   'hsl(152, 40%, 92%)',
        },
        background: 'hsl(209, 40%, 96%)',
        card:       'hsl(210, 40%, 98%)',
        border:     'hsl(212, 26%, 83%)',
        muted: {
          DEFAULT:     'hsl(215, 20%, 65%)',
          foreground:  'hsl(215, 20%, 55%)',
        },
      },
      borderRadius: {
        'xl':  '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft':  '0 2px 12px rgba(13,27,42,0.06)',
        'card':  '0 4px 20px rgba(13,27,42,0.08)',
        'blue':  '0 4px 16px rgba(0,119,182,0.25)',
        'blue-lg': '0 8px 32px rgba(0,119,182,0.30)',
      },
      animation: {
        'fade-in':  'fadeIn 0.3s ease forwards',
        'slide-up': 'slideUp 0.35s ease forwards',
        'bounce-dot': 'bounceDot 1.2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        bounceDot: {
          '0%, 60%, 100%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-6px)' },
        },
      },
      maxWidth: {
        'app': '480px',
      },
    },
  },
  plugins: [],
}

export default config