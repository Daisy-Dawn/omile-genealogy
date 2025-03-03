import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    images: {
        domains: ['res.cloudinary.com'], // Add Cloudinary domain here
    },
    eslint: {
        // Allow builds even if ESLint has errors
        ignoreDuringBuilds: true,
    },
    typescript: {
        // Allow production builds to complete even if TypeScript has errors
        ignoreBuildErrors: true,
    },
}

export default nextConfig
