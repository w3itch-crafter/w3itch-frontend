import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { Editor } from '@toast-ui/react-editor'
import GameForm from 'components/Game/Form'
import { useSetFormCache } from 'hooks'
import type { NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Dispatch, FC, MutableRefObject, SetStateAction, useCallback, useEffect, useState } from 'react'
import { DefaultValues, useForm, useFormContext } from 'react-hook-form'
import { FormProvider as GameFormProvider } from 'react-hook-form'
import { GameEntity } from 'types'
import { AccessType, Community, EditorMode, GameEngine, GameFileCharset, Genre, PaymentMode } from 'types/enum'
import { getFormDataCache } from 'utils'
import { Game } from 'utils/validator'

const resolverGame = classValidatorResolver(Game)

interface GameContentProps {
  children: React.ReactNode
  setDescription: Dispatch<SetStateAction<string>>
}

const GameContent: FC<GameContentProps> = ({ children, setDescription }) => {
  const { setFlag, setFormNewValues } = useSetFormCache()
  const { setValue } = useFormContext<Game>()

  // Fetch game data from cache
  const fetchGameProjectFn = useCallback(async () => {
    setFlag(false)
    const cacheValue = getFormDataCache()
    if (cacheValue) {
      // Set form new values
      setFormNewValues({
        setValue,
        cacheValue,
      })

      // Handle description
      setDescription(cacheValue?.description)
    }
  }, [setValue, setFlag, setDescription, setFormNewValues])

  useEffect(() => {
    fetchGameProjectFn()
  }, [fetchGameProjectFn])

  return <>{children}</>
}

const GameCreate: NextPage = () => {
  // Save editor ref
  const [editorRef, setEditorRef] = useState<MutableRefObject<Editor>>()
  // Save cache description
  const [description, setDescription] = useState<string>('')

  const [defaultValue] = useState<DefaultValues<Game>>({
    paymentMode: PaymentMode.DISABLE_PAYMENTS,
    community: Community.DISABLED,
    genre: Genre.ROLE_PLAYING,
    kind: GameEngine.DEFAULT,
    charset: GameFileCharset.UTF8,
    tags: [],
    appStoreLinks: [],
    screenshots: [],
    cover: '',
    accessType: AccessType.PUBLIC
  })

  const methods = useForm<Game>({
    resolver: resolverGame,
    defaultValues: defaultValue,
  })

  // Initialize description content
  useEffect(() => {
    if (editorRef?.current) {
      editorRef?.current.getInstance().setMarkdown(description || '')
    }
  }, [editorRef, description])

  return (
    <GameFormProvider {...methods}>
      <GameContent setDescription={setDescription}>
        <GameForm
          gameProject={{} as GameEntity}
          editorMode={EditorMode.CREATE}
          editorRef={editorRef}
          setEditorRef={setEditorRef}
        />
      </GameContent>
    </GameFormProvider>
  )
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

export default GameCreate
