import { TokenInfo } from '@uniswap/token-lists'
import { SupportedChainId } from 'constants/chains'
import { utils } from 'ethers'
import { useAccountInfo } from 'hooks'
import { isEmpty } from 'lodash'
import { Dispatch, SetStateAction, useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import { GameEntity } from 'types'
import { EditorMode, PaymentMode } from 'types/enum'
import { Game } from 'utils'

export function useFormInitializationData({
  gameProject,
}: {
  gameProject: GameEntity
}) {
  const { getValues } = useFormContext<Game>()
  const account = useAccountInfo('metamask')

  // Initialization
  // Execute only once
  const initialization = useCallback(
    ({
      editorMode,
      currentSelectTokenChainIdFlag,
      currentSelectToken,
      currentSelectTokenFlag,
      currentSelectTokenAmountFlag,
      currentSelectTokenAmount,
      setCurrentSelectTokenChainId,
      setCurrentSelectTokenChainIdFlag,
      setCurrentSelectToken,
      setCurrentSelectTokenFlag,
      setCurrentSelectTokenAmount,
      setCurrentSelectTokenAmountFlag,
    }: {
      editorMode: EditorMode
      currentSelectTokenChainIdFlag: boolean
      currentSelectToken: TokenInfo
      currentSelectTokenFlag: boolean
      currentSelectTokenAmountFlag: boolean
      currentSelectTokenAmount: string
      setCurrentSelectTokenChainId: Dispatch<SetStateAction<SupportedChainId>>
      setCurrentSelectTokenChainIdFlag: Dispatch<SetStateAction<boolean>>
      setCurrentSelectToken: Dispatch<SetStateAction<TokenInfo>>
      setCurrentSelectTokenFlag: Dispatch<SetStateAction<boolean>>
      setCurrentSelectTokenAmount: Dispatch<SetStateAction<string>>
      setCurrentSelectTokenAmountFlag: Dispatch<SetStateAction<boolean>>
    }) => {
      if (
        editorMode === EditorMode.EDIT &&
        getValues('paymentMode') === PaymentMode.PAID
      ) {
        // execute only once
        if (
          !currentSelectTokenChainIdFlag &&
          !isEmpty(gameProject?.prices[0])
        ) {
          setCurrentSelectTokenChainId(gameProject?.prices[0].token.chainId)
          setCurrentSelectTokenChainIdFlag(true)
        }

        // execute only once
        if (
          isEmpty(currentSelectToken) &&
          !isEmpty(gameProject?.prices[0]) &&
          !currentSelectTokenFlag
        ) {
          const { address, name, symbol, decimals, chainId } =
            gameProject.prices[0].token
          // balanceOf and totalSupply are not processed
          setCurrentSelectToken({
            address: address,
            name: name,
            symbol: symbol,
            decimals: decimals,
            // totalSupply: BigNumberEthers.from(0),
            // balanceOf: BigNumberEthers.from(0),
            chainId: chainId,
            logoURI: '',
          })
          setCurrentSelectTokenFlag(true)
        }

        // execute only once
        if (
          !currentSelectTokenAmountFlag &&
          (!currentSelectTokenAmount || currentSelectTokenAmount === '0') &&
          !isEmpty(gameProject?.prices[0])
        ) {
          setCurrentSelectTokenAmount(
            utils.formatUnits(
              gameProject.prices[0].amount,
              gameProject.prices[0].token.decimals
            )
          )
          setCurrentSelectTokenAmountFlag(true)
        }
      }
    },
    [getValues, gameProject]
  )

  // Initialization Donation
  // Execute only once
  const initializationDonation = useCallback(
    ({
      currentDonationAddress,
      setCurrentDonationAddress,
    }: {
      currentDonationAddress: string
      setCurrentDonationAddress: Dispatch<SetStateAction<string>>
    }) => {
      // Support default donation address issue-272
      if (!currentDonationAddress) {
        const address = gameProject?.donationAddress || account?.accountId
        if (address) {
          const checksumAddress = utils.getAddress(address)
          setCurrentDonationAddress(checksumAddress)
        }
      }
    },
    [account, gameProject]
  )

  return { initialization, initializationDonation }
}
