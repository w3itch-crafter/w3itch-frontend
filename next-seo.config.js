export const seoKeywords =
  'w3itch, w3itch.io, itch, games, free, creator, freedom open marketplace, gitcoin'

export default {
  title: 'w3itch',
  description:
    'W3itch.io is a free as freedom open marketplace for independent game creators inspired by itch and gitcoin',
  additionalMetaTags: [
    {
      property: 'keywords',
      content: seoKeywords,
    },
  ],
  openGraph: {
    type: 'website',
    images: [
      {
        url: 'https//pbs.twimg.com/profile_images/1516581741024395266/IGoRGZM7_400x400.jpg',
        alt: 'w3itch.io',
      },
    ],
  },
  twitter: {
    handle: '@w3itchio',
    site: '@w3itchio',
    cardType: 'summary_large_image',
  },
}
