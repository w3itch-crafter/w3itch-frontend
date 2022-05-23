import { Language } from '@mui/icons-material'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import React, { Fragment, useState } from 'react'

const SwitchLanguage = () => {
  const router = useRouter()

  const { t } = useTranslation()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

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
        <MenuItem>
          <Link href={router.asPath} passHref locale={'zh-CN'}>
            <a
              style={{
                width: '100%',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              {t('Chinese (Simplified)')}
            </a>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href={router.asPath} passHref locale={'en-US'}>
            <a
              style={{
                width: '100%',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              {t('English')}
            </a>
          </Link>
        </MenuItem>
      </Menu>
    </>
  )
}

export default SwitchLanguage
