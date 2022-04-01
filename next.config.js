/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'storageapi.fleek.co',
      'img.itch.zone',
      'twitter.com',
      'ipfs.fleek.co',
      'i2.hdslb.com',
    ],
  },
}

module.exports = nextConfig
