import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material'
import Select from '@mui/material/Select'
import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { MutableRefObject, useCallback, useEffect, useState } from 'react'
import stylesCommon from 'styles/common.module.scss'
import styles from 'styles/game/new.module.scss'
const Editor = dynamic(() => import('components/Editor/index'), { ssr: false })
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { classifications, genres, kindOfProjects, releaseStatus } from 'data'
import { Controller, FieldError, SubmitHandler, useForm } from 'react-hook-form'
import { Game } from 'utils/validator'
const resolverGame = classValidatorResolver(Game)
import { Editor as ToastUiEditor } from '@toast-ui/react-editor'
import { createGame, storagesUploadToIPFS } from 'api/index'
import { PrimaryLoadingButton } from 'components/CustomizedButtons'
import FormAppStoreLinks from 'components/Game/FormAppStoreLinks'
import FormCharset from 'components/Game/FormCharset'
import FormTags from 'components/Game/FormTags'
import UploadGame from 'components/UploadGame/index'
import UploadGameCover from 'components/UploadGameCover/index'
import UploadGameScreenshots from 'components/UploadGameScreenshots/index'
import { trim } from 'lodash'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import {
  Community,
  GameEngine,
  Genre,
  PaymentMode,
  ProjectClassification,
  ReleaseStatus,
} from 'types/enum'
import { fileUrl, parseUrl } from 'utils'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let MESSAGE_SUBMIT_KEY: any

const FormDefaultValues =
  process.env.NODE_ENV === 'development'
    ? {
        title: 'title 123',
        subtitle: 'subtitle 123',
        cover:
          'https://ipfs.fleek.co/ipfs/bafybeiflsgroqy4tjign5nrxj4crtlpwltmxpc6bziki4xkhiojpvllppa',
        screenshots: [
          'https://ipfs.fleek.co/ipfs/bafybeiflsgroqy4tjign5nrxj4crtlpwltmxpc6bziki4xkhiojpvllppa',
          'https://ipfs.fleek.co/ipfs/bafybeiflsgroqy4tjign5nrxj4crtlpwltmxpc6bziki4xkhiojpvllppa',
          'https://ipfs.fleek.co/ipfs/bafybeiflsgroqy4tjign5nrxj4crtlpwltmxpc6bziki4xkhiojpvllppa',
        ],
      }
    : {}

const GameNew: NextPage = () => {
  const router = useRouter()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const [editorRef, setEditorRef] = useState<MutableRefObject<ToastUiEditor>>()
  const [uploadGameFile, setUploadGameFile] = useState<File>()
  const [coverFileFile, setCoverFileFile] = useState<File>()
  const [screenshotsFiles, setScreenshotsFiles] = useState<File[]>()
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors: formErrors },
  } = useForm<Game>({
    resolver: resolverGame,
    defaultValues: {
      paymentMode: PaymentMode.DISABLE_PAYMENTS,
      community: Community.DISABLED,
      genre: Genre.NO_GENRE,
      tokenId: 0,
      tags: [],
      appStoreLinks: [],
      ...FormDefaultValues,
    },
  })

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
    if (!uploadGameFile) {
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

    MESSAGE_SUBMIT_KEY = enqueueSnackbar('uploading game...', {
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
      variant: 'info',
      persist: true,
    })
    setSubmitLoading(true)

    // @TODO need message notification
    const allImages = await handleAllImages()

    const gameData = {
      title: trim(game.title),
      paymentMode: game.paymentMode,
      subtitle: trim(game.subtitle),
      gameName: game.gameName,
      classification: ProjectClassification.GAMES,
      kind: GameEngine.RM2K3E,
      releaseStatus: ReleaseStatus.RELEASED,
      screenshots: allImages.screenshots,
      cover: allImages.cover,
      tags: game.tags,
      appStoreLinks: game.appStoreLinks,
      description: description,
      community: game.community,
      genre: Genre.NO_GENRE,
      tokenId: game.tokenId,
      charset: game.charset,
    }
    console.log('file', uploadGameFile)
    console.log('gameData', gameData)

    const formData = new FormData()
    formData.append('file', uploadGameFile)
    formData.append('game', JSON.stringify(gameData))

    try {
      const createGameResult = await createGame(formData)
      console.log('createGameResult', createGameResult)

      // @TODO 409
      if (createGameResult.status === 201) {
        enqueueSnackbar('Uploaded successfully', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          variant: 'success',
        })
        router.push('/dashboard')
      } else if (createGameResult.status === 409) {
        enqueueSnackbar('The name of the game is repeated, please modify it.', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          variant: 'warning',
        })
      } else {
        enqueueSnackbar('Upload failed', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          variant: 'error',
        })
      }
    } catch (error) {
      // @TODO 400 404 500
      console.error('error: ', error)
      enqueueSnackbar('Upload failed', {
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

  console.log('formErrors', formErrors)

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

  useEffect(() => {
    console.log('env', process.env.NODE_ENV)
  }, [])

  return (
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
                        error={!!formErrors.title}
                        helperText={
                          formErrors.title ? formErrors.title.message : ''
                        }
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
                        error={!!formErrors.subtitle}
                        helperText={
                          formErrors.subtitle ? formErrors.subtitle.message : ''
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
                      <p className={styles.sub}>{'What are you uploading?'}</p>
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
                    <FormCharset register={register} />
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

                  <div className={styles.price_picker}>
                    <div className="payment_modes">
                      <Controller
                        control={control}
                        name="paymentMode"
                        render={({ field }) => (
                          <FormControl
                            fullWidth
                            error={Boolean(formErrors.paymentMode)}
                          >
                            <FormLabel id="form-pricing">Pricing</FormLabel>
                            <RadioGroup
                              {...field}
                              row
                              aria-labelledby="form-pricing"
                              defaultValue="DISABLE_PAYMENTS"
                            >
                              <FormControlLabel
                                value="FREE"
                                control={<Radio disabled />}
                                label="$0 or donate"
                              />
                              <FormControlLabel
                                value="PAID"
                                control={<Radio disabled />}
                                label="Paid"
                              />
                              <FormControlLabel
                                value="DISABLE_PAYMENTS"
                                control={<Radio />}
                                label="No payments"
                              />
                            </RadioGroup>
                            <FormHelperText>
                              {formErrors?.paymentMode?.message}
                            </FormHelperText>
                          </FormControl>
                        )}
                      />
                    </div>

                    {/* <div className="mode_free">
                      <p className={styles.sub}>
                        Someone downloading your project will be asked for a
                        donation before getting access. They can skip to
                        download for free.
                      </p>
                      <div className="price_inputs">
                        <div className="suggested_price">
                          <FormControl fullWidth>
                            <TextField
                              id="outlined-basic"
                              label="Suggested donation — Default donation amount"
                              variant="outlined"
                              placeholder="$2.00"
                            />
                          </FormControl>
                        </div>
                      </div>
                    </div> */}

                    <p className={styles.sub}>
                      {
                        "The project's files will be freely available and no donations can be made"
                      }
                    </p>
                  </div>

                  <div className={styles.upload_editor}>
                    <FormControl fullWidth error={Boolean(formErrors.gameName)}>
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
                      <FormHelperText>
                        {formErrors?.gameName?.message}
                      </FormHelperText>
                    </FormControl>
                  </div>

                  <div
                    className={`${styles.input_row} when_java game_classpath`}
                  >
                    <h2>Details</h2>
                  </div>
                  <div className={`${styles.input_row}`}>
                    <div className={styles.label} style={{ marginBottom: 10 }}>
                      Description
                      <span className={styles.sub}>
                        {' '}
                        — This will make up the content of your game page.
                      </span>
                    </div>
                    <Editor setRef={setEditorRef} />
                  </div>

                  <div className="tags_drop">
                    <div className="game_edit_game_tags_widget">
                      <div className={`${styles.input_row}`}>
                        <Controller
                          control={control}
                          name="genre"
                          render={({ field }) => (
                            <FormControl
                              fullWidth
                              error={Boolean(formErrors.genre)}
                            >
                              <FormLabel id="form-genre">Genre</FormLabel>
                              <p className={styles.sub}>
                                Select the category that best describes your
                                game. You can pick additional genres with tags
                                below
                              </p>
                              <Select id="form-genre" {...field}>
                                {genres.map((genre) => (
                                  <MenuItem
                                    value={genre.value}
                                    key={genre.value}
                                  >
                                    {genre.label}
                                  </MenuItem>
                                ))}
                              </Select>
                              <FormHelperText>
                                {formErrors?.genre?.message}
                              </FormHelperText>
                            </FormControl>
                          )}
                        />
                      </div>
                      <div className={`${styles.input_row} tags_input_row`}>
                        <FormTags
                          control={control}
                          errors={formErrors}
                          changeTags={(tags) => {
                            setValue('tags', tags)
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="links_drop">
                    <div className="links_editor">
                      <div
                        className={`${styles.input_row} app_store_links_row`}
                      >
                        <FormAppStoreLinks
                          errors={formErrors}
                          control={control}
                          changeLinks={(value) => {
                            setValue('appStoreLinks', value)
                          }}
                        />
                      </div>
                    </div>
                  </div>

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
                    <Controller
                      control={control}
                      name="community"
                      render={({ field }) => (
                        <FormControl
                          error={Boolean(formErrors.community)}
                          fullWidth
                        >
                          <FormLabel id="demo-radio-buttons-group-label">
                            Community
                          </FormLabel>
                          <p className={styles.sub}>
                            Build a community for your project by letting people
                            post to your page.
                          </p>
                          <RadioGroup {...field}>
                            <FormControlLabel
                              value="DISABLED"
                              control={<Radio size="small" />}
                              label="Disabled"
                            />
                            <FormControlLabel
                              value="DISQUS"
                              control={<Radio size="small" />}
                              label="Disqus"
                            ></FormControlLabel>
                          </RadioGroup>
                          <FormHelperText>
                            {formErrors?.community?.message}
                          </FormHelperText>
                        </FormControl>
                      )}
                    />
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
                  <div className="cover_uploader_drop">
                    <div className={styles.game_edit_cover_uploader_widget}>
                      <UploadGameCover
                        setFile={(file) => handleCoverValue(file as File)}
                      />
                      <p className={`${styles.sub} instructions`}>
                        The cover image is used whenever w3itch.io wants to link
                        to your project from another part of the site. Required
                        (Minimum: 315x250, Recommended: 630x500)
                      </p>
                    </div>
                    <FormHelperText error={Boolean(formErrors.cover)}>
                      {formErrors?.cover?.message}
                    </FormHelperText>
                  </div>
                  {/* <section className={styles.video_editor}>
                    <FormControl fullWidth>
                      <FormLabel id="form-cover">
                        Gameplay video or trailer
                      </FormLabel>
                      <p className={styles.sub}>
                        Provide a link to YouTube or Vimeo.
                      </p>
                      <TextField
                        id="form-cover"
                        variant="outlined"
                        aria-describedby="form-cover-error-text"
                        error={!!formErrors.cover}
                        placeholder="eg. https://www.youtube.com/watch?v=5JEaA47sPjQ"
                        helperText={
                          formErrors.cover ? formErrors.cover.message : ''
                        }
                        {...register('cover')}
                      />
                    </FormControl>
                  </section> */}
                  <section className={styles.screenshot_editor}>
                    <div className={styles.label}>Screenshots</div>
                    <p className={styles.sub}>
                      <span className="when_default">
                        {"Screenshots will appear on your game's page."}{' '}
                      </span>
                      Optional but highly recommended. Upload 3 to 5 for best
                      results.
                    </p>
                    <FormHelperText error={Boolean(formErrors?.screenshots)}>
                      {
                        (formErrors?.screenshots as unknown as FieldError)
                          ?.message
                      }
                    </FormHelperText>
                    <UploadGameScreenshots
                      setFiles={(files) => {
                        handleScreenshots(files as File[] | undefined)
                      }}
                    />
                  </section>
                </div>
              </div>
              <div className={styles.buttons}>
                <PrimaryLoadingButton
                  variant="contained"
                  type="submit"
                  loading={submitLoading}
                >
                  Save
                </PrimaryLoadingButton>
                <div className={`${styles.loader} ${styles.form_loader}`}></div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameNew
