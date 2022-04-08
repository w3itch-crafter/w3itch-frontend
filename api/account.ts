import { AccountEntity, UserEntity } from 'types'
import { Api } from 'types/Api'
import type { Wallet } from 'use-wallet/dist/cjs/types'

import backend from './backend'

const service = async (
  wallet: Wallet,
  action: 'login' | 'signup',
  username?: string
) => {
  const account = wallet.account
  const {
    data: { code },
  } = await backend.post<Api.AccountsMetamaskVerificationCodeResponse>(
    '/accounts/metamask/verification-code',
    { key: account }
  )
  const message = `\x19Ethereum Signed Message:\n Code Length: ${code.length}; Code: ${code}`
  const signature = await wallet.ethereum.request({
    method: 'personal_sign',
    params: [message, account],
  })

  const res = await backend.post<Api.AccountsMetamaskActionResponse>(
    `/accounts/metamask/${action}`,
    { account, signature, username }
  )
  return res.data
}

export const signup = async (wallet: Wallet, username: string) => {
  return await service(wallet, 'signup', username)
}

export const login = async (wallet: Wallet) => {
  return await service(wallet, 'login')
}

export async function refresh(): Promise<UserEntity | null> {
  try {
    const res = await backend.patch<UserEntity>('/accounts/tokens')
    return res.data
  } catch (error) {
    return null
  }
}

export async function logout(): Promise<void> {
  await backend.delete('/accounts/tokens')
}

export async function getMine(): Promise<AccountEntity | null> {
  try {
    const res = await backend.get<AccountEntity>('/accounts/mine')
    return res.data
  } catch (error) {
    return null
  }
}
