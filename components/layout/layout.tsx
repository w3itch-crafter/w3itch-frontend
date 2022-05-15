import { useTranslation } from 'next-i18next'
import React, { Fragment } from 'react'

import { NavLinks } from '../../types'
import { Footer } from './footer'
import { Navbar } from './navbar'

export declare interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <Fragment>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </Fragment>
  )
}

export default Layout
