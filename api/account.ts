import type { Wallet } from 'use-wallet/dist/cjs/types'

import backend from './backend'

const service = async (wallet: Wallet, action: 'login' | 'signup') => {
  const accounts = await wallet.ethereum.request({
    method: 'eth_requestAccounts',
  })
  const account = accounts[0]

  const code = (
    await backend.post('/accounts/metamask/verification-code', {
      key: account,
    })
  ).data.code
  const message = `\x19Ethereum Signed Message:\n Code Length: ${code.length}; Code: ${code}`
  const signature = await wallet.ethereum.request({
    method: 'personal_sign',
    params: [message, account],
  })

  await backend.post(`/accounts/metamask/${action}`, {
    account,
    signature,
  })
}

export const signup = async (wallet: Wallet) => {
  await service(wallet, 'signup')
}

export const login = async (wallet: Wallet) => {
  await service(wallet, 'login')
}
