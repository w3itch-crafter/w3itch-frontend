/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'storageapi.fleek.co',
      'img.itch.zone',
      'twitter.com',
      'ipfs.fleek.co',
      'i2.hdslb.com',
      'i.loli.net',
    ],
  },
  pwa: {
    dest: 'public'
  }
}

module.exports = withPWA(nextConfig)
