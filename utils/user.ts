export const userHostUrl = (username?: string) => {
  if (!username || !process.env.NEXT_PUBLIC_URL) return ''
  const parseAppUrl = new URL(process.env.NEXT_PUBLIC_URL)
  return `${parseAppUrl.protocol}//${username}.${parseAppUrl.host}`
}
