import styled from '@emotion/styled'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useCookieState } from 'ahooks'
import Link from 'next/link'

const COOKIE_KEY_COOKIE_CONSENT = 'W3ITCH_COOKIE_CONSENT'

const Wrapper = styled.div`
  max-width: 420px;
  background-color: var(--w3itch-bg6);
  color: var(--w3itch-text6);
  position: fixed;
  right: 8px;
  bottom: 8px;
  left: 8px;
  padding: 24px;
  border-radius: 8px;
  z-index: 99;
  a {
    color: inherit;
  }
`

const CookieConsent = () => {
  const [accept, setAccept] = useCookieState(COOKIE_KEY_COOKIE_CONSENT, {
    defaultValue: 'false',
    // One year
    expires: (() => new Date(+new Date() + 3600 * 1000 * 24 * 365))(),
  })

  return (
    <>
      {accept === 'false' && (
        <Wrapper>
          <Typography variant="h6" gutterBottom>
            Your privacy
          </Typography>
          <Typography variant="body2" gutterBottom>
            By clicking “Accept all cookies”, you agree Stack Exchange can store
            cookies on your device and disclose information in accordance with
            our &nbsp;<Link href="/comment-policy">Cookie Policy</Link>.
          </Typography>
          <Button
            size="small"
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => setAccept('true')}
          >
            Accept all cookies
          </Button>
        </Wrapper>
      )}
    </>
  )
}

export default CookieConsent
