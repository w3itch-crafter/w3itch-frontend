import { BackendErrorResponse } from 'types'

export class BackendError extends Error {
  public readonly statusCode: number

  public constructor(res: BackendErrorResponse, options?: ErrorOptions) {
    super(res.message, options)
    this.message = res.message
    this.statusCode = res.statusCode
  }
}
