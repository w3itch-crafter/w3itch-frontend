import LoadingButton from '@mui/lab/LoadingButton'
import { FormControl, FormHelperText, FormLabel } from '@mui/material'
import { TextField } from '@mui/material'
import { Editor as ToastUiEditor } from '@toast-ui/react-editor'
import { useDebounceFn } from 'ahooks'
import { createGame, gameValidate, saveAlgoliaGame } from 'api/index'
import { storagesUploadToAWS, updateGame } from 'api/index'
import { AxiosError } from 'axios'
import BigNumber from 'bignumber.js'
import { UploadGame, UploadGameCover, UploadGameScreenshots } from 'components'
import { TokenList } from 'components'
import { SupportedChainId, WalletSupportedChainIds } from 'constants/chains'
import { AuthenticationContext } from 'context'
import { utils } from 'ethers'
import { useAccountInfo, useTitle, useTopCenterSnackbar } from 'hooks'
import useTokens from 'hooks/useTokens'
import { isEmpty, trim } from 'lodash'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import React, { Fragment, useEffect, useState } from 'react'
import { FieldError, SubmitHandler } from 'react-hook-form'
import { useFormContext, useWatch } from 'react-hook-form'
import stylesCommon from 'styles/common.module.scss'
import styles from 'styles/game/new.module.scss'
import { GameEntity, Token } from 'types'
import { Api } from 'types/Api'
import { EditorMode, GameEngine, PaymentMode } from 'types/enum'
import { ProjectClassification, ReleaseStatus } from 'types/enum'
import { filenameHandle, fileUrl } from 'utils'
import { Game, inferProjectType, isStringNumber, urlGame } from 'utils'
import { parseFilename, parseUrl, processMessage } from 'utils'

import FormCharset from './FormCharset'
import FormClassification from './FormClassification'
import FormCommunity from './FormCommunity'
import FormDescription from './FormDescription'
import FormGameName from './FormGameName'
import FormGenre from './FormGenre'
import FormHeader from './FormHeader'
import FormKind from './FormKind'
import FormPricing from './FormPricing'
import FormReleaseStatus from './FormReleaseStatus'
import FormSubtitle from './FormSubtitle'
import FormTags from './FormTags'
import FormTitle from './FormTitle'

interface GameFormProps {
  readonly gameProject: GameEntity
  readonly editorMode: EditorMode
  readonly editorRef: React.MutableRefObject<ToastUiEditor> | undefined
  setEditorRef: React.Dispatch<
    React.SetStateAction<React.MutableRefObject<ToastUiEditor> | undefined>
  >
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let MESSAGE_SUBMIT_KEY: any

const GameForm: React.FC<GameFormProps> = ({
  gameProject,
  editorMode,
  editorRef,
  setEditorRef,
}) => {
  const router = useRouter()
  const id = router.query.id

  const { state } = React.useContext(AuthenticationContext)
  const { isAuthenticated } = state

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
    getValues,
    trigger,
  } = useFormContext<Game>()

  const account = useAccountInfo('metamask')
  const showSnackbar = useTopCenterSnackbar()
  const { closeSnackbar } = useSnackbar()

  const [uploadGameFile, setUploadGameFile] = useState<File>()
  const [coverFileFile, setCoverFileFile] = useState<File>()
  const [screenshotsFiles, setScreenshotsFiles] = useState<File[]>()
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const [tokenListDialogOpen, setTtokenListDialogOpen] = useState(false)
  const [currentSelectTokenChainId, setCurrentSelectTokenChainId] =
    useState<SupportedChainId>(WalletSupportedChainIds[0])
  const [currentSelectTokenChainIdFlag, setCurrentSelectTokenChainIdFlag] =
    useState<boolean>(false)
  const [currentSelectToken, setCurrentSelectToken] = useState<Token>(
    {} as Token
  )
  const [currentSelectTokenFlag, setCurrentSelectTokenFlag] =
    useState<boolean>(false)
  const [currentSelectTokenAmount, setCurrentSelectTokenAmount] =
    useState<string>('0')
  const [currentSelectTokenAmountFlag, setCurrentSelectTokenAmountFlag] =
    useState<boolean>(false)
  const [currentDonationAddress, setCurrentDonationAddress] =
    useState<string>('')
  const [currentDonationAddressFlag, setCurrentDonationAddressFlag] =
    useState<boolean>(false)

  const { tokens } = useTokens()
  const { createGamePageTitle } = useTitle()
  const pageTitle = createGamePageTitle(editorMode)

  const watchKind = watch('kind')
  const watchPaymentMode = watch('paymentMode')
  const watchAppStoreLinks = useWatch({
    control,
    name: 'appStoreLinks',
  })

  // Watch appStoreLinks change then trigger
  useEffect(() => {
    trigger('appStoreLinks')
  }, [watchAppStoreLinks, trigger])

  const handleAllImages = async () => {
    const promiseArray = []

    // cover
    if (coverFileFile) {
      const formDataCover = new FormData()
      formDataCover.append('file', filenameHandle(coverFileFile))

      promiseArray.push(storagesUploadToAWS(formDataCover))
    }

    // screenshots
    screenshotsFiles?.forEach((screenshotsFile) => {
      const formDataScreenshot = new FormData()
      formDataScreenshot.append('file', filenameHandle(screenshotsFile))

      promiseArray.push(storagesUploadToAWS(formDataScreenshot))
    })

    const resultAllImages = await Promise.all(promiseArray)

    console.log('resultAllImages', resultAllImages)

    return {
      cover: coverFileFile ? resultAllImages[0].data.publicUrl : '',
      screenshots: screenshotsFiles?.length
        ? coverFileFile
          ? resultAllImages.slice(1).map((i) => i.data.publicUrl)
          : resultAllImages.map((i) => i.data.publicUrl)
        : [],
    }
  }

  // handle create/edit game
  const handleGame = async (game: Game) => {
    // 先支持 编辑
    if (editorMode === EditorMode.CREATE && !uploadGameFile) {
      return showSnackbar('Please upload game files', 'warning')
    }

    let description = ''
    if (editorRef) {
      description = editorRef.current?.getInstance().getMarkdown()
    }
    if (!description) {
      return showSnackbar('Description cannot be empty', 'warning')
    }

    let prices: Api.GameProjectPricesDto[] = []
    if (game.paymentMode === PaymentMode.PAID) {
      if (!currentSelectTokenChainId) {
        return showSnackbar('Please select chainId', 'warning')
      }
      if (isEmpty(currentSelectToken)) {
        return showSnackbar('Please select Token', 'warning')
      }
      if (!currentSelectTokenAmount || currentSelectTokenAmount === '0') {
        return showSnackbar('Please enter amount', 'warning')
      }
      if (!isStringNumber(currentSelectTokenAmount)) {
        return showSnackbar('Please enter the correct amount', 'warning')
      }
      if (new BigNumber(currentSelectTokenAmount).lte('0')) {
        return showSnackbar('Amount needs to be greater than zero', 'warning')
      }

      prices = [
        {
          chainId: currentSelectTokenChainId,
          amount: utils
            .parseUnits(currentSelectTokenAmount, currentSelectToken.decimals)
            .toString(),
          token: currentSelectToken.address,
        },
      ]
    } else if (game.paymentMode === PaymentMode.FREE) {
      if (!currentDonationAddress || !utils.isAddress(currentDonationAddress)) {
        return showSnackbar('Please set a donation address', 'warning')
      }
    }

    setSubmitLoading(true)
    try {
      if (editorMode === EditorMode.CREATE) {
        MESSAGE_SUBMIT_KEY = showSnackbar('Uploading game...', 'info', {
          persist: true,
        })

        const allImages = await handleAllImages()
        const kind =
          game.kind === GameEngine.DEFAULT && uploadGameFile
            ? await inferProjectType(uploadGameFile)
            : game.kind
        const gameData: Api.GameProjectDto = {
          title: trim(game.title),
          subtitle: trim(game.subtitle),
          gameName: trim(game.gameName).replaceAll(' ', '_'),
          classification: ProjectClassification.GAMES,
          kind,
          releaseStatus: ReleaseStatus.RELEASED,
          screenshots: allImages.screenshots,
          cover: allImages.cover,
          tags: game.tags,
          appStoreLinks: game.appStoreLinks,
          description: trim(description),
          community: game.community,
          genre: game.genre,
          charset: game.charset,
          paymentMode: game.paymentMode,
          prices: prices,
          donationAddress:
            game.paymentMode === PaymentMode.FREE
              ? utils.getAddress(currentDonationAddress)
              : account?.accountId,
        }
        console.log('file', uploadGameFile)
        console.log('gameData', gameData)

        const formData = new FormData()
        formData.append('file', uploadGameFile as File)
        formData.append('game', JSON.stringify(gameData))

        // check field
        const gameValidateResult = await gameValidate(gameData)
        if (gameValidateResult.status !== 200) {
          console.error('gameValidateResult', gameValidateResult)
          throw new Error('gameValidate error')
        }

        const createGameResult = await createGame(formData)
        // console.log('createGameResult', createGameResult)

        if (createGameResult.status === 201) {
          saveAlgoliaGame(Number(createGameResult.data.id))

          showSnackbar('Uploaded successfully', 'success')
          router.push('/dashboard')
        } else {
          console.error('createGame', createGameResult)
          throw new Error('createGame error')
        }
      } else if (editorMode === EditorMode.EDIT) {
        if (!id) return

        MESSAGE_SUBMIT_KEY = showSnackbar('Updating game...', 'info', {
          persist: true,
        })

        const allImages = await handleAllImages()
        const kind =
          game.kind === GameEngine.DEFAULT && uploadGameFile
            ? await inferProjectType(uploadGameFile)
            : game.kind
        const gameData: Partial<Api.GameProjectDto> = {
          title: trim(game.title),
          subtitle: trim(game.subtitle),
          // The only game name is not allowed to be modified
          // gameName: trim(game.gameName).replaceAll(' ', '_'),
          kind,
          screenshots: allImages.screenshots,
          cover: allImages.cover,
          tags: game.tags,
          appStoreLinks: game.appStoreLinks,
          description: trim(description),
          community: game.community,
          genre: game.genre,
          charset: game.charset,
          paymentMode: game.paymentMode,
          prices: prices,
          donationAddress:
            game.paymentMode === PaymentMode.FREE
              ? utils.getAddress(currentDonationAddress)
              : account?.accountId,
        }

        // Did not re-upload game files Remove gameName field
        if (!uploadGameFile) {
          delete gameData.gameName
        }
        // No re-upload cover removed gameName cover
        if (!coverFileFile) {
          delete gameData.cover
        }
        // No re-upload screenshots Deleted game screenshots
        if (isEmpty(screenshotsFiles)) {
          // delete all game screenshots
          if (!isEmpty(game.screenshots)) {
            delete gameData.screenshots
          }
        }

        // 更新游戏文件
        const formData = new FormData()
        formData.append('file', uploadGameFile || '')
        formData.append('game', JSON.stringify(gameData))

        // check field
        const gameValidateResult = await gameValidate(gameData)
        if (gameValidateResult.status !== 200) {
          console.error('gameValidateResult', gameValidateResult)
          throw new Error('gameValidate error')
        }

        const updateGameResult = await updateGame(Number(id), formData)

        if (updateGameResult.status === 200) {
          saveAlgoliaGame(Number(updateGameResult.data.id))

          showSnackbar('Update completed', 'success')
          router.push(urlGame(id as string))
        } else {
          console.error('updateGame', updateGameResult)
          throw new Error('updateGame error')
        }
      } else {
        //
      }
    } catch (error: unknown) {
      console.error('createGame/updateGame error: ', error)

      const err = error as AxiosError<{
        error: string
        message: string | string[]
        statusCode: number
      }>

      let messageContent = ''

      if (err?.response) {
        const statusCode = err?.response?.status
        const message = processMessage(err?.response?.data.message || 'failed')
        messageContent = `statusCode: ${statusCode}, message: ${message}`
      } else {
        messageContent = (error as Error).message
      }

      showSnackbar(messageContent, 'error')
    } finally {
      closeSnackbar(MESSAGE_SUBMIT_KEY)
      setSubmitLoading(false)
    }
  }

  const onSubmit: SubmitHandler<Game> = async (data) => {
    console.log(data)
    handleGame(data)

    // const result = await handleAllImages()
    // console.log('result', result)
  }

  // handle cover
  const handleCoverValue = (file: File) => {
    setCoverFileFile(file)
    setValue('cover', parseUrl(fileUrl(file)))
  }

  // handle screenshots
  const handleScreenshots = React.useCallback(
    (files: File[] | undefined) => {
      setScreenshotsFiles(files)

      const screenshotsUrls = files
        ? files.map((file) => parseUrl(fileUrl(file)))
        : []

      setValue('screenshots', screenshotsUrls)
    },
    [setValue]
  )

  // handle gameFile
  const handleGameFile = React.useCallback(
    (file: File | undefined) => {
      setUploadGameFile(file)

      const name = parseFilename(file?.name || '')
      if (name) {
        setValue('gameName', name)
      }
    },
    [setValue]
  )

  // Description change triggers validation
  const { run: handleDescriptionTrigger } = useDebounceFn(
    async () => {
      await trigger('description')
    },
    {
      wait: 800,
    }
  )

  // Handle description change
  const handleDescription = React.useCallback(async () => {
    if (editorRef) {
      const description = editorRef.current?.getInstance().getMarkdown()
      setValue('description', trim(description))
    }
    await handleDescriptionTrigger()
  }, [editorRef, setValue, handleDescriptionTrigger])

  // watch current token fill data
  // paymentMode
  // edit mode has no data
  useEffect(() => {
    if (
      editorMode === EditorMode.EDIT &&
      getValues('paymentMode') === PaymentMode.PAID
    ) {
      // execute only once
      if (!currentSelectTokenChainIdFlag && !isEmpty(gameProject?.prices[0])) {
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
                utils.getAddress(token.address) === utils.getAddress(address) &&
                token.chainId === chainId
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

    // execute only once
    if (
      !currentDonationAddressFlag &&
      editorMode === EditorMode.EDIT &&
      getValues('paymentMode') === PaymentMode.FREE &&
      !currentDonationAddress
    ) {
      setCurrentDonationAddress(
        (gameProject?.donationAddress || account?.accountId) as string
      )
      setCurrentDonationAddressFlag(true)
    }
  }, [
    currentSelectTokenAmount,
    gameProject,
    editorMode,
    currentSelectToken,
    watchPaymentMode,
    getValues,
    tokens,
    currentDonationAddress,
    account,
    watchPaymentMode,
    currentSelectTokenChainId,
    currentSelectTokenFlag,
    currentSelectTokenChainIdFlag,
    currentSelectTokenAmountFlag,
    currentDonationAddressFlag,
  ])

  useEffect(() => {
    console.log('isAuthenticated', isAuthenticated)
    // if (!isAuthenticated) router.replace('/login')
  }, [isAuthenticated, router])

  return (
    <Fragment>
      <Head>
        <title>{pageTitle} - w3itch.io</title>
      </Head>
      <div className={stylesCommon.main}>
        <div className={stylesCommon.inner_column}>
          <div
            id="edit_game_page_43096"
            className={`${styles.edit_game_page} dashboard_game_edit_base_page ${styles.page_widget} ${styles.form} is_game`}
          >
            <FormHeader title={pageTitle} />
            {/* <FormPaymentWarn /> */}

            <div className={styles.padded}>
              <form
                className={styles.game_edit_form}
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className={styles.columns}>
                  <div className={`main ${styles.left_col} first`}>
                    {/* <FormContentGuidelines /> */}
                    <div className={styles.input_row}>
                      <FormTitle />
                    </div>
                    <div className={styles.input_row}>
                      <FormSubtitle />
                    </div>
                    <div className={styles.input_row}>
                      <FormClassification />
                    </div>
                    <div className={styles.input_row}>
                      <FormKind />
                    </div>
                    <div className={styles.input_row}>
                      <FormReleaseStatus />
                    </div>

                    <div className={styles.input_row}>
                      <FormPricing
                        currentDonationAddress={currentDonationAddress}
                        currentSelectTokenChainId={currentSelectTokenChainId}
                        currentSelectToken={currentSelectToken}
                        setTtokenListDialogOpen={setTtokenListDialogOpen}
                        setCurrentDonationAddress={setCurrentDonationAddress}
                        currentSelectTokenAmount={currentSelectTokenAmount}
                        setCurrentSelectTokenAmount={
                          setCurrentSelectTokenAmount
                        }
                        setCurrentSelectTokenChainId={(chainId) => {
                          setCurrentSelectTokenChainId(chainId)
                          // Switch chainId to clear token
                          setCurrentSelectToken({} as Token)
                        }}
                      />
                    </div>

                    <div
                      className={`${styles.input_row} ${styles.simulation_input}`}
                    >
                      <FormControl fullWidth error={Boolean(errors.gameName)}>
                        <FormLabel id="form-genre">Uploads</FormLabel>
                        <section
                          data-label="Tip"
                          className={`${styles.hint} ${styles.butler_tip}`}
                        >
                          File size limit: 1 GB. Game name doesn&apos;t allow
                          starts or ends with _ or -.
                        </section>
                        <UploadGame
                          setFile={async (file) => {
                            handleGameFile(file as File | undefined)
                            await trigger('gameName')
                          }}
                        />
                        <TextField
                          style={{
                            opacity: '0',
                            position: 'absolute',
                            zIndex: -99,
                          }}
                          {...register('gameName')}
                        />
                        {editorMode === EditorMode.EDIT && (
                          <FormGameName>{getValues('gameName')}</FormGameName>
                        )}
                        <FormHelperText>
                          {errors?.gameName?.message}
                        </FormHelperText>
                      </FormControl>
                    </div>

                    {/* minetest doesn't need charset */}
                    {!(watchKind === GameEngine.MINETEST) && (
                      <div className={styles.input_row}>
                        <FormCharset />
                      </div>
                    )}
                    <div
                      className={`${styles.input_row} ${styles.simulation_input}`}
                    >
                      <FormDescription
                        setRef={setEditorRef}
                        onChange={handleDescription}
                      />
                    </div>
                    <div className={`${styles.input_row}`}>
                      <FormGenre />
                    </div>
                    <div className={`${styles.input_row} tags_input_row`}>
                      <FormTags
                        editorMode={editorMode}
                        changeTags={(tags) => {
                          setValue('tags', tags)
                        }}
                      />
                    </div>

                    {/* <div className={styles.input_row}><FormAppStoreLinks /></div> */}
                    {/* <div className={styles.input_row}><FormCustomNoun /></div> */}
                    <div className={styles.input_row}>
                      <FormCommunity />
                    </div>
                    {/* <div className={styles.input_row}><FormAccess /></div> */}
                  </div>
                  <div className={`misc ${styles.right_col}`}>
                    <div className={styles.simulation_input}>
                      <FormControl fullWidth error={Boolean(errors.cover)}>
                        <div className={styles.game_edit_cover_uploader_widget}>
                          <UploadGameCover
                            editorMode={editorMode}
                            setFile={async (file) => {
                              handleCoverValue(file as File)
                              await trigger('cover')
                            }}
                          />
                          <p className={`${styles.sub} instructions`}>
                            The cover image is used whenever w3itch.io wants to
                            link to your project from another part of the site.
                            Required (Minimum: 315x250, Recommended: 630x500)
                          </p>
                        </div>
                        <TextField
                          style={{
                            opacity: '0',
                            position: 'absolute',
                            zIndex: -99,
                          }}
                          {...register('cover')}
                        />
                        <FormHelperText error={Boolean(errors.cover)}>
                          {errors?.cover?.message}
                        </FormHelperText>
                      </FormControl>
                    </div>
                    <section className={styles.screenshot_editor}>
                      <div className={styles.label}>Screenshots</div>
                      <p className={styles.sub}>
                        <span className="when_default">
                          {"Screenshots will appear on your game's page."}{' '}
                        </span>
                        Optional but highly recommended. Upload 3 to 5 for best
                        results.
                      </p>
                      <FormHelperText error={Boolean(errors?.screenshots)}>
                        {
                          (errors?.screenshots as unknown as FieldError)
                            ?.message
                        }
                      </FormHelperText>
                      <UploadGameScreenshots
                        editorMode={editorMode}
                        setFiles={async (files) => {
                          handleScreenshots(files as File[] | undefined)
                          await trigger('screenshots')
                        }}
                      />
                    </section>
                  </div>
                </div>
                <div className={styles.buttons}>
                  <LoadingButton
                    variant="contained"
                    type="submit"
                    loading={submitLoading}
                    sx={{
                      width: {
                        xs: '100%',
                        sm: 'auto',
                      },
                    }}
                  >
                    {editorMode === EditorMode.CREATE
                      ? 'Save'
                      : editorMode === EditorMode.EDIT
                      ? 'Update'
                      : 'Save'}
                  </LoadingButton>
                  <div
                    className={`${styles.loader} ${styles.form_loader}`}
                  ></div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <TokenList
        open={tokenListDialogOpen}
        setOpen={setTtokenListDialogOpen}
        chainId={currentSelectTokenChainId}
        selectToken={(token) => {
          setCurrentSelectToken(token)
          setTtokenListDialogOpen(false)
        }}
      />
    </Fragment>
  )
}

export default GameForm
