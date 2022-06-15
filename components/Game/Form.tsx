import LoadingButton from '@mui/lab/LoadingButton'
import { Editor as ToastUiEditor } from '@toast-ui/react-editor'
import { TokenInfo } from '@uniswap/token-lists'
import { useDebounceFn } from 'ahooks'
import { createGame, gameValidate, saveAlgoliaGame } from 'api/index'
import { storagesUploadToAWS, updateGame } from 'api/index'
import { AxiosError } from 'axios'
import BigNumber from 'bignumber.js'
import { TokenList } from 'components'
import { SupportedChainId, WalletSupportedChainIds } from 'constants/chains'
import { utils } from 'ethers'
import {
  useFormInitializationData,
  useTitle,
  useTopCenterSnackbar,
} from 'hooks'
import { isEmpty, trim } from 'lodash'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import React, { Fragment, useEffect, useState } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { useFormContext, useWatch } from 'react-hook-form'
import stylesCommon from 'styles/common.module.scss'
import styles from 'styles/game/new.module.scss'
import { GameEntity } from 'types'
import { Api } from 'types/Api'
import { EditorMode, GameEngine, PaymentMode } from 'types/enum'
import { ProjectClassification, ReleaseStatus } from 'types/enum'
import { filenameHandle, fileUrl, removeFormDataCache } from 'utils'
import { Game, inferProjectType, isStringNumber, urlGame } from 'utils'
import { parseFilename, parseUrl, processMessage } from 'utils'

import FormCharset from './FormCharset'
import FormClassification from './FormClassification'
import FormCommunity from './FormCommunity'
import FormDescription from './FormDescription'
import FormGameCover from './FormGameCover'
import FormGameFile from './FormGameFile'
import FormGameScreenshots from './FormGameScreenshots'
import FormGenre from './FormGenre'
import FormHeader from './FormHeader'
import FormKind from './FormKind'
import FormPricing from './FormPricing'
import FormReleaseStatus from './FormReleaseStatus'
import FormTitle from './FormTitle'
import FormProjectURL from './FormProjectURL'
import FormSubtitle from './FormSubtitle'
import FormTags from './FormTags'

interface GameFormProps {
  readonly gameProject: GameEntity
  readonly editorMode: EditorMode
  readonly editorRef: React.MutableRefObject<ToastUiEditor> | undefined
  setEditorRef: React.Dispatch<
    React.SetStateAction<React.MutableRefObject<ToastUiEditor> | undefined>
  >
}

let MESSAGE_SUBMIT_KEY: string | number

export const defaultCoverLinks = new Map([
  [
    GameEngine.DEFAULT,
    'http://n.sinaimg.cn/auto/transform/20170521/Z87u-fyfkzhs7969292.jpg',
  ],
  [
    GameEngine.RM2K3E,
    'https://image.w3itch.io/w3itch-test/attachment/30/world-overview.crystal2.8dde7d50-ec9a-11ec-956c-03700aa82971.png',
  ],
  [
    GameEngine.DOWNLOADABLE,
    'https://dotnet.microsoft.com/static/images/redesign/download/dotnet-framework-runtime.svg?v=22xvQuHVYJL7LD0xeWgHfLKUNROSdPrvv0q3aBlVvsY',
  ],
])

const GameForm: React.FC<GameFormProps> = ({
  gameProject,
  editorMode,
  editorRef,
  setEditorRef,
}) => {
  const router = useRouter()
  const id = router.query.id as string

  const { handleSubmit, setValue, control, watch, trigger } =
    useFormContext<Game>()

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
  const [currentSelectToken, setCurrentSelectToken] = useState<TokenInfo>(
    {} as TokenInfo
  )
  const [currentSelectTokenFlag, setCurrentSelectTokenFlag] =
    useState<boolean>(false)
  const [currentSelectTokenAmount, setCurrentSelectTokenAmount] =
    useState<string>('0')
  const [currentSelectTokenAmountFlag, setCurrentSelectTokenAmountFlag] =
    useState<boolean>(false)
  const [currentDonationAddress, setCurrentDonationAddress] =
    useState<string>('')

  const { createGamePageTitle } = useTitle()
  const pageTitle = createGamePageTitle(editorMode)
  const { initialization, initializationDonation } = useFormInitializationData({
    gameProject,
  })

  const watchKind = watch('kind')
  const watchAppStoreLinks = useWatch({
    control,
    name: 'appStoreLinks',
  })

  // Watch appStoreLinks change then trigger
  useEffect(() => {
    trigger('appStoreLinks')
  }, [watchAppStoreLinks, trigger])

  const validate = (cond: boolean, msg: string) => {
    if (cond) throw new Error(msg)
  }

  // 先支持 编辑
  const validateGameFile = () =>
    validate(
      editorMode === EditorMode.CREATE && !uploadGameFile,
      'Please upload game files'
    )

  const validateDescription = (description: string) =>
    validate(!description, 'Description cannot be empty')

  const validatePaymentMode = (game: Game) => {
    if (game.paymentMode === PaymentMode.PAID) {
      validate(!currentSelectTokenChainId, 'Please select chainId')
      validate(isEmpty(currentSelectToken), 'Please select Token')
      validate(
        !currentSelectTokenAmount || currentSelectTokenAmount === '0',
        'Please enter amount'
      )
      validate(
        !isStringNumber(currentSelectTokenAmount),
        'Please enter the correct amount'
      )
      validate(
        new BigNumber(currentSelectTokenAmount).lte('0'),
        'Amount needs to be greater than zero'
      )
    }
    if (game.paymentMode === PaymentMode.FREE) {
      validate(
        !currentDonationAddress || !utils.isAddress(currentDonationAddress),
        'Please set a donation address'
      )
    }
  }
  const validateGamePayload = async (data: Partial<Api.GameProjectDto>) => {
    const result = await gameValidate(data)
    if (result.status !== 200) {
      console.error('gameValidateResult', result)
      throw new Error('Game validate error')
    }
  }

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
      cover: coverFileFile ? resultAllImages[0].data.publicUrl : undefined,
      screenshots: screenshotsFiles?.length
        ? coverFileFile
          ? resultAllImages.slice(1).map((i) => i.data.publicUrl)
          : resultAllImages.map((i) => i.data.publicUrl)
        : [],
    }
  }

  const handleCreateGame = async (gameData: Partial<Api.GameProjectDto>) => {
    MESSAGE_SUBMIT_KEY = showSnackbar('Uploading game...', 'info', {
      persist: true,
    })

    // check field
    await validateGamePayload(gameData)

    const formData = new FormData()
    formData.append('file', uploadGameFile as File)
    formData.append('game', JSON.stringify(gameData))

    const createGameResult = await createGame(formData)
    // console.log('createGameResult', createGameResult)
    if (createGameResult.status === 201) {
      saveAlgoliaGame(Number(createGameResult.data.id))
      // Remove form cache
      removeFormDataCache(id)
      showSnackbar('Uploaded successfully', 'success')
      router.push('/dashboard')
    } else {
      console.error('createGame', createGameResult)
      throw new Error('createGame error')
    }
  }

  const handleUpdateGame = async (gameData: Partial<Api.GameProjectDto>) => {
    MESSAGE_SUBMIT_KEY = showSnackbar('Updating game...', 'info', {
      persist: true,
    })

    // Update game payload not allow gameName kind classification
    delete gameData.gameName
    delete gameData.kind
    delete gameData.classification

    // No re-upload cover removed gameName cover
    if (!coverFileFile) {
      delete gameData.cover
    }
    // No re-upload screenshots Deleted game screenshots
    if (isEmpty(screenshotsFiles)) {
      // delete all game screenshots
      if (isEmpty(gameData.screenshots)) {
        delete gameData.screenshots
      }
    }

    // check field
    await validateGamePayload(gameData)

    // 更新游戏文件
    const formData = new FormData()
    formData.append('file', uploadGameFile || '')
    formData.append('game', JSON.stringify(gameData))

    const updateGameResult = await updateGame(Number(id), formData)
    if (updateGameResult.status === 200) {
      saveAlgoliaGame(Number(updateGameResult.data.id))
      // Remove form cache
      removeFormDataCache(id)
      showSnackbar('Update completed', 'success')
      router.push(urlGame(id as string))
    } else {
      console.error('updateGame', updateGameResult)
      throw new Error('Update game error')
    }
  }

  // handle create/edit game
  const handleGame = async (game: Game) => {
    const description = editorRef?.current?.getInstance().getMarkdown() || ''
    const prices: Api.GameProjectPricesDto[] = []

    try {
      validateGameFile()
      validateDescription(description)
      validatePaymentMode(game)
    } catch (e: unknown) {
      return showSnackbar((e as Error).message, 'warning')
    }

    if (game.paymentMode === PaymentMode.PAID) {
      prices.push({
        chainId: currentSelectTokenChainId,
        amount: utils
          .parseUnits(currentSelectTokenAmount, currentSelectToken.decimals)
          .toString(),
        token: currentSelectToken.address,
      })
    }

    // Parpare game data
    const allImages = await handleAllImages()
    const kind =
      game.kind === GameEngine.DEFAULT && uploadGameFile
        ? await inferProjectType(uploadGameFile)
        : game.kind
    const gameData: Partial<Api.GameProjectDto> = {
      title: trim(game.title),
      subtitle: trim(game.subtitle),
      gameName: trim(game.gameName).replaceAll(' ', '_'),
      classification: ProjectClassification.GAMES,
      kind,
      releaseStatus: ReleaseStatus.RELEASED,
      screenshots: allImages.screenshots,
      cover: allImages.cover || defaultCoverLinks.get(kind),
      tags: game.tags,
      appStoreLinks: game.appStoreLinks,
      description: trim(description),
      community: game.community,
      genre: game.genre,
      charset: game.charset,
      paymentMode: game.paymentMode,
      prices,
      donationAddress: currentDonationAddress,
    }

    // Remove donation address on disable payment
    if (game.paymentMode === PaymentMode.DISABLE_PAYMENTS) {
      delete gameData.donationAddress
    }

    console.log('file', uploadGameFile)
    console.log('gameData', gameData)

    setSubmitLoading(true)
    try {
      if (editorMode === EditorMode.CREATE) {
        await handleCreateGame(gameData)
      }
      if (editorMode === EditorMode.EDIT) {
        if (!id) return
        await handleUpdateGame(gameData)
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
    handleGame(data)
  }

  // handle cover
  const handleCover = React.useCallback(
    async (file?: File) => {
      setCoverFileFile(file)
      setValue('cover', parseUrl(fileUrl(file)))
      await trigger('cover')
    },
    [setValue, trigger]
  )

  // handle screenshots
  const handleScreenshots = React.useCallback(
    async (files: File[] | undefined) => {
      setScreenshotsFiles(files)

      const screenshotsUrls = files
        ? files.map((file) => parseUrl(fileUrl(file)))
        : []

      setValue('screenshots', screenshotsUrls)
      await trigger('screenshots')
    },
    [setValue, trigger]
  )

  // handle gameFile
  const handleGameFile = React.useCallback(
    async (file: File | undefined) => {
      setUploadGameFile(file)

      const name = parseFilename(file?.name || '')
      if (name) {
        setValue('gameName', name)
        await trigger('gameName')
      }
    },
    [setValue, trigger]
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

  useEffect(() => {
    initialization({
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
    })

    initializationDonation({
      currentDonationAddress,
      setCurrentDonationAddress,
    })
  }, [
    editorMode,
    currentSelectTokenChainIdFlag,
    currentSelectToken,
    currentSelectTokenFlag,
    currentSelectTokenAmountFlag,
    currentSelectTokenAmount,
    currentDonationAddress,
    initialization,
    initializationDonation,
  ])

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
                      <FormKind {...{ editorMode }} />
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
                          setCurrentSelectToken({} as TokenInfo)
                        }}
                      />
                    </div>

                    <div
                      className={`${styles.input_row} ${styles.simulation_input}`}
                    >
                      <FormGameFile
                        editorMode={editorMode}
                        onGameFileSelect={handleGameFile}
                      />
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
                      <FormGameCover
                        editorMode={editorMode}
                        onCoverFileSelect={handleCover}
                      />
                    </div>
                    <section className={styles.screenshot_editor}>
                      <FormGameScreenshots
                        editorMode={editorMode}
                        onScreenshotFilesSelect={handleScreenshots}
                      />
                    </section>
                  </div>
                </div>
                <div className={styles.buttons}>
                  <LoadingButton
                    variant="contained"
                    type="submit"
                    loading={submitLoading}
                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                  >
                    {editorMode === EditorMode.CREATE && 'Save'}
                    {editorMode === EditorMode.EDIT && 'Update'}
                  </LoadingButton>
                  <div className={`${styles.loader} ${styles.form_loader}`} />
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
