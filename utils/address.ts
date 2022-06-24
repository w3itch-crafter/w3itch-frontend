import { utils } from 'ethers'

// https://github.com/TrueFiEng/useDApp/blob/master/packages/core/src/helpers/address.ts#L53
export function addressEqual(
  firstAddress: string,
  secondAddress: string
): boolean {
  try {
    return utils.getAddress(firstAddress) === utils.getAddress(secondAddress)
  } catch {
    throw new TypeError("Invalid input, address can't be parsed")
  }
}
