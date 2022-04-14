import { useCallback } from 'react'
import {
  PancakeSwapSupportedChainId,
  UniswapSupportedChainId,
} from 'types/enum'
import { getSwapURL } from 'utils'

export function useBuyNow() {
  const buyNow = useCallback(
    ({
      chainId,
      inputCurrency,
      outputCurrency,
    }: {
      chainId: UniswapSupportedChainId | PancakeSwapSupportedChainId
      inputCurrency: string
      outputCurrency: string
    }) => {
      if (
        !window.confirm(
          'Are you sure you want to jump to uniswap/pancakeswap to buy?'
        )
      ) {
        return
      }

      const url = getSwapURL(chainId, inputCurrency, outputCurrency)
      window.open(url, '_blank')
    },
    []
  )

  return {
    buyNow,
  }
}
