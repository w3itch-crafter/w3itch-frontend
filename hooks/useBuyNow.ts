import { useCallback } from 'react'
import { PancakeSwapSupportedChainId, UniswapSupportedChainId } from 'types/enum'
import { getSwapURL } from 'utils'

declare type BuyNow = {
  chainId: UniswapSupportedChainId | PancakeSwapSupportedChainId
  inputCurrency: string
  outputCurrency: string
}

export function useBuyNow() {
  const buyNow = useCallback(({ chainId, inputCurrency, outputCurrency }: BuyNow) => {
    const confirm = window.confirm('Are you sure you want to jump to Uniswap/Pancakeswap to buy?')
    if (!confirm) return

    const url = getSwapURL(chainId, inputCurrency, outputCurrency)
    window.open(url, '_blank')
  }, [])

  return {
    buyNow,
  }
}
