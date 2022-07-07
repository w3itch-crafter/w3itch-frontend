import { CssBaseline } from '@mui/material'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { AuthenticationProvider } from 'components/pages'
import { WalletSupportedChainIds } from 'constants/index'
import { ThemeProvider as NextThemeProvider, useTheme } from 'next-themes'
import { SnackbarProvider } from 'notistack'
import { useEffect, useState } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { ThemeMode } from 'types/enum'
import { UseWalletProvider } from 'use-wallet'
import { getMuiTheme, getRpcUrl } from 'utils'

import store from '../store/store'

export const WalletSupportedRpcUrls = WalletSupportedChainIds.map((chainId) => ({
  [`${chainId}`]: getRpcUrl(chainId),
})).reduce((result, current) => ({ ...result, ...current }), {})

type ProvidersProps = {
  children: React.ReactNode
}

function MuiThemeProviderWrapper({ children }: ProvidersProps) {
  const { resolvedTheme } = useTheme()
  const [activeMuiTheme, setActiveMuiTheme] = useState(getMuiTheme(ThemeMode.Light))

  useEffect(() => {
    setActiveMuiTheme(getMuiTheme(resolvedTheme as ThemeMode))
  }, [resolvedTheme])

  return (
    <MuiThemeProvider theme={activeMuiTheme}>
      <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
        <CssBaseline enableColorScheme />
        {children}
      </SnackbarProvider>
    </MuiThemeProvider>
  )
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ReduxProvider store={store}>
      <UseWalletProvider
        connectors={{
          injected: { chainId: WalletSupportedChainIds },
          walletconnect: {
            rpc: WalletSupportedRpcUrls,
            bridge: 'https://bridge.walletconnect.org',
            pollingInterval: 12000,
          },
        }}
      >
        <AuthenticationProvider>
          <NextThemeProvider>
            <MuiThemeProviderWrapper>{children}</MuiThemeProviderWrapper>
          </NextThemeProvider>
        </AuthenticationProvider>
      </UseWalletProvider>
    </ReduxProvider>
  )
}
