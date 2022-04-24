import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Link from 'next/link'
import React, { Fragment, useState } from 'react'
import { NavLinks } from 'types'

import { Footer } from './footer'
import { Navbar } from './navbar'

export declare interface LayoutProps {
  children: React.ReactNode
}
const defaultLinks: NavLinks = [
  { href: '/games', name: 'Browse Games' },
  { href: '/dashboard', name: 'Dashboard' },
]

export function Layout({ children }: LayoutProps) {
  const [navLinksDrawer, setNavLinksDrawer] = useState<boolean>(false)

  return (
    <Fragment>
      <Navbar navLinks={defaultLinks} setNavLinksDrawer={setNavLinksDrawer} />
      <main>{children}</main>
      <Footer />
      <Drawer
        anchor={'right'}
        open={navLinksDrawer}
        onClose={() => setNavLinksDrawer(false)}
      >
        <List>
          {defaultLinks.map((nav) => (
            <Link href={nav.href} passHref key={nav.href}>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemText primary={nav.name} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>
    </Fragment>
  )
}

export default Layout
