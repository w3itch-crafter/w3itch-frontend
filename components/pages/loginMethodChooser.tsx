import styled from '@emotion/styled'
import { EthereumIcon, GitHubIcon } from 'components/icons'
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
  const ChooseButton = styled.button<{ color: string }>`
    user-select: none;
    box-sizing: border-box;
    text-decoration: none;
    cursor: pointer;
    display: inline-flex;
    gap: 10px;
    border-radius: 3px;
    border: 1px solid;
    border-color: ${(p) => p.color};
    background-color: #fff;
    color: ${(p) => p.color};
    align-items: center;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    padding: 16px 30px;
    &:hover {
      background-color: ${(p) => p.color};
      color: #fff;
    }
  `
  const GitHubChooseButton = styled(ChooseButton)`
    svg {
      border-radius: 100%;
      background-color: #fff;
    }
  `
  const method = methodType === 'login' ? 'Sign in' : 'Sign up'

  return (
    <Container>
      <ChooseButton color="#716b94" onClick={() => onChoose('metamask')}>
        <EthereumIcon size={32} />
        <span>{method} with Ethereum wallets</span>
      </ChooseButton>
      <GitHubChooseButton color="#161614" onClick={() => onChoose('github')}>
        <GitHubIcon size={32} />
        <span>{method} with GitHub account</span>
      </GitHubChooseButton>
    </Container>
  )
}
