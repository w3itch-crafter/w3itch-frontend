// eslint-disable-next-line @typescript-eslint/no-var-requires
const checkEnv = require('check-env')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { loadEnvConfig } = require('@next/env')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cowsay = require('cowsay')

const projectDir = process.cwd()
loadEnvConfig(projectDir)

try {
  checkEnv([
    'NEXT_PUBLIC_URL',
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_ADDRESS_MINETEST_URL',
    'NEXT_PUBLIC_MINETEST_PORT',
    'NEXT_PUBLIC_CHAIN_ID',
    'NEXT_PUBLIC_INFURA_API_KEY',
  ])
} catch (err) {
  console.error(
    cowsay.say({
      text: err.message,
    })
  )

  process.exit(1)
}
