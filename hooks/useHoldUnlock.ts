import BigNumber from 'bignumber.js'
import { AuthenticationContext } from 'context'
import { utils } from 'ethers'
import { getAddress } from 'ethers/lib/utils'
import { useBuyNow } from 'hooks/useBuyNow'
import { isEmpty } from 'lodash'
import { useSnackbar } from 'notistack'
import { useCallback, useContext, useEffect, useState } from 'react'
import { GameEntity, TokenDetail } from 'types'
import { PaymentMode } from 'types/enum'

type UseHoldUnlock = {
  game: GameEntity
  token?: TokenDetail
}

export function useHoldUnlock({ game, token }: UseHoldUnlock) {
  // hold unlock
  // false can play
  // true can't play
  const [holdUnlock, setHoldUnlock] = useState<boolean>(true)
  const { enqueueSnackbar } = useSnackbar()
  const { buyNow } = useBuyNow()
  const {
    state: { user },
  } = useContext(AuthenticationContext)

  // Handle unlock
  const handleUnlock = useCallback(
    (fn: () => void) => {
      if (game.paymentMode === PaymentMode.PAID) {
        if (holdUnlock && token) {
          if (user) {
            buyNow({
              chainId: token.chainId,
              inputCurrency: '',
              outputCurrency: getAddress(token.address),
            })
          } else {
            enqueueSnackbar('please sign in!', {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
              },
              variant: 'info',
            })
          }
        } else {
          fn()
        }
      } else {
        fn()
      }
    },
    [game, buyNow, holdUnlock, token, user, enqueueSnackbar]
  )

  // Handle hold unlock
  const handleHoldUnlock = useCallback(() => {
    if (game.paymentMode === PaymentMode.PAID) {
      if (!token || isEmpty(token)) {
        return
      }

      // Publisher works do not need to hold unlock
      if (game.username === user?.username) {
        setHoldUnlock(false)
        return
      }

      const isUnlock = new BigNumber(utils.formatUnits(token.balanceOf, token.decimals)).gte(
        utils.formatUnits(token.amount, token.decimals)
      )

      if (isUnlock) {
        setHoldUnlock(false)
      }
    } else {
      setHoldUnlock(false)
    }
  }, [game, token, user, setHoldUnlock])

  useEffect(() => {
    handleHoldUnlock()
  }, [handleHoldUnlock])

  return {
    holdUnlock,
    handleUnlock,
  }
}
