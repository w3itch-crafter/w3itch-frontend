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
