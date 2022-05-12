/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')
const { i18n } = require('./next-i18next.config')

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
  }
}

module.exports = withPWA(nextConfig)
