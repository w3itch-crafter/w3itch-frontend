import {
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { MutableRefObject, useState } from 'react'
import stylesCommon from 'styles/common.module.scss'
import styles from 'styles/game/new.module.scss'
const Editor = dynamic(() => import('components/Editor/index'), { ssr: false })
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import {
  classifications,
  genres,
  kindOfProjects,
  releaseStatus,
  tags,
} from 'data'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Game } from 'utils/validator'
const resolverGame = classValidatorResolver(Game)
import { Editor as ToastUiEditor } from '@toast-ui/react-editor'
import { createGame } from 'api/index'
import UploadGame from 'components/UploadGame/index'
import {
  Community,
  GameEngine,
  Genre,
  PaymentMode,
  ProjectClassification,
  ReleaseStatus,
} from 'types/enum'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

const GameNew: NextPage = () => {
  const [formTags, setFormTags] = useState<string[]>([])
  const [editorRef, setEditorRef] = useState<MutableRefObject<ToastUiEditor>>()
  const [uploadGameFile, setUploadGameFile] = useState<File>()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors: formErrors },
  } = useForm<Game>({
    resolver: resolverGame,
  })

  // handle create game
  const handleCreateGame = async (game: Game) => {
    let gameName
    if (uploadGameFile) {
      const name = uploadGameFile.name.split('.')[0]
      if (name) {
        gameName = name
      }
    } else {
      alert('upload game file')
      return
    }

    let description = ''
    if (editorRef) {
      description = editorRef.current?.getInstance().getMarkdown()
    }

    const gameData = {
      title: game.title,
      paymentMode: PaymentMode.DISABLE_PAYMENTS,
      subtitle: game.subtitle,
      gameName: gameName,
      file: uploadGameFile.name,
      classification: ProjectClassification.GAMES,
      kind: GameEngine.RM2K3E,
      releaseStatus: ReleaseStatus.RELEASED,
      screenshots: [game.screenshot],
      cover: game.cover,
      tags: formTags,
      appStoreLinks: [game.appStoreLink],
      description: description,
      community: Community.DISQUS,
      genre: Genre.NO_GENRE,
    }
    console.log('file', uploadGameFile)
    console.log('description', description)
    console.log('gameData', gameData)

    const formData = new FormData()
    formData.append('file', uploadGameFile)
    formData.append('game', JSON.stringify(gameData))

    const result = await createGame(formData)
    console.log('result', result)
  }

  const onSubmit: SubmitHandler<Game> = (data) => {
    console.log(data)
    handleCreateGame(data)
  }

  console.log(watch('title'))

  console.log('formErrors', formErrors)

  const handleTagsSelectChange = (
    event: SelectChangeEvent<typeof formTags>
  ) => {
    const {
      target: { value },
    } = event
    setFormTags(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    )
  }

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
          <div className={styles.payment_warning}>
            <strong>{"You don't have payment configured"}</strong> If you set a
            minimum price above 0 no one will be able to download your project.{' '}
            <a target="_blank" href="/user/settings/seller">
              Edit account
            </a>
          </div>

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
                    <a
                      rel="noopener"
                      href="/docs/creators/quality-guidelines"
                      target="_blank"
                    >
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
                        defaultValue={'title 123'}
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
                        defaultValue={'Short description or tagline 123'}
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

                  <div className="price_picker">
                    <div className="payment_modes">
                      <FormControl fullWidth>
                        <FormLabel id="form-pricing">Pricing</FormLabel>
                        <RadioGroup
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
                      </FormControl>
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
                    <h2>Uploads</h2>
                    <div>
                      <section
                        data-label="Tip"
                        className={`${styles.hint} ${styles.butler_tip}`}
                      >
                        <div className="align">
                          Use <strong>butler</strong> to upload game files: it
                          only uploads {"what's"} changed, generates patches for
                          the <a href="/app">itch.io app</a>, and you can
                          automate it. <a href="/docs/butler">Get started!</a>
                        </div>
                      </section>
                      <div
                        className={`add_file_btn_outer ${styles.upload_buttons}`}
                      >
                        {/* <div
                          data-max_size="1073741824"
                          className={`${stylesCommon.button} add_file_btn has_multi_upload`}
                        >
                          Upload file<span className="on_multi_upload">s</span>
                        </div> */}
                        <UploadGame setFiles={setUploadGameFile} />
                        {/* <span className="button_divider">or</span>
                        <span className="dropbox_drop">
                          <a
                            href="#"
                            className=" dropbox-dropin-btn dropbox-dropin-default"
                          >
                            <span className="dropin-btn-status"></span>Choose
                            from Dropbox
                          </a>
                        </span> */}
                        {/* <div className={styles.external_file_buttons}>
                          <a className={styles.external_file_btn} href="#">
                            Add External file
                          </a>
                          <Tooltip title="You provide a link to the file and we'll keep track of how many times it's been downloaded">
                            <IconButton>
                              <HelpIcon />
                            </IconButton>
                          </Tooltip>
                        </div> */}
                      </div>
                    </div>
                    <p className={styles.upload_limit}>
                      File size limit: 1 GB.{' '}
                      <a target="_blank" href="/support">
                        Contact us
                      </a>{' '}
                      if you need more space
                    </p>
                  </div>

                  <div
                    className={`${styles.input_row} when_java game_classpath`}
                  >
                    <h2>Details</h2>
                  </div>
                  <div className={`${styles.input_row}`}>
                    <div className={styles.label}>
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
                        <FormControl fullWidth>
                          <FormLabel id="form-genre">Genre</FormLabel>
                          <p className={styles.sub}>
                            Select the category that best describes your game.
                            You can pick additional genres with tags below
                          </p>
                          <Select id="form-genre" value={genres[0]}>
                            {genres.map((genre) => (
                              <MenuItem value={genre} key={genre}>
                                {genre}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                      <div className={`${styles.input_row} tags_input_row`}>
                        <FormControl fullWidth>
                          <FormLabel id="form-tags">
                            Tags
                            <span className={styles.tags_sub}>
                              —{' '}
                              <a
                                href="/docs/creators/quality-guidelines#tags"
                                target="blank"
                              >
                                Tips for choosing tags
                              </a>
                            </span>
                          </FormLabel>
                          <p className={styles.tags_description_sub}>
                            Any other keywords someone might search to find your
                            game. Max of 10.
                          </p>
                          <p className={styles.tags_description_sub}>
                            Avoid duplicating any platforms provided on files
                            above.
                          </p>
                          <Select
                            id="form-tags"
                            multiple
                            value={formTags}
                            onChange={handleTagsSelectChange}
                            input={<OutlinedInput />}
                            renderValue={(selected: string[]) => (
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: 0.5,
                                }}
                              >
                                {selected.map((value) => (
                                  <Chip key={value} label={value} />
                                ))}
                              </Box>
                            )}
                            MenuProps={MenuProps}
                          >
                            {tags.map((name) => (
                              <MenuItem key={name} value={name}>
                                {name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                  </div>

                  <div className="links_drop">
                    <div className="links_editor">
                      <div
                        className={`${styles.input_row} app_store_links_row`}
                      >
                        <FormControl fullWidth>
                          <FormLabel id="form-appStoreLink">
                            App store links
                          </FormLabel>
                          <p className={styles.sub}>
                            {
                              "If your project is available on any other stores we'll link to it."
                            }
                          </p>
                          <TextField
                            id="form-appStoreLink"
                            variant="outlined"
                            error={!!formErrors.appStoreLink}
                            placeholder="eg. http(s)://"
                            defaultValue="https://store.steampowered.com/publisher/sekaiproject/sale/publishersale_sekai22"
                            helperText={
                              formErrors.appStoreLink
                                ? formErrors.appStoreLink.message
                                : ''
                            }
                            {...register('appStoreLink')}
                          />
                        </FormControl>
                      </div>
                    </div>
                  </div>

                  <div className={styles.input_row}>
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
                      <TextField id="form-customNoun" placeholder="Optional" />
                    </FormControl>
                  </div>

                  <div className={styles.input_row}>
                    <FormControl>
                      <FormLabel id="demo-radio-buttons-group-label">
                        Community
                      </FormLabel>
                      <p className={styles.sub}>
                        Build a community for your project by letting people
                        post to your page.
                      </p>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="discussionBoard"
                        name="radio-buttons-group"
                      >
                        <FormControlLabel
                          value="comments"
                          control={<Radio size="small" disabled />}
                          label={
                            <span className={styles.radio_label}>
                              Comments
                              <span className={styles.radio_sub}>
                                {' '}
                                — Add a nested comment thread to the bottom of
                                the project page
                              </span>
                            </span>
                          }
                        />
                        <FormControlLabel
                          value="discussionBoard"
                          control={<Radio size="small" />}
                          label={
                            <span className={styles.radio_label}>
                              Discussion board
                              <span className={styles.radio_sub}>
                                {' '}
                                — Add a dedicated community page with
                                categories, threads, replies &amp; more
                              </span>
                            </span>
                          }
                        ></FormControlLabel>
                      </RadioGroup>
                    </FormControl>
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
                      <div className={styles.upload_container}>
                        <div className={styles.file_tools}>
                          <input
                            type="hidden"
                            name="game[cover_image_id]"
                            value=""
                          />
                          <button className={stylesCommon.button} type="button">
                            Upload Cover Image
                          </button>
                        </div>
                      </div>
                      <p className={`${styles.sub} instructions`}>
                        The cover image is used whenever itch.io wants to link
                        to your project from another part of the site. Required
                        (Minimum: 315x250, Recommended: 630x500)
                      </p>
                    </div>
                    <FormControl fullWidth>
                      <FormLabel id="form-cover">Cover</FormLabel>
                      <TextField
                        id="form-cover"
                        variant="outlined"
                        aria-describedby="form-cover-error-text"
                        error={!!formErrors.cover}
                        defaultValue="https://ipfs.fleek.co/ipfs/bafybeiflsgroqy4tjign5nrxj4crtlpwltmxpc6bziki4xkhiojpvllppa"
                        helperText={
                          formErrors.cover ? formErrors.cover.message : ''
                        }
                        {...register('cover')}
                      />
                    </FormControl>
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
                    <div className={styles.screenshot_list}></div>
                    <div className="screenshot_queue"></div>
                    <div>
                      <button
                        data-max_size="3145728"
                        data-accept=".png,.gif,.jpg,.jpeg"
                        type="button"
                        className={`${stylesCommon.button} add_screenshot_btn has_multi_upload`}
                      >
                        Add screenshots
                      </button>
                    </div>
                  </section>

                  <FormControl fullWidth>
                    <FormLabel id="form-screenshot">Screenshot</FormLabel>
                    <TextField
                      id="form-screenshot"
                      variant="outlined"
                      aria-describedby="form-screenshot-error-text"
                      error={!!formErrors.screenshot}
                      defaultValue="https://ipfs.fleek.co/ipfs/bafybeiflsgroqy4tjign5nrxj4crtlpwltmxpc6bziki4xkhiojpvllppa"
                      helperText={
                        formErrors.screenshot
                          ? formErrors.screenshot.message
                          : ''
                      }
                      {...register('screenshot')}
                    />
                  </FormControl>
                </div>
              </div>
              <div className={styles.buttons}>
                <button className={`${stylesCommon.button} save_btn`}>
                  Save &amp; view page
                </button>
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
