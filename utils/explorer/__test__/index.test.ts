import { ExplorerDataType, getExplorerLink } from '../index'

declare type ExpectedValue = { [key in ExplorerDataType]: string }

describe('Get explorer link', () => {
  it('Ethereum', () => {
    const expected: ExpectedValue = {
      [ExplorerDataType.ADDRESS]: 'https://etherscan.io/address/0x3dc0f71c448154ff8b2572ec812964ed2a58ed3a',
      [ExplorerDataType.BLOCK]: 'https://etherscan.io/block/14582873',
      [ExplorerDataType.TRANSACTION]:
        'https://etherscan.io/tx/0x20b25868d78a66e459653e439fcab87e9123ee35c58ff70b696bd5e3c0dfc3a3',
      [ExplorerDataType.TOKEN]: 'https://etherscan.io/token/0x3f1b56c64c9fffde6e6e0e93b4149a9ef4362ebc',
    }
    const address = getExplorerLink(1, '0x3Dc0F71C448154Ff8B2572Ec812964eD2A58Ed3A', ExplorerDataType.ADDRESS)
    const block = getExplorerLink(1, '14582873', ExplorerDataType.BLOCK)
    const transaction = getExplorerLink(
      1,
      '0x20b25868d78a66e459653e439fcab87e9123ee35c58ff70b696bd5e3c0dfc3a3',
      ExplorerDataType.TRANSACTION
    )
    const token = getExplorerLink(1, '0x3F1b56C64c9FFFdE6e6e0e93B4149a9EF4362eBc', ExplorerDataType.TOKEN)

    expect(address).toBe(expected.address)
    expect(block).toBe(expected.block)
    expect(transaction).toBe(expected.transaction)
    expect(token).toBe(expected.token)
  })

  it('Ethereum Rinkeby', () => {
    const expected: ExpectedValue = {
      [ExplorerDataType.ADDRESS]: 'https://rinkeby.etherscan.io/address/0x580541722d4ff64328ff46a2cc3b3756c93cd11e',
      [ExplorerDataType.BLOCK]: 'https://rinkeby.etherscan.io/block/10502322',
      [ExplorerDataType.TRANSACTION]:
        'https://rinkeby.etherscan.io/tx/0xb3766fb066215fe165879f447596e576028588c3cb95b68d326aadde6a2c82c9',
      [ExplorerDataType.TOKEN]: 'https://rinkeby.etherscan.io/token/0xa1016e7fc56be94d087dd7e4d9f8365a331cef45',
    }
    const address = getExplorerLink(4, '0x580541722d4fF64328FF46a2cC3b3756C93cd11E', ExplorerDataType.ADDRESS)
    const block = getExplorerLink(4, '10502322', ExplorerDataType.BLOCK)
    const transaction = getExplorerLink(
      4,
      '0xb3766fb066215fe165879f447596e576028588c3cb95b68d326aadde6a2c82c9',
      ExplorerDataType.TRANSACTION
    )
    const token = getExplorerLink(4, '0xA1016e7Fc56bE94d087DD7E4D9f8365a331CeF45', ExplorerDataType.TOKEN)

    expect(address).toBe(expected.address)
    expect(block).toBe(expected.block)
    expect(transaction).toBe(expected.transaction)
    expect(token).toBe(expected.token)
  })

  it('Biance Mainnet', () => {
    const expected: ExpectedValue = {
      [ExplorerDataType.ADDRESS]: 'https://bscscan.com/address/0xdc0187399f9913e12115649156faa71d2cc4953f',
      [ExplorerDataType.BLOCK]: 'https://bscscan.com/block/16936603',
      [ExplorerDataType.TRANSACTION]:
        'https://bscscan.com/tx/0x13fb7a8cc1b94f573bc9f1fe7d471042e83006fc30362f23d0b246d7aed39de9',
      [ExplorerDataType.TOKEN]: 'https://bscscan.com/token/0x2d18298d0e3f1a059cbe0ec50a8a2e6e582a1e7b',
    }
    const address = getExplorerLink(56, '0xDC0187399F9913E12115649156faA71D2Cc4953F', ExplorerDataType.ADDRESS)
    const block = getExplorerLink(56, '16936603', ExplorerDataType.BLOCK)
    const transaction = getExplorerLink(
      56,
      '0x13fb7a8cc1b94f573bc9f1fe7d471042e83006fc30362f23d0b246d7aed39de9',
      ExplorerDataType.TRANSACTION
    )
    const token = getExplorerLink(56, '0x2D18298d0e3f1A059CBE0EC50a8A2E6e582A1e7B', ExplorerDataType.TOKEN)

    expect(address).toBe(expected.address)
    expect(block).toBe(expected.block)
    expect(transaction).toBe(expected.transaction)
    expect(token).toBe(expected.token)
  })
})
