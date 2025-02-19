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
                treeRed: '#7C0902',
                treeBlue: '#007FFF',
                treeGreen: '#004225',
                treePink: '#FF0090',
                treeViolet: '#9400D3',
                treeOrange: '#FF4F00',
                treeGray: '#8C92AC',
            },
            fontFamily: {
                inter: ['Inter', 'serif'],
                playfair: ['Playfair Display', 'serif'],
            },
        },
    },
    plugins: [],
} satisfies Config
