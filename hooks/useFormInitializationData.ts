import { SupportedChainId } from 'constants/chains'
import { utils } from 'ethers'
import { isEmpty } from 'lodash'
import { Dispatch, SetStateAction, useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import { GameEntity, Token } from 'types'
import { EditorMode, PaymentMode } from 'types/enum'
import { Game } from 'utils'

function useFormInitializationData() {
  const { getValues } = useFormContext<Game>()

  const initialization = useCallback(
    ({
      editorMode,
      currentSelectTokenChainIdFlag,
      gameProject,
      currentSelectToken,
      currentSelectTokenFlag,
      currentSelectTokenAmountFlag,
      currentSelectTokenAmount,
      tokens,
      setCurrentSelectTokenChainId,
      setCurrentSelectTokenChainIdFlag,
      setCurrentSelectToken,
      setCurrentSelectTokenFlag,
      setCurrentSelectTokenAmount,
      setCurrentSelectTokenAmountFlag,
    }: {
      editorMode: EditorMode
      currentSelectTokenChainIdFlag: boolean
      gameProject: GameEntity
      currentSelectToken: Token
      currentSelectTokenFlag: boolean
      currentSelectTokenAmountFlag: boolean
      currentSelectTokenAmount: string
      tokens: Token[]
      setCurrentSelectTokenChainId: Dispatch<SetStateAction<SupportedChainId>>
      setCurrentSelectTokenChainIdFlag: Dispatch<SetStateAction<boolean>>
      setCurrentSelectToken: Dispatch<SetStateAction<Token>>
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
            logoURI:
              tokens.find(
                (token) =>
                  utils.getAddress(token.address) ===
                    utils.getAddress(address) && token.chainId === chainId
              )?.logoURI || '',
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
    [getValues]
  )

  return { initialization }
}

export { useFormInitializationData }
