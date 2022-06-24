import styled from '@emotion/styled'
import { LoginChooseButton } from 'components/buttons'
import { DiscordIcon, EthereumIcon, GitHubIcon } from 'components/icons'
import { LoginMethod } from 'types'

export declare interface LoginMethodChooserProps {
  methodType: 'login' | 'register'
  onChoose: (method: LoginMethod) => void
}

export function LoginMethodChooser({
  methodType,
  onChoose,
}: LoginMethodChooserProps) {
  const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
  `
  const method = methodType === 'login' ? 'Sign in' : 'Sign up'

  return (
    <Container>
      <LoginChooseButton
        outline
        color="#716b94"
        onClick={() => onChoose('metamask')}
      >
        <EthereumIcon size={32} />
        <span>{method} with Ethereum wallets</span>
      </LoginChooseButton>
      <LoginChooseButton
        outline
        color="#161614"
        onClick={() => onChoose('github')}
      >
        <GitHubIcon size={32} />
        <span>{method} with GitHub account</span>
      </LoginChooseButton>
      <LoginChooseButton
        outline
        color="#5865F2"
        onClick={() => onChoose('discord')}
      >
        <DiscordIcon size={32} />
        <span>{method} with Discord account</span>
      </LoginChooseButton>
    </Container>
  )
}
