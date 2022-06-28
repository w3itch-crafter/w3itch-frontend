import styled from '@emotion/styled'
import { RedButton } from 'components/buttons'
import { InputRow } from 'components/forms'
import { PageCard, StatHeader } from 'components/pages'
import { AuthenticationContext } from 'context'
import { useTopRightSnackbar } from 'hooks'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Fragment, useContext, useState } from 'react'
import { authSignup } from 'services'
import { InvalidData, RegisterData } from 'types'
import { isEmptyObj, userHostUrl } from 'utils'

declare interface OAuthProps {
  success?: 'true' | 'false' | string
  code?: '200' | '400' | '401' | string
  method?: 'authorize_callback_signup' | string
  service?: 'GitHub' | string
}

const Container = styled.div`
  max-width: 960px;
  margin: 0 auto;
`
const Padded = styled.div`
  padding: 20px var(--w3itch-gutter_width, 40px);
`
const CardFooter = styled.div`
  border-top: 1px solid #dadada;
  padding: 10px var(--w3itch-gutter_width, 40px);
  color: var(--w3itch-text4);
  a {
    color: inherit;
  }
`
const ErrorTitle = styled.h3`
  margin-top: 0;
`
const ErrorList = styled.ul`
  margin: 0;
`
const FormColumn = styled.div`
  width: 50%;
  box-sizing: border-box;
`

const defaultData: RegisterData = {
  address: '',
  username: '',
  gamer: true,
  developer: false,
}

const OAuth: NextPage<OAuthProps> = ({ success, code, method }: OAuthProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const isOAuthSuccess = success === 'true' && code === '200'
  const isNeedSignup = isOAuthSuccess && method === 'authorize_callback_signup'
  const title = isOAuthSuccess ? t('OAuth Success') : t('OAuth Error')
  const header = isOAuthSuccess
    ? isNeedSignup
      ? t('Create an account on w3itch.io')
      : t('OAuth authentication has been successful')
    : t('OAuth authentication has not been successful')
  const code400 = (
    <Fragment>
      <li>{t('The username already used.')}</li>
    </Fragment>
  )
  const code401 = (
    <Fragment>
      <li>{t('The user canceled the OAuth process.')}</li>
      <li>{t('The user denied the request for OAuth permissions.')}</li>
      <li>{t('The account has not been registered.')}</li>
    </Fragment>
  )
  const [registerData, setRegisterData] = useState<RegisterData>(defaultData)
  const [profileUrl, setProfileUrl] = useState<string>(
    'https://username.w3itch.io/'
  )
  const [invalidData, setInvalidData] = useState<Partial<InvalidData>>({})
  const [hasStarted, setHasStarted] = useState(false)
  const showSnackbar = useTopRightSnackbar()
  const { dispatch } = useContext(AuthenticationContext)
  const handleRegisterData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    setRegisterData({ ...registerData, [name]: value })
    if (name === 'username')
      setProfileUrl(userHostUrl(String(value).toLowerCase()))
    setInvalidData({})
  }
  const checkRegisterData = async () => {
    const invalid: Partial<InvalidData> = {}
    if (!registerData.username) {
      invalid.username = { message: t('Username is required') }
    }
    setInvalidData(invalid)
    return isEmptyObj(invalid)
  }
  const handleRegisterSubmit = async () => {
    const check = await checkRegisterData()
    if (!check) return
    setHasStarted(true)
    try {
      const { user, account } = await authSignup(registerData.username)
      dispatch({ type: 'LOGIN', payload: { user, account: [account] } })
      await router.replace('/games')
    } catch (error) {
      if (error instanceof Error) {
        return showSnackbar(error.message, 'error')
      }
    } finally {
      setHasStarted(false)
    }
  }

  return (
    <Fragment>
      <Head>
        <title>{title} - w3itch.io</title>
      </Head>
      <Container>
        <PageCard>
          <StatHeader title={header} />
          <Padded>
            {!isOAuthSuccess && (
              <Fragment>
                <ErrorTitle>
                  {t('May be due to the following reasons:')}
                </ErrorTitle>
                <ErrorList>
                  {code === '400' && code400}
                  {code === '401' && code401}
                </ErrorList>
              </Fragment>
            )}
            {isNeedSignup && (
              <FormColumn>
                <InputRow
                  autoFocus
                  required
                  label={t('Username')}
                  name="username"
                  type="text"
                  invalid={invalidData.username}
                  value={registerData.username}
                  onChange={handleRegisterData}
                />
                <InputRow
                  disabled
                  preview
                  center
                  label={t('Your profile page will be')}
                  type="text"
                  placeholder={t('https://username.w3itch.io/')}
                  value={profileUrl}
                />
                <RedButton disabled={hasStarted} onClick={handleRegisterSubmit}>
                  {t('Create account')}
                </RedButton>
              </FormColumn>
            )}
          </Padded>
          <CardFooter>
            You can retry <Link href="/login">{t('Sign In')}</Link>
          </CardFooter>
        </PageCard>
      </Container>
    </Fragment>
  )
}

export const getServerSideProps: GetServerSideProps<OAuthProps> = async (
  context
) => {
  const { success, code, method, service } = context.query as OAuthProps
  const isOAuthSuccess = success === 'true' && code === '200'

  // redirect
  const redirectToGames = () => {
    if (context?.locale !== context?.defaultLocale) {
      context.res.writeHead(302, { Location: `/${context.locale}/games` }).end()
    } else {
      context.res.writeHead(302, { Location: '/games' }).end()
    }
  }
  if (isOAuthSuccess && method !== 'authorize_callback_signup') {
    redirectToGames()
  }

  const pageProps: OAuthProps = { success, code, method, service }

  return {
    props: {
      // locale: i18n?.defaultLocale https://github.com/vercel/next.js/blob/39302141b5ea3a1e9a55af906129a44675337cf9/packages/next/export/index.ts#L375
      ...(await serverSideTranslations(context.locale as string, ['common'])),
      // fix Next.js error: "Reason: `undefined` cannot be serialized as JSON. Please use `null` or omit this value."
      ...JSON.parse(JSON.stringify(pageProps)),
    },
  }
}

export default OAuth
