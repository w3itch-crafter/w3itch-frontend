import { ReadonlyEthersProviderContext } from 'context'
import { ethers } from 'ethers'
import React from 'react'

const provider = new ethers.providers.InfuraProvider('rinkeby')

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
