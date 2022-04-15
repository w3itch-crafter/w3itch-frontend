import { gameProjectByID } from 'api'
import GameForm from 'components/Game/Form'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { MutableRefObject, useCallback, useEffect, useState } from 'react'
import { DefaultValues, useForm } from 'react-hook-form'
import {
  Community,
  EditorMode,
  GameFileCharset,
  Genre,
  PaymentMode,
} from 'types/enum'
import { Game } from 'utils/validator'
const resolverGame = classValidatorResolver(Game)
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { Editor } from '@toast-ui/react-editor'
import { GameEntity } from 'types'

const GameEdit: NextPage = () => {
  const router = useRouter()
  const id = router.query.id
  const [gameProject, setGameProject] = useState<GameEntity>({} as GameEntity)
  const [editorRef, setEditorRef] = useState<MutableRefObject<Editor>>()

  const [defaultValue] = useState<DefaultValues<Game>>({
    paymentMode: PaymentMode.DISABLE_PAYMENTS,
    community: Community.DISABLED,
    genre: Genre.ROLE_PLAYING,
    charset: GameFileCharset.UTF8,
    tags: [],
    appStoreLinks: [],
    screenshots: [],
    cover: '',
  })
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState,
    getValues,
  } = useForm<Game>({
    resolver: resolverGame,
    defaultValues: defaultValue,
  })
  const fetchGameProjectFn = useCallback(
    async (id: number) => {
      const gameProjectResult = await gameProjectByID(id)
      if (gameProjectResult.status === 200) {
        console.log('gameProjectResult', gameProjectResult.data)
        setGameProject(gameProjectResult.data)

        setValue('title', gameProjectResult.data.title)
        setValue('subtitle', gameProjectResult.data.subtitle)
        setValue('community', gameProjectResult.data.community)
        setValue('genre', gameProjectResult.data.genre)
        setValue('paymentMode', gameProjectResult.data.paymentMode)
        setValue('description', gameProjectResult.data.description)
        setValue('gameName', gameProjectResult.data.gameName)
        setValue('cover', gameProjectResult.data.cover)
        setValue('charset', gameProjectResult.data.charset)

        setTimeout(() => {
          if (editorRef?.current) {
            editorRef?.current
              .getInstance()
              .setMarkdown(gameProjectResult.data.description)
          }
        }, 3000)
      }
    },
    [setValue, editorRef]
  )

  useEffect(() => {
    if (id) {
      console.log('id', id)
      fetchGameProjectFn(Number(id))
    }
  }, [id, fetchGameProjectFn])

  return (
    <GameForm
      gameProject={gameProject}
      editorMode={EditorMode.EDIT}
      register={register}
      handleSubmit={handleSubmit}
      setValue={setValue}
      control={control}
      watch={watch}
      formState={formState}
      getValues={getValues}
      editorRef={editorRef}
      setEditorRef={setEditorRef}
    ></GameForm>
  )
}

export default GameEdit
