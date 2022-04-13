import axios, { AxiosResponse } from 'axios'
import { BackendErrorResponse } from 'types'
import { BackendError } from 'utils'

const backend = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

backend.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  function (error) {
    const res: AxiosResponse<BackendErrorResponse> = error.response
    return Promise.reject(new BackendError(res.data, { cause: error }))
  }
)

export default backend
