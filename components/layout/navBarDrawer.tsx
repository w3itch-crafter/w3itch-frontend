import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Link from 'next/link'
import React, { Dispatch, FC, SetStateAction } from 'react'
import { NavLinks } from 'types'

interface NavBarDrawerProps {
  readonly navLinks: NavLinks
  readonly navLinksDrawer: boolean
  setNavLinksDrawer: Dispatch<SetStateAction<boolean>>
}

const NavBarDrawer: FC<NavBarDrawerProps> = ({ navLinks, navLinksDrawer, setNavLinksDrawer }) => {
  return (
    <Drawer anchor={'right'} open={navLinksDrawer} onClose={() => setNavLinksDrawer(false)}>
      <List>
        {navLinks.map((nav) => (
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
  )
}

export default NavBarDrawer
