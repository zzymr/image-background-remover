const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  outputFileTracingRoot: path.resolve(__dirname),
}

module.exports = nextConfig

if (process.env.NODE_ENV === 'development') {
  const { setupDevPlatform } = require('@cloudflare/next-on-pages/next-dev')

  setupDevPlatform().catch((error) => {
    console.error('Failed to set up Cloudflare dev platform:', error)
  })
}
