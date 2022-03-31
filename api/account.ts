import { UserEntity } from 'types'
import type { Wallet } from 'use-wallet/dist/cjs/types'

import backend from './backend'

const service = async (wallet: Wallet, action: 'login' | 'signup') => {
  const account = wallet.account
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

export async function refresh(): Promise<UserEntity | boolean> {
  try {
    const res = await backend.patch<UserEntity>('/accounts/tokens')
    return res.data
  } catch (e) {
    return false
  }
}

export async function logout(): Promise<void> {
  await backend.delete('/accounts/tokens')
}
