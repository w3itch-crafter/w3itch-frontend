import { getUser } from 'api'
import { getAddress, parseUnits } from 'ethers/lib/utils'
import { useTopCenterSnackbar } from 'hooks'
import { useCallback, useEffect } from 'react'
export default function useMetamask() {
  const topCenterSnackbar = useTopCenterSnackbar()

  // Handle eth send transaction
  const ethSendTransaction = useCallback(
    (from: string, to: string, amount: string) => {
      try {
        if (!window.ethereum) {
          return
        }

        // https://docs.metamask.io/guide/sending-transactions.html#example
        window.ethereum
          .request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: from,
                to: to,
                value: parseUnits(amount, 18).toHexString(),
                // gasPrice: '0x09184e72a000',
                // gas: '0x2710',
              },
            ],
          })
          .then((txHash: string) => {
            topCenterSnackbar(`Hash: ${txHash}`)
            console.log(txHash)
          })
          .catch((error: unknown) => console.error(error))
      } catch (error) {
        console.error(error)
      }
    },
    [topCenterSnackbar]
  )

  // send transaction
  const sendTransaction = useCallback(
    async (username: string, amount: string) => {
      if (!window.ethereum) {
        topCenterSnackbar('please install MetaMask Wallet')
        return
      }

      try {
        const accounts: string[] = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })

        if (!accounts && !accounts[0]) {
          topCenterSnackbar('account not found')
          return
        }

        // fetch user
        const user = await getUser(username)
        // user account wallet address
        const account = user?.accounts.find(
          (account) => account.platform === 'metamask'
        )

        if (!account) {
          topCenterSnackbar('user does not have a wallet address')
          return
        }

        ethSendTransaction(
          getAddress(accounts[0]),
          getAddress(account.accountId),
          amount
        )
      } catch (e) {
        console.log(e)
      }
    },
    [topCenterSnackbar, ethSendTransaction]
  )

  useEffect(() => {
    window.MINETEST_METAMASK = {
      sendTransaction,
    }
  }, [sendTransaction])

  return {
    sendTransaction,
  }
}
