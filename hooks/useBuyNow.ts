import { CurrentChainId } from 'constants/chains'
import { useCallback } from 'react'
import { getSwapURL } from 'utils'

declare type BuyNow = {
  inputCurrency: string
  outputCurrency: string
}
export function useBuyNow() {
  const buyNow = useCallback(({ inputCurrency, outputCurrency }: BuyNow) => {
    const confirm = window.confirm(
      'Are you sure you want to jump to Uniswap/Pancakeswap to buy?'
    )
    if (!confirm) return

    const url = getSwapURL(CurrentChainId, inputCurrency, outputCurrency)
    window.open(url, '_blank')
  }, [])

  return { buyNow }
}
