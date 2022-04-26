import assert from 'assert'
import {
  CHAIN_IDS_TO_NAMES,
  CHAIN_INFO,
  ChainInfo,
  SupportedChainId,
} from 'constants/chains'

export function getChainIdFromName(name: string): number | undefined {
  const entry = Object.entries(CHAIN_IDS_TO_NAMES).find(([, n]) => n === name)
  const chainId = entry?.[0]
  return chainId ? parseInt(chainId) : undefined
}

export function getChainNameFromId(id: string | number): string | undefined {
  // casting here may not be right but fine to return undefined if it's not a supported chain ID
  return CHAIN_IDS_TO_NAMES[id as SupportedChainId] || ''
}

export function getChainInfoFromName(name: string): ChainInfo | undefined {
  return CHAIN_INFO[getChainIdFromName(name) as SupportedChainId]
}

export function getChainInfoFromId(id: string | number): ChainInfo | undefined {
  return CHAIN_INFO[id as SupportedChainId]
}

export function getSwapURL(
  id: string | number,
  inputCurrency?: string,
  outputCurrency?: string
): string | undefined {
  const chainInfo = getChainInfoFromId(id)
  if (!chainInfo) return undefined
  const { name, swapLink } = chainInfo
  const query = new URLSearchParams({ chain: name })
  if (inputCurrency) query.set('inputCurrency', inputCurrency)
  if (outputCurrency) query.set('outputCurrency', outputCurrency)
  return `${swapLink}?${query.toString()}`
}

export function getRpcUrl(id: string | number): string | undefined {
  const chainInfo = getChainInfoFromId(id)
  if (!chainInfo) return undefined
  if (chainInfo.infuraNameKey) {
    const { NEXT_PUBLIC_INFURA_API_KEY } = process.env
    assert(
      NEXT_PUBLIC_INFURA_API_KEY,
      new TypeError('NEXT_PUBLIC_INFURA_API_KEY not set')
    )
    return `https://${chainInfo.infuraNameKey}.infura.io/v3/${NEXT_PUBLIC_INFURA_API_KEY}`
  }
  if (chainInfo.rpcUrl) return chainInfo.rpcUrl
  return undefined
}

/**
 * balance decimal
 * @param amount
 * @param decimal
 * @returns
 */
export const balanceDecimal = (amount: string, decimal = 6) => {
  // utils.formatUnits 0.0
  if (amount === '0.0') return '0'

  const point = amount.indexOf('.')
  if (~point) {
    return amount.slice(0, point + 1 + decimal)
  }
  return amount
}
