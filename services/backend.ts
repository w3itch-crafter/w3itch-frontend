/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import assert from 'assert'
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import { BackendErrorResponse, UserEntity } from 'types'
import { BackendError } from 'utils'

class Request {
  public readonly client: AxiosInstance
  private isRetryRequest: boolean

  constructor(private readonly baseURL: string) {
    assert(baseURL, 'baseURL is required.')
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    })
    this.isRetryRequest = false
    this.client.interceptors.response.use(
      this.onResponseFulfilled.bind(this),
      this.onResponseRejected.bind(this)
    )
  }

  private async refreshToken(): Promise<AxiosResponse<UserEntity>> {
    return this.client.patch<UserEntity>('/accounts/tokens')
  }

  private onResponseFulfilled(response: AxiosResponse): AxiosResponse {
    return response
  }

  private async onResponseRejected(
    error: AxiosError<BackendErrorResponse>
  ): Promise<AxiosResponse> {
    const { response } = error
    if (!response) {
      throw error
    }
    if (response?.status === 401 && !this.isRetryRequest) {
      this.isRetryRequest = true
      return this.refreshToken().then(() => {
        this.isRetryRequest = false
        return this.client(response.config)
      })
    }
    return Promise.reject(new BackendError(response?.data!, { cause: error }))
  }
}

const { NEXT_PUBLIC_API_URL } = process.env

const request = new Request(NEXT_PUBLIC_API_URL!)

const backend = request.client

export default backend
