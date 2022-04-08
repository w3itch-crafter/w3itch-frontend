import { InputRow } from 'components/forms'
import { AuthenticationContext } from 'components/pages'
import { ethers } from 'ethers'
import { useERC20, useERC20Balance } from 'hooks'
import { Fragment, useContext } from 'react'
import { NextPageWithLayout } from 'types'

import Layout from './_layout'

const ConnectedAccounts: NextPageWithLayout = () => {
  const provider = new ethers.providers.InfuraProvider('rinkeby')
  const dai = useERC20('0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735', provider)
  const {
    state: { account },
  } = useContext(AuthenticationContext)
  const accountId = account?.accountId
  const { balance: daiBalance, decimals: daiDecimals } = useERC20Balance(
    dai,
    accountId
  )
  const daiBalanceValue = ethers.utils.formatUnits(daiBalance, daiDecimals)

  return (
    <Fragment>
      <h2>Connected accounts</h2>
      <InputRow disabled label="Wallet account" value={accountId} />
      <InputRow disabled label="Dai balance" value={daiBalanceValue} />
    </Fragment>
  )
}

ConnectedAccounts.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default ConnectedAccounts
