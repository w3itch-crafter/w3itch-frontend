import { Provider } from '@ethersproject/providers'
import { ReadonlyEthersProviderContext } from 'context'
import { ethers } from 'ethers'
import React from 'react'

const RinkebyProvider = new ethers.providers.InfuraProvider('rinkeby')

declare interface ReadonlyProviderProps {
  children: React.ReactNode
  provider?: Provider
}

export function ReadonlyEthersProvider({
  children,
  provider,
}: ReadonlyProviderProps) {
  return (
    <ReadonlyEthersProviderContext.Provider value={provider || RinkebyProvider}>
      {children}
    </ReadonlyEthersProviderContext.Provider>
  )
}
