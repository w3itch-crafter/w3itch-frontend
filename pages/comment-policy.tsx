import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const RenderMarkdown = dynamic(
  () => import('components/RenderMarkdown/index'),
  { ssr: false }
)

const MD_EN = `
# Privacy Policy

## What information do we collect?

    Basic account information: If you register on this server, you may be asked to enter a username, an e-mail address and a password. You may also enter additional profile information such as a display name and biography, and upload a profile picture and header image. The username, display name, biography, profile picture and header image are always listed publicly. Do not share any dangerous information over w3itch.
    IPs and other metadata: When you log in, we record the IP address you log in from, as well as the name of your browser application. All the logged in sessions are available for your review and revocation in the settings. The latest IP address used is stored for up to 12 months. We also may retain server logs which include the IP address of every request to our server.

## What do we use your information for?

Any of the information we collect from you may be used in the following ways:

    To provide the core functionality of w3itch. You can only interact with other people's content and post your own content when you are logged in. For example, you may follow other people to view their combined posts in your own personalized home timeline.
    To aid moderation of the community, for example comparing your IP address with other known ones to determine ban evasion or other violations.
    The email address you provide may be used to send you information, notifications about other people interacting with your content or sending you messages, and to respond to inquiries, and/or other requests or questions.

## How do we protect your information?

We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information. Among other things, your browser session, as well as the traffic between your applications and the API, are secured with SSL, and your password is hashed using a strong one-way algorithm. You may enable two-factor authentication to further secure access to your account.
What is our data retention policy?

We will make a good faith effort to:

    Retain server logs containing the IP address of all requests to this server, in so far as such logs are kept, no more than 90 days.
    Retain the IP addresses associated with registered users no more than 12 months.

## Do we use cookies?

Yes. Cookies are small files that a site or its service provider transfers to your computer's hard drive through your Web browser (if you allow). These cookies enable the site to recognize your browser and, if you have a registered account, associate it with your registered account.

We use cookies to understand and save your preferences for future visits.
Do we disclose any information to outside parties?

We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include trusted third parties who assist us in operating our site, conducting our business, or servicing you, so long as those parties agree to keep this information confidential. We may also release your information when we believe release is appropriate to comply with the law, enforce our site policies, or protect ours or others rights, property, or safety.

Your public content may be downloaded by other servers in the network.

## Site usage by children

If this server is in the EU or the EEA: Our site, products and services are all directed to people who are at least 16 years old. If you are under the age of 16, per the requirements of the GDPR (General Data Protection Regulation) do not use this site.

If this server is in the USA: Our site, products and services are all directed to people who are at least 13 years old. If you are under the age of 13, per the requirements of COPPA (Children's Online Privacy Protection Act) do not use this site.

Law requirements can be different if this server is in another jurisdiction.

## Changes to our Privacy Policy

If we decide to change our privacy policy, we will post those changes on this page.

This document is CC-BY-SA. It was last updated Nov 16, 2021.

Originally adapted from the [Discourse privacy policy](https://github.com/discourse/discourse).
w3itch
`

// @TODO theme
const CommentPolicy: NextPage = () => (
  <>
    <Head>
      <title>Privacy Policy - w3itch.io</title>
    </Head>
    <div style={{ maxWidth: 840, margin: '0 auto', padding: '40px 20px' }}>
      <RenderMarkdown md={MD_EN} />
    </div>
  </>
)

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

export default CommentPolicy
