import { AccountEntity, AccountServiceAction, UserEntity } from 'types'
import { Api } from 'types/Api'
import type { Wallet } from 'use-wallet/dist/cjs/types'

import backend from './backend'

declare type WalletSignatureService = {
  account: string
  signature: string
}

async function walletSignatureService(
  wallet: Wallet
): Promise<WalletSignatureService> {
  const walletAccount = wallet.account as string
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
  return { account: walletAccount, signature }
}

async function walletAccountService(
  action: 'login',
  wallet: Wallet,
  redirectUri?: string
): Promise<string>
async function walletAccountService(
  action: Exclude<AccountServiceAction, 'login'>,
  wallet: Wallet,
  username?: string
): Promise<Api.AccountsMetamaskActionResponse>
async function walletAccountService(
  action: AccountServiceAction,
  wallet: Wallet,
  arg3?: string
): Promise<Api.AccountsMetamaskActionResponse | string> {
  const sigObj = await walletSignatureService(wallet)
  const { account, signature } = sigObj
  const args = action === 'login' ? { redirectUri: arg3 } : { username: arg3 }
  const res = await backend.post<Api.AccountsMetamaskActionResponse | string>(
    `/accounts/metamask/${action}`,
    { account, signature, ...args }
  )
  return res.data
}
export async function signupWallet(
  wallet: Wallet,
  username: string
): Promise<Api.AccountsMetamaskActionResponse> {
  return await walletAccountService('signup', wallet, username)
}
export async function loginWallet(
  wallet: Wallet,
  redirectUri: string
): Promise<string> {
  return await walletAccountService('login', wallet, redirectUri)
}
export async function bindWallet(wallet: Wallet): Promise<void> {
  await walletAccountService('bind', wallet)
}
export async function unbindWallet(): Promise<void> {
  await backend.post(`/accounts/metamask/unbind`)
}

async function githubAccountService(
  action: AccountServiceAction,
  username?: string,
  redirectUri?: string
): Promise<string> {
  const res = await backend.post<string>(`/accounts/github/${action}`, {
    username,
    redirectUri,
  })
  return res.data
}
export async function signupGitHub(
  username: string,
  redirectUri?: string
): Promise<string> {
  return await githubAccountService('signup', username, redirectUri)
}
export async function loginGitHub(redirectUri?: string): Promise<string> {
  return await githubAccountService('login', undefined, redirectUri)
}
export async function bindGitHub(redirectUri?: string): Promise<string> {
  return await githubAccountService('bind', undefined, redirectUri)
}
export async function unbindGitHub(): Promise<void> {
  await githubAccountService('unbind')
}

async function discordAccountService(
  action: AccountServiceAction,
  username?: string,
  redirectUri?: string
): Promise<string> {
  const res = await backend.post<string>(`/accounts/discord/${action}`, {
    username,
    redirectUri,
  })
  return res.data
}
export async function signupDiscord(
  username: string,
  redirectUri?: string
): Promise<string> {
  return await discordAccountService('signup', username, redirectUri)
}
export async function loginDiscord(redirectUri?: string): Promise<string> {
  return await discordAccountService('login', undefined, redirectUri)
}
export async function bindDiscord(redirectUri?: string): Promise<string> {
  return await discordAccountService('bind', undefined, redirectUri)
}
export async function unbindDiscord(): Promise<void> {
  await discordAccountService('unbind')
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

export async function getMine(): Promise<AccountEntity[] | null> {
  try {
    const res = await backend.get<AccountEntity[]>('/accounts/mine')
    return res.data
  } catch (error) {
    return null
  }
}

export async function authSignup(
  username: string
): Promise<Api.AccountsAuthSignupResponse> {
  const res = await backend.post<Api.AccountsAuthSignupResponse>(
    '/accounts/authorize-callback-signup',
    { username }
  )
  return res.data
}
