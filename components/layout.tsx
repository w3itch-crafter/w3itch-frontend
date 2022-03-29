import React, { Fragment } from 'react'

import Footer from './footer'
import Navbar from './navbar'

export declare interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Fragment>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </Fragment>
  )
}
