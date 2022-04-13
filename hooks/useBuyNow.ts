import { CurrentChainId } from 'constants/chains'
import { useCallback } from 'react'
import { getSwapURL } from 'utils'

export function useBuyNow() {
  const buyNow = useCallback(
    ({
      inputCurrency,
      outputCurrency,
    }: {
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

      const url = getSwapURL(CurrentChainId, inputCurrency, outputCurrency)
      window.open(url, '_blank')
    },
    []
  )

  return {
    buyNow,
  }
}
