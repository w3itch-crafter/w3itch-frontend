import { getUser } from 'api'
import { getAddress, parseUnits } from 'ethers/lib/utils'
import { useSnackbar } from 'notistack'
import { useCallback, useEffect } from 'react'
import { useWallet } from 'use-wallet'
import { Wallet } from 'use-wallet/dist/cjs/types'

export default function useMetamask() {
  const wallet = useWallet()
  const { enqueueSnackbar } = useSnackbar()

  // Handle eth send transaction
  const ethSendTransaction = useCallback(
    (from: string, to: string, amount: string) => {
      try {
        // https://docs.metamask.io/guide/sending-transactions.html#example
        window.MINETEST_METAMASK.wallet.ethereum
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
          .then((txHash: string) => console.log(txHash))
          .catch((error: unknown) => console.error(error))
      } catch (error) {
        console.error(error)
      }
    },
    []
  )

  // Handle transaction
  const transaction = useCallback(
    async ({
      _wallet,
      username,
      amount,
    }: {
      _wallet: Wallet
      username: string
      amount: string
    }) => {
      if (_wallet.status !== 'connected') {
        enqueueSnackbar('please connect wallet', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          variant: 'info',
        })
        return
      }

      try {
        // fetch user
        const user = await getUser(username)
        // console.log(
        //   user,
        //   parseUnits(amount, 18),
        //   parseUnits(amount, 18).toHexString(),
        //   parseUnits(amount, 18).toString()
        // )
        // wallet account address
        const account = user?.accounts.find(
          (account) => account.platform === 'metamask'
        )

        if (!account) {
          enqueueSnackbar('no wallet address', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
            variant: 'info',
          })
          return
        }

        if (_wallet.account) {
          ethSendTransaction(
            getAddress(_wallet.account),
            getAddress(account.accountId),
            amount
          )
        }
      } catch (error) {
        console.error(error)
      }
    },
    [enqueueSnackbar, ethSendTransaction]
  )

  // send transaction
  const sendTransaction = useCallback(
    async (username: string, amount: string) => {
      await window.MINETEST_METAMASK.wallet.connect('injected')

      let len = 0
      const interval = setInterval(() => {
        if (len > 10) {
          clearInterval(interval)
          return
        }

        // console.log('wallet MINETEST_METAMASK', window.MINETEST_METAMASK.wallet)
        if (window.MINETEST_METAMASK.wallet.status === 'connected') {
          clearInterval(interval)
          transaction({
            _wallet: window.MINETEST_METAMASK.wallet,
            username,
            amount,
          })
        }
        len++
      }, 1000)
    },
    [transaction]
  )

  useEffect(() => {
    window.MINETEST_METAMASK = {
      wallet,
      sendTransaction,
    }
  }, [wallet, sendTransaction])

  return {
    sendTransaction,
  }
}
