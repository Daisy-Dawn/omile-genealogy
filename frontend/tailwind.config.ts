import type { Config } from 'tailwindcss'

export default {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                appBrown: '#8D6A4A',
                appRed: '#D1495B',
                appYellow: '#F4D35E',
                appBrown2: '#83410F',
            },
            fontFamily: {
                inter: ['Inter', 'serif'],
                playfair: ['Playfair Display', 'serif'],
            },
        },
    },
    plugins: [],
} satisfies Config
