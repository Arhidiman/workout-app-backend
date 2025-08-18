import { 
    Injectable, 
    NestMiddleware, 
    UnauthorizedException, 
} from '@nestjs/common'

import axios from 'axios'
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

import type { Request, Response, NextFunction } from 'express'

const authBaseUrl = 'http://localhost:8001'
const validateEndpoint = 'user/validate'

const notValidatedUrls = ['user/sign-in', 'user/sign-up']

const requestForward = async (method, requestUrl, request: Request): Promise<AxiosResponse> => {
    if (method === 'get' || method === 'delete') {
        return await axios[method](requestUrl)
    } else {
        return await axios[method](requestUrl, request.body)
    }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {

    async use(request: Request, originalResponse: Response, next: NextFunction) {

        const authorization = request.headers['authorization']

        const originalUrl = request.originalUrl
        const requestUrl = `${authBaseUrl}${originalUrl}`
        const requestMethod = request.method.toLowerCase()

        const isValidatedUrl = !notValidatedUrls.some(url => originalUrl.includes(url))

        axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
                for (let header in request.headers) {
                    config.headers.set(header, request.headers[header])
                }

                return config;
            }
        )

        if (!isValidatedUrl) {
            const response = await requestForward(requestMethod, requestUrl, request)
            originalResponse.status(response.status).send(response.data)
        } else {
            if (!authorization) {
                throw new UnauthorizedException('Credentials is not defined')
            }

            console.log('before auth', 'url: ', `${authBaseUrl}/${validateEndpoint}`)

            const authResponse = await axios.post(`${authBaseUrl}/${validateEndpoint}`)
            console.log('after auth')

            if (authResponse.status >= 100 && authResponse.status <= 300) {                
                const response = await requestForward(requestMethod, requestUrl, request)
                originalResponse.status(response.status).send(response.data)
            }
        }
    }
}