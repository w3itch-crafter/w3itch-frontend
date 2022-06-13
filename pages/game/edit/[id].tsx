import { gameProjectByID } from 'api'
import GameForm from 'components/Game/Form'
import { useSetFormCache } from 'hooks'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import {
  Dispatch,
  FC,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { DefaultValues, useForm } from 'react-hook-form'
import {
  FormProvider as GameFormProvider,
  useFormContext,
} from 'react-hook-form'
import {
  Community,
  EditorMode,
  GameEngine,
  GameFileCharset,
  Genre,
  PaymentMode,
} from 'types/enum'
import { Game } from 'utils/validator'
const resolverGame = classValidatorResolver(Game)
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { Editor } from '@toast-ui/react-editor'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GameEntity } from 'types'
import { getFormDataCache } from 'utils'

interface GameContentProps {
  children: React.ReactNode
  setGameProject: Dispatch<SetStateAction<GameEntity>>
  setDescription: Dispatch<SetStateAction<string>>
}

const GameContent: FC<GameContentProps> = ({
  children,
  setGameProject,
  setDescription,
}) => {
  const router = useRouter()
  const id = router.query.id as string
  const { setFlag } = useSetFormCache(id)
  const { setValue } = useFormContext<Game>()

  // Fetch game project
  const fetchGameProjectFn = useCallback(
    async (id: number) => {
      setFlag(false)

      try {
        const cacheValue = getFormDataCache(id)
        const gameProjectResult = await gameProjectByID(id)
        if (gameProjectResult.status === 200) {
          setGameProject(gameProjectResult.data)

          setValue('title', cacheValue?.title || gameProjectResult.data.title)
          setValue(
            'subtitle',
            cacheValue?.subtitle || gameProjectResult.data.subtitle
          )
          setValue(
            'community',
            cacheValue?.community || gameProjectResult.data.community
          )
          setValue('genre', cacheValue?.genre || gameProjectResult.data.genre)
          setValue(
            'paymentMode',
            cacheValue?.paymentMode || gameProjectResult.data.paymentMode
          )
          setValue(
            'description',
            cacheValue?.description || gameProjectResult.data.description
          )
          setValue(
            'gameName',
            cacheValue?.title || gameProjectResult.data.gameName
          )
          setValue('cover', gameProjectResult.data.cover)
          setValue(
            'charset',
            cacheValue?.charset || gameProjectResult.data.charset
          )
          setValue('screenshots', gameProjectResult.data.screenshots)
          setValue(
            'appStoreLinks',
            cacheValue?.appStoreLinks || gameProjectResult.data.appStoreLinks
          )
          setValue('kind', cacheValue?.kind || gameProjectResult.data.kind)

          // Tags are handled individually
          setValue(
            'tags',
            cacheValue?.tags || gameProjectResult.data.tags?.map((i) => i.name)
          )

          // Handle description
          setDescription(
            cacheValue?.description || gameProjectResult.data.description
          )
        }
      } catch (e) {
        console.log(e)
      }
    },
    [setGameProject, setValue, setFlag, setDescription]
  )

  useEffect(() => {
    if (id) {
      fetchGameProjectFn(Number(id))
    }
  }, [id, fetchGameProjectFn])

  return <>{children}</>
}

const GameEdit: NextPage = () => {
  // Game project data
  const [gameProject, setGameProject] = useState<GameEntity>({} as GameEntity)
  // Save editor ref
  const [editorRef, setEditorRef] = useState<MutableRefObject<Editor>>()
  // Save cache description
  const [description, setDescription] = useState<string>('')

  const [defaultValue] = useState<DefaultValues<Game>>({
    paymentMode: PaymentMode.DISABLE_PAYMENTS,
    community: Community.DISABLED,
    genre: Genre.ROLE_PLAYING,
    kind: GameEngine.RM2K3E,
    charset: GameFileCharset.UTF8,
    tags: [],
    appStoreLinks: [],
    screenshots: [],
    cover: '',
  })

  const methods = useForm<Game>({
    resolver: resolverGame,
    defaultValues: defaultValue,
  })

  useEffect(() => {
    if (editorRef?.current) {
      editorRef?.current.getInstance().setMarkdown(description || '')
    }
  }, [editorRef, description])

  return (
    <GameFormProvider {...methods}>
      <GameContent
        setGameProject={setGameProject}
        setDescription={setDescription}
      >
        <GameForm
          gameProject={gameProject}
          editorMode={EditorMode.EDIT}
          editorRef={editorRef}
          setEditorRef={setEditorRef}
        />
      </GameContent>
    </GameFormProvider>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale as string, ['common'])),
    },
  }
}

export default GameEdit
