/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_URL || 'https://w3itch.io',
  generateRobotsTxt: true,
  exclude: ['/server-sitemap.xml', '/admin', '/zh-CN/admin'],
  robotsTxtOptions: {
    additionalSitemaps: [
      `${
        process.env.NEXT_PUBLIC_URL || 'https://w3itch.io'
      }/server-sitemap.xml`,
    ],
  },
}
