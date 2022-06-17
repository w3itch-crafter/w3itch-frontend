/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')
const { i18n } = require('./next-i18next.config')

const COEPHeaders = [
  {
    key: 'Cross-Origin-Embedder-Policy',
    value: 'require-corp',
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
]

const CacheControlNoStoreHeaders = [
  {
    key: 'Cache-Control',
    value: 'no-store',
  },
]

const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    domains: [
      'image.w3itch.io',
      's3.amazonaws.com',
      'storageapi.fleek.co',
      'img.itch.zone',
      'twitter.com',
      'ipfs.fleek.co',
      'i2.hdslb.com',
      'i.loli.net',
    ],
  },
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    maximumFileSizeToCacheInBytes: 10 * 1024 * 1024
  },
  async headers() {
    return [
      {
        source: '/iframe/minetest',
        headers: COEPHeaders,
      },
      {
        source: '/minetest/:path*',
        headers: [...COEPHeaders, ...CacheControlNoStoreHeaders],
      },
    ]
  },
  webpack(config, { isServer }) {
    Object.assign(config.experiments, { asyncWebAssembly: true })

    if (isServer) {
      config.output.webassemblyModuleFilename = '../static/wasm/[modulehash].wasm';
    }

    config.optimization.moduleIds = 'named';

    return config
  },
}

module.exports = withPWA(nextConfig)
