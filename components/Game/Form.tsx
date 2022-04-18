import {
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  TextField,
} from '@mui/material'
import Select from '@mui/material/Select'
import { AxiosError } from 'axios'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
  Dispatch,
  FC,
  Fragment,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import stylesCommon from 'styles/common.module.scss'
import styles from 'styles/game/new.module.scss'
const Editor = dynamic(() => import('components/Editor/index'), { ssr: false })
import { Editor as ToastUiEditor } from '@toast-ui/react-editor'
import {
  createGame,
  gameValidate,
  storagesUploadToIPFS,
  updateGame,
} from 'api/index'
import BigNumber from 'bignumber.js'
import { PrimaryLoadingButton } from 'components/CustomizedButtons'
import FormAppStoreLinks from 'components/Game/FormAppStoreLinks'
import FormCharset from 'components/Game/FormCharset'
import FormPricing from 'components/Game/FormPricing'
import FormTags from 'components/Game/FormTags'
import TokenList from 'components/TokenList'
import UploadGame from 'components/UploadGame/index'
import UploadGameCover from 'components/UploadGameCover/index'
import UploadGameScreenshots from 'components/UploadGameScreenshots/index'
import { CurrentChainId } from 'constants/chains'
import { AuthenticationContext } from 'context'
import { classifications, kindOfProjects, releaseStatus } from 'data'
import { BigNumber as BigNumberEthers, utils } from 'ethers'
import { ERC20MulticallTokenResult } from 'hooks/useERC20Multicall'
import { isEmpty, trim } from 'lodash'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import {
  Control,
  FieldError,
  FormState,
  SubmitHandler,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'
import { GameEntity } from 'types'
import { Api } from 'types/Api'
import {
  EditorMode,
  GameEngine,
  PaymentMode,
  ProjectClassification,
  ReleaseStatus,
} from 'types/enum'
import { fileUrl, isStringNumber, parseUrl, processMessage } from 'utils'
import { Game } from 'utils/validator'

import FormCommunity from './FormCommunity'
import FormGenre from './FormGenre'

interface GameFormProps {
  readonly gameProject: GameEntity
  readonly editorMode: EditorMode
  readonly register: UseFormRegister<Game>
  readonly handleSubmit: UseFormHandleSubmit<Game>
  readonly setValue: UseFormSetValue<Game>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly control: Control<Game, any>
  readonly watch: UseFormWatch<Game>
  readonly formState: FormState<Game>
  readonly getValues: UseFormGetValues<Game>
  readonly editorRef: MutableRefObject<ToastUiEditor> | undefined
  setEditorRef: Dispatch<
    SetStateAction<MutableRefObject<ToastUiEditor> | undefined>
  >
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let MESSAGE_SUBMIT_KEY: any

const GameForm: FC<GameFormProps> = ({
  gameProject,
  editorMode,
  register,
  handleSubmit,
  setValue,
  control,
  watch,
  formState,
  getValues,
  editorRef,
  setEditorRef,
}) => {
  const router = useRouter()
  const id = router.query.id

  console.log('form router', router)

  const {
    state: { isAuthenticated, account },
  } = useContext(AuthenticationContext)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const [uploadGameFile, setUploadGameFile] = useState<File>()
  const [coverFileFile, setCoverFileFile] = useState<File>()
  const [screenshotsFiles, setScreenshotsFiles] = useState<File[]>()
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const [tokenListDialogOpen, setTtokenListDialogOpen] = useState(false)
  const [currentSelectToken, setCurrentSelectToken] =
    useState<ERC20MulticallTokenResult>({} as ERC20MulticallTokenResult)
  const [currentSelectTokenAmount, setCurrentSelectTokenAmount] =
    useState<string>('0')
  const [currentDonationAddress, setCurrentDonationAddress] =
    useState<string>('')

  const { errors } = formState
  const watchPaymentMode = watch('paymentMode')

  // console.log(watch('paymentMode'))
  // console.log(watch('genre'))

  const handleAllImages = async () => {
    const promiseArray = []

    // cover
    if (coverFileFile) {
      const formDataCover = new FormData()
      formDataCover.append('file', coverFileFile)

      promiseArray.push(storagesUploadToIPFS(formDataCover))
    }

    // screenshots
    screenshotsFiles?.forEach((screenshotsFile) => {
      const formDataScreenshot = new FormData()
      formDataScreenshot.append('file', screenshotsFile)

      promiseArray.push(storagesUploadToIPFS(formDataScreenshot))
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

  // handle create game
  const handleCreateGame = async (game: Game) => {
    // 先支持 编辑
    if (editorMode === EditorMode.CREATE && !uploadGameFile) {
      enqueueSnackbar('Please upload game files', {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
        variant: 'warning',
      })
      return
    }

    let description = ''
    if (editorRef) {
      description = editorRef.current?.getInstance().getMarkdown()
    }

    if (!description) {
      enqueueSnackbar('description cannot be empty', {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
        variant: 'warning',
      })
      return
    }

    let prices: Api.GameProjectPricesDto[] = []
    if (game.paymentMode === PaymentMode.PAID) {
      if (isEmpty(currentSelectToken)) {
        enqueueSnackbar('Please select Token', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          variant: 'warning',
        })
        return
      }

      if (!currentSelectTokenAmount || currentSelectTokenAmount === '0') {
        enqueueSnackbar('Please enter amount', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          variant: 'warning',
        })
        return
      }
      if (!isStringNumber(currentSelectTokenAmount)) {
        enqueueSnackbar('Please enter the correct amount', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          variant: 'warning',
        })
        return
      }
      if (new BigNumber(currentSelectTokenAmount).lte('0')) {
        enqueueSnackbar('Amount needs to be greater than zero', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          variant: 'warning',
        })
        return
      }

      prices = [
        {
          chainId: CurrentChainId,
          amount: utils
            .parseUnits(currentSelectTokenAmount, currentSelectToken.decimals)
            .toString(),
          token: currentSelectToken.address,
        },
      ]
    } else if (game.paymentMode === PaymentMode.FREE) {
      if (!currentDonationAddress || !utils.isAddress(currentDonationAddress)) {
        enqueueSnackbar('Please set a donation address', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          variant: 'warning',
        })
        return
      }
    }

    setSubmitLoading(true)
    try {
      if (editorMode === EditorMode.CREATE) {
        MESSAGE_SUBMIT_KEY = enqueueSnackbar('uploading game...', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          variant: 'info',
          persist: true,
        })

        const allImages = await handleAllImages()

        const gameData = {
          title: trim(game.title),
          subtitle: trim(game.subtitle),
          gameName: trim(game.gameName).replaceAll(' ', '_'),
          classification: ProjectClassification.GAMES,
          kind: GameEngine.RM2K3E,
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
        console.log('createGameResult', createGameResult)

        if (createGameResult.status === 201) {
          enqueueSnackbar('Uploaded successfully', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
            variant: 'success',
          })
          router.push('/dashboard')
        } else {
          console.error('createGame', createGameResult)
          throw new Error('createGame error')
        }
      } else if (editorMode === EditorMode.EDIT) {
        if (!id) return

        MESSAGE_SUBMIT_KEY = enqueueSnackbar('updating game...', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          variant: 'info',
          persist: true,
        })

        const allImages = await handleAllImages()

        const gameData: Partial<Api.GameProjectDto> = {
          title: trim(game.title),
          subtitle: trim(game.subtitle),
          // The only game name is not allowed to be modified
          // gameName: trim(game.gameName).replaceAll(' ', '_'),
          cover: allImages.cover,
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

        // 更新游戏文件
        console.log('file', uploadGameFile || '')
        console.log('gameData', gameData)

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
        console.log('updateGameResult', updateGameResult)

        if (updateGameResult.status === 200) {
          enqueueSnackbar('Update completed', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
            variant: 'success',
          })
          router.push(`/game/${id}`)
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

      enqueueSnackbar(messageContent, {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
        variant: 'error',
      })
    } finally {
      closeSnackbar(MESSAGE_SUBMIT_KEY)
      setSubmitLoading(false)
    }
  }

  const onSubmit: SubmitHandler<Game> = async (data) => {
    console.log(data)
    handleCreateGame(data)
    // const result = await handleAllImages()

    // console.log('result', result)
  }

  console.log('errors', errors)

  // handle cover
  const handleCoverValue = (file: File) => {
    setCoverFileFile(file)
    setValue('cover', parseUrl(fileUrl(file)))
  }

  // handle screenshots
  const handleScreenshots = useCallback(
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
  const handleGameFile = useCallback(
    (file: File | undefined) => {
      setUploadGameFile(file)

      const name = file?.name.substring(0, file?.name.lastIndexOf('.'))
      if (name) {
        setValue('gameName', name)
      }
    },
    [setValue]
  )

  const handleDescription = useCallback(() => {
    if (editorRef) {
      const description = editorRef.current?.getInstance().getMarkdown()
      setValue('description', trim(description))
    }
  }, [editorRef, setValue])

  // watch current token fill data
  // paymentMode
  useEffect(() => {
    if (
      editorMode === EditorMode.EDIT &&
      getValues('paymentMode') === PaymentMode.PAID &&
      isEmpty(currentSelectToken) &&
      !isEmpty(gameProject?.prices[0])
    ) {
      // balanceOf and totalSupply are not processed
      setCurrentSelectToken({
        address: gameProject.prices[0].token.address,
        name: gameProject.prices[0].token.name,
        symbol: gameProject.prices[0].token.symbol,
        decimals: gameProject.prices[0].token.decimals,
        totalSupply: BigNumberEthers.from(0),
        balanceOf: BigNumberEthers.from(0),
      })
    }
  }, [
    currentSelectTokenAmount,
    gameProject,
    editorMode,
    currentSelectToken,
    watchPaymentMode,
    getValues,
  ])

  useEffect(() => {
    console.log('isAuthenticated', isAuthenticated)
    // if (!isAuthenticated) router.replace('/login')
  }, [isAuthenticated, router])

  return (
    <Fragment>
      <Head>
        <title>Create a new project - w3itch.io</title>
      </Head>
      <div className={stylesCommon.main}>
        <div className={stylesCommon.inner_column}>
          <div
            id="edit_game_page_43096"
            className={`${styles.edit_game_page} dashboard_game_edit_base_page ${styles.page_widget} ${styles.form} is_game`}
          >
            <div className={styles.tabbed_header_widget}>
              <div className={styles.header_breadcrumbs}>
                <Link href="/dashboard">
                  <a className={styles.trail}>Dashboard</a>
                </Link>
              </div>
              <div className={styles.stat_header_widget}>
                <div className="text_content">
                  <h2>Create a new project</h2>
                </div>
              </div>
            </div>
            {/* <div className={styles.payment_warning}>
                    <strong>{"You don't have payment configured"}</strong> If you set a
                    minimum price above 0 no one will be able to download your project.{' '}
                    <a target="_blank" href="/user/settings/seller">
                      Edit account
                    </a>
                  </div> */}

            <div className={styles.padded}>
              <form
                className={styles.game_edit_form}
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className={styles.columns}>
                  <div className={`main ${styles.left_col} first`}>
                    <p className={styles.content_guidelines}>
                      <strong>Make sure everyone can find your page</strong>
                      <br />
                      Review our{' '}
                      <a rel="noopener noreferrer" href="#" target="_blank">
                        quality guidelines
                      </a>{' '}
                      before posting your project
                    </p>

                    <div className={styles.input_row}>
                      <FormControl fullWidth>
                        <FormLabel id="form-title">Title</FormLabel>
                        <TextField
                          id="form-title"
                          variant="outlined"
                          aria-describedby="form-title-error-text"
                          error={!!errors.title}
                          helperText={errors.title ? errors.title.message : ''}
                          {...register('title')}
                        />
                      </FormControl>
                    </div>

                    <div className={styles.input_row}>
                      <FormControl fullWidth>
                        <FormLabel id="form-shortDescriptionOrTagline">
                          Short description or tagline
                        </FormLabel>
                        <p className={styles.sub}>
                          {
                            "Shown when we link to your project. Avoid duplicating your project's title"
                          }
                        </p>
                        <TextField
                          id="form-shortDescriptionOrTagline"
                          error={!!errors.subtitle}
                          helperText={
                            errors.subtitle ? errors.subtitle.message : ''
                          }
                          {...register('subtitle')}
                        />
                      </FormControl>
                    </div>
                    <div className={styles.input_row}>
                      <FormControl fullWidth>
                        <FormLabel id="form-classification">
                          Classification
                        </FormLabel>
                        <p className={styles.sub}>
                          {'What are you uploading?'}
                        </p>
                        <Select
                          id="form-classification"
                          disabled
                          defaultValue={classifications[0].value}
                        >
                          {classifications.map((classification) => (
                            <MenuItem
                              value={classification.value}
                              key={classification.value}
                            >
                              {classification.label}
                              {classification.description && (
                                <span className="sub">
                                  {' — '}
                                  {classification.description}
                                </span>
                              )}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>

                    <div className={styles.input_row}>
                      <FormControl fullWidth>
                        <FormLabel id="form-kindOfProject">
                          Kind of project
                        </FormLabel>
                        <Select
                          id="form-kindOfProject"
                          value={kindOfProjects[0].value}
                          disabled
                        >
                          {kindOfProjects.map((kind) => (
                            <MenuItem value={kind.value} key={kind.value}>
                              {kind.label}
                              {kind.description && (
                                <span className="sub">
                                  {' — '}
                                  {kind.description}
                                </span>
                              )}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <div data-label="Tip" className={styles.hint}>
                        You can add additional downloadable files for any of the
                        types above
                      </div>
                    </div>

                    <div className={styles.input_row}>
                      <FormCharset control={control} errors={errors} />
                    </div>

                    <div className={styles.input_row}>
                      <FormControl fullWidth>
                        <FormLabel id="form-releaseStatus">
                          Release status
                        </FormLabel>
                        <Select
                          id="form-releaseStatus"
                          value={releaseStatus[0].value}
                          disabled
                        >
                          {releaseStatus.map((i) => (
                            <MenuItem value={i.value} key={i.value}>
                              {i.label}
                              {i.description && (
                                <span className="sub">
                                  {' — '}
                                  {i.description}
                                </span>
                              )}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>

                    <div className={styles.input_row}>
                      <FormPricing
                        gameProject={gameProject}
                        control={control}
                        getValues={getValues}
                        errors={errors}
                        watch={watch}
                        token={currentSelectToken}
                        setTtokenListDialogOpen={setTtokenListDialogOpen}
                        tokenAmountChange={setCurrentSelectTokenAmount}
                        donationAddressChange={setCurrentDonationAddress}
                        currentSelectTokenAmount={currentSelectTokenAmount}
                        currentDonationAddress={currentDonationAddress}
                        editorMode={editorMode}
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
                          {
                            "File size limit: 1 GB. Game name doesn't allow starts or ends with _ or -."
                          }
                        </section>
                        <UploadGame
                          setFile={(file) =>
                            handleGameFile(file as File | undefined)
                          }
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
                          <>
                            <div>
                              Currently in update mode, please re-upload if you
                              need to update the game.
                            </div>
                            <div>(Game name will not change)</div>
                            <div>
                              Game name: <b>{getValues('gameName')}</b>
                            </div>
                          </>
                        )}

                        <FormHelperText>
                          {errors?.gameName?.message}
                        </FormHelperText>
                      </FormControl>
                    </div>

                    <div
                      className={`${styles.input_row} ${styles.simulation_input}`}
                    >
                      <FormControl
                        fullWidth
                        error={Boolean(errors.description)}
                      >
                        <FormLabel id="form-genre">Details</FormLabel>
                        <p className={styles.sub}>
                          Description — This will make up the content of your
                          game page.
                        </p>
                        <Editor
                          setRef={setEditorRef}
                          onChange={handleDescription}
                        />
                        <TextField
                          style={{
                            opacity: '0',
                            position: 'absolute',
                            zIndex: -99,
                          }}
                          {...register('description')}
                        />
                        <FormHelperText>
                          {errors?.description?.message}
                        </FormHelperText>
                      </FormControl>
                    </div>

                    <div className={`${styles.input_row}`}>
                      <FormGenre control={control} errors={errors} />
                    </div>
                    {editorMode === EditorMode.CREATE && (
                      <div className={`${styles.input_row} tags_input_row`}>
                        <FormTags
                          control={control}
                          errors={errors}
                          changeTags={(tags) => {
                            setValue('tags', tags)
                          }}
                        />
                      </div>
                    )}

                    {editorMode === EditorMode.CREATE && (
                      <div className={styles.input_row}>
                        <FormAppStoreLinks
                          errors={errors}
                          control={control}
                          changeLinks={(value) => {
                            setValue('appStoreLinks', value)
                          }}
                        />
                      </div>
                    )}

                    {/* <div className={styles.input_row}>
                            <FormControl fullWidth>
                              <FormLabel id="form-customNoun">Custom noun</FormLabel>
                              <p className={styles.sub}>
                                {
                                  'You can change how itch.io refers to your project by providing a custom noun.'
                                }
                              </p>
                              <p className={styles.sub}>
                                {" Leave blank to default to: '"}
                                <span className="user_classification_noun">mod</span>
                                {"'"}.
                              </p>
                              <TextField
                                id="form-customNoun"
                                placeholder="Optional"
                                disabled
                              />
                            </FormControl>
                          </div> */}

                    <div className={styles.input_row}>
                      <FormCommunity control={control} errors={errors} />
                    </div>
                    {/* <div className={styles.input_row}>
                            <FormControl>
                              <FormLabel id="demo-radio-buttons-group-label">
                                Visibility & access
                              </FormLabel>
                              <p className={styles.sub}>
                                Use Draft to review your page before making it public.{' '}
                                <a href="/docs/creators/access-control" target="blank">
                                  Learn more about access modes
                                </a>
                              </p>
                              <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="female"
                                name="radio-buttons-group"
                              >
                                <FormControlLabel
                                  value="disabled"
                                  control={<Radio />}
                                  label={
                                    <span>
                                      Draft
                                      <span className="sub">
                                        Only those who can edit the project can view the
                                        page
                                      </span>
                                    </span>
                                  }
                                />
                                <FormControlLabel
                                  value="restricted"
                                  control={<Radio />}
                                  label={
                                    <span>
                                      Restricted
                                      <span className="sub">
                                        {' '}
                                        — Only owners &amp; authorized people can view
                                        the page
                                      </span>
                                    </span>
                                  }
                                />
                                <FormControlLabel
                                  value="public"
                                  control={<Radio />}
                                  label={
                                    <span>
                                      Public
                                      <span className={styles.sub}>
                                        {' '}
                                        —{' '}
                                        <span>
                                          Anyone can view the page
                                          <span>
                                            ,{' '}
                                            <strong>
                                              {"you can enable this after you've saved"}
                                            </strong>
                                          </span>
                                        </span>
                                      </span>
                                    </span>
                                  }
                                ></FormControlLabel>
                              </RadioGroup>
                            </FormControl>
                          </div> */}
                  </div>
                  <div className={`misc ${styles.right_col}`}>
                    <div className={styles.simulation_input}>
                      <FormControl fullWidth error={Boolean(errors.gameName)}>
                        <div className={styles.game_edit_cover_uploader_widget}>
                          <UploadGameCover
                            editorMode={editorMode}
                            getValues={getValues}
                            watch={watch}
                            setFile={(file) => handleCoverValue(file as File)}
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
                    {editorMode === EditorMode.CREATE && (
                      <section className={styles.screenshot_editor}>
                        <div className={styles.label}>Screenshots</div>
                        <p className={styles.sub}>
                          <span className="when_default">
                            {"Screenshots will appear on your game's page."}{' '}
                          </span>
                          Optional but highly recommended. Upload 3 to 5 for
                          best results.
                        </p>
                        <FormHelperText error={Boolean(errors?.screenshots)}>
                          {
                            (errors?.screenshots as unknown as FieldError)
                              ?.message
                          }
                        </FormHelperText>
                        <UploadGameScreenshots
                          setFiles={(files) => {
                            handleScreenshots(files as File[] | undefined)
                          }}
                        />
                      </section>
                    )}
                  </div>
                </div>
                <div className={styles.buttons}>
                  <PrimaryLoadingButton
                    variant="contained"
                    type="submit"
                    loading={submitLoading}
                  >
                    {editorMode === EditorMode.CREATE
                      ? 'Save'
                      : editorMode === EditorMode.EDIT
                      ? 'Update'
                      : 'Save'}
                  </PrimaryLoadingButton>
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
        selectToken={(token) => {
          console.log(token)
          setCurrentSelectToken(token)
          setTtokenListDialogOpen(false)
        }}
      />
    </Fragment>
  )
}

export default GameForm
