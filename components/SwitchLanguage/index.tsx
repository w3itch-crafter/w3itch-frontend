import { Language } from '@mui/icons-material'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import React, { useMemo, useState } from 'react'
import { setCookie } from 'utils'

const COOKIE_NEXT_LOCALE = 'NEXT_LOCALE'
const COOKIE_NEXT_LOCALE_EXPIRES = 365

const SwitchLanguage = () => {
  const router = useRouter()
  const { locales, pathname, query, asPath } = router
  const { t } = useTranslation()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const LanguageLocales = useMemo(() => {
    const list = [
      {
        key: 'zh-CN',
        value: 'Chinese (Simplified)',
      },
      {
        key: 'en-US',
        value: 'English',
      },
      {
        key: 'ja-JP',
        value: 'Japanese',
      },
      {
        key: 'ru-RU',
        value: 'Russian',
      },
      {
        key: 'kr-KR',
        value: 'Korean',
      },
    ]

    return list.filter(({ key }) => !!locales && locales.includes(key))
  }, [locales])

  return (
    <>
      <IconButton
        id="basic-button"
        onClick={handleClick}
        size="small"
        aria-controls={open ? 'lang-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Language />
      </IconButton>
      <Menu
        id="lang-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'lang-button',
        }}
      >
        {LanguageLocales.map((locale) => (
          <MenuItem key={locale.key}>
            <Link href={{ pathname, query }} as={asPath} locale={locale.key}>
              <a
                style={{
                  width: '100%',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
                onClick={() =>
                  setCookie(
                    COOKIE_NEXT_LOCALE,
                    locale.key,
                    COOKIE_NEXT_LOCALE_EXPIRES
                  )
                }
              >
                {t(locale.value)}
              </a>
            </Link>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default SwitchLanguage
