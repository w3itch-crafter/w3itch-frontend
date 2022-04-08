import { Provider } from '@ethersproject/providers'
import { ethers } from 'ethers'
import React from 'react'

const provider = new ethers.providers.InfuraProvider('rinkeby')

export const ReadonlyEthersProviderContext =
  React.createContext<Provider>(provider)

declare interface ReadonlyProviderProps {
  children: React.ReactNode
}

export function ReadonlyEthersProvider({ children }: ReadonlyProviderProps) {
  return (
    <ReadonlyEthersProviderContext.Provider value={provider}>
      {children}
    </ReadonlyEthersProviderContext.Provider>
  )
}
