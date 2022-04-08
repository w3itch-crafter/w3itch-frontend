import { Provider } from '@ethersproject/providers'
import { ERC20, ERC20__factory } from 'contracts'
import { BigNumber } from 'ethers'
import React from 'react'

export function useERC20(address: string, provider: Provider) {
  return React.useMemo(
    () => ERC20__factory.connect(address, provider),
    [address, provider]
  )
}

export function useERC20Balance(contract: ERC20, account?: string) {
  const [balance, setBalance] = React.useState<BigNumber>(BigNumber.from(0))
  const [decimals, setDecimals] = React.useState<number>(18)
  const getBalance = React.useCallback(async () => {
    if (account) {
      const balance = await contract.balanceOf(account)
      const decimals = await contract.decimals()
      setBalance(balance)
      setDecimals(decimals)
    }
  }, [account, contract])

  React.useEffect(() => {
    getBalance()
  }, [getBalance])

  return { balance, decimals }
}
