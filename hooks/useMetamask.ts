import { getUser } from 'api'
import { getAddress, parseUnits } from 'ethers/lib/utils'
import { useSnackbar } from 'notistack'
import { useCallback, useEffect } from 'react'
import { useWallet } from 'use-wallet'

export default function useMetamask() {
  const wallet = useWallet()
  const { enqueueSnackbar } = useSnackbar()

  // send transaction
  const sendTransaction = useCallback(
    async (username: string, amount: string) => {
      await wallet.connect('injected')

      if (wallet.status !== 'connected') {
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

        // https://docs.metamask.io/guide/sending-transactions.html#example
        wallet.ethereum
          .request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: wallet.account,
                to: getAddress(account.accountId),
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
    [wallet, enqueueSnackbar]
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
