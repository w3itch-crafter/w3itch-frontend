import { ethers } from 'ethers'
import { AccountEntity, UserEntity } from 'types'
import { Api } from 'types/Api'
import type { Wallet } from 'use-wallet/dist/cjs/types'

import backend from './backend'

async function walletAccountService(
  wallet: Wallet,
  action: 'login' | 'signup',
  username?: string
): Promise<Api.AccountsMetamaskActionResponse> {
  const walletAccount = wallet.account
  const {
    data: { code },
  } = await backend.post<Api.AccountsMetamaskVerificationCodeResponse>(
    '/accounts/metamask/verification-code',
    { key: walletAccount }
  )
  const message = `\x19Ethereum Signed Message:\n Code Length: ${code.length}; Code: ${code}`
  const signature = await wallet.ethereum.request({
    method: 'personal_sign',
    params: [message, walletAccount],
  })

  const res = await backend.post<Api.AccountsMetamaskActionResponse>(
    `/accounts/metamask/${action}`,
    { account: walletAccount, signature, username }
  )
  const { user, account } = res.data
  return {
    user,
    account: {
      ...account,
      accountId: ethers.utils.getAddress(account.accountId),
    },
  }
}

export async function signupWallet(
  wallet: Wallet,
  username: string
): Promise<Api.AccountsMetamaskActionResponse> {
  return await walletAccountService(wallet, 'signup', username)
}

export async function loginWallet(
  wallet: Wallet
): Promise<Api.AccountsMetamaskActionResponse> {
  return await walletAccountService(wallet, 'login')
}

async function githubAccountService(
  action: 'login' | 'signup',
  username?: string
): Promise<string> {
  const res = await backend.post<string>(`/accounts/github/${action}`, {
    username,
  })
  return res.data
}

export async function signupGitHub(username: string): Promise<string> {
  return await githubAccountService('signup', username)
}

export async function loginGitHub(): Promise<string> {
  return await githubAccountService('login')
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
    const { data } = await backend.get<AccountEntity>('/accounts/mine')
    return { ...data, accountId: ethers.utils.getAddress(data.accountId) }
  } catch (error) {
    return null
  }
}
