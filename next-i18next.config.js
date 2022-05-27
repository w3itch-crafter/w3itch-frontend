const path = require('path')

module.exports = {
  i18n: {
    defaultLocale: 'en-US',
    locales: ['en-US', 'zh-CN', 'ja-JP', 'ru-RU', 'kr-KR'],
    localePath: path.resolve('./public/locales'),
  },
}
