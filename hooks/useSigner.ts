import { ethers } from 'ethers'
import { useMemo } from 'react'
import { useWallet } from 'use-wallet'

/**
 * useSigner
 * @param addressOrIndex
 * @returns
 */
export function useSigner(addressOrIndex?: string | number) {
  const wallet = useWallet()

  const signer = useMemo(() => {
    if (!wallet.ethereum) return null
    const provider = new ethers.providers.Web3Provider(
      wallet.ethereum as ReturnType<typeof wallet.ethereum>
    )
    console.log('provider', provider)

    return provider.getSigner(addressOrIndex)
  }, [wallet, addressOrIndex])

  function isSignerReady(
    signer: ethers.providers.JsonRpcSigner | null
  ): signer is ethers.providers.JsonRpcSigner {
    console.log('signer', signer)
    return Boolean(signer)
  }

  return { signer, isSignerReady }
}
