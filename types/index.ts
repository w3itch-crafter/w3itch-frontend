import { NextPage } from 'next'
import React from 'react'

export declare type PerPageLayout = {
  getLayout(page: React.ReactElement): React.ReactNode
}

export declare type NextPageWithLayout = NextPage & Partial<PerPageLayout>
