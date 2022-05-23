import WifiOffIcon from '@mui/icons-material/WifiOff'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const Offline = () => (
  <Box
    sx={{
      minHeight: '500px',
      textAlign: 'center',
      padding: '50px 0',
    }}
  >
    <WifiOffIcon
      sx={{
        fontSize: '50px',
      }}
    />
    <Typography variant="h5" gutterBottom component="div">
      Not connected to the internet
    </Typography>
    <Typography variant="body1" gutterBottom>
      Your device is offline
    </Typography>
  </Box>
)

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

export default Offline
