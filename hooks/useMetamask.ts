import { getUser } from 'api'
import { getAddress, parseUnits } from 'ethers/lib/utils'
import { useSnackbar } from 'notistack'
import { useCallback, useEffect } from 'react'

export default function useMetamask() {
  const { enqueueSnackbar } = useSnackbar()

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
            enqueueSnackbar(`Hash: ${txHash}`, {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
              },
              variant: 'info',
            })
            console.log(txHash)
          })
          .catch((error: unknown) => console.error(error))
      } catch (error) {
        console.error(error)
      }
    },
    [enqueueSnackbar]
  )

  // send transaction
  const sendTransaction = useCallback(
    async (username: string, amount: string) => {
      if (!window.ethereum) {
        enqueueSnackbar('please install MetaMask Wallet', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          variant: 'info',
        })
        return
      }

      try {
        const accounts: string[] = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })

        if (!accounts && !accounts[0]) {
          enqueueSnackbar('account not found', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
            variant: 'info',
          })
          return
        }

        // fetch user
        const user = await getUser(username)
        // user account wallet address
        const account = user?.accounts.find(
          (account) => account.platform === 'metamask'
        )

        if (!account) {
          enqueueSnackbar('user does not have a wallet address', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
            variant: 'info',
          })
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
    [enqueueSnackbar, ethSendTransaction]
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
