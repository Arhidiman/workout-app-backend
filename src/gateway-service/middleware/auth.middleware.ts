import { Injectable, NestMiddleware, Headers } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';

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
    async use(@Headers() request: Request, originalResponse: Response, next: NextFunction) {

        console.log('request pass through middleware')

        const cookie = request.headers['cookie']
        const originalUrl = request.originalUrl
        const requestUrl = `${authBaseUrl}${originalUrl}`
        const requestMethod = request.method.toLowerCase()

        const isValidatedUrl = !notValidatedUrls.some(url => originalUrl.includes(url))

        if (!isValidatedUrl) {
            const response = await requestForward(requestMethod, requestUrl, request)
            originalResponse.status(response.status).send(response.data)
        } else {
            if (!cookie) {
                originalResponse.status(401).send({ code: 401, message: 'Unauthorized' })
                return
            }
            const authResponse = await axios.get(`${authBaseUrl}/${validateEndpoint}`, { headers: { cookie } })
            if (authResponse.statusText.toLowerCase().includes('ok')) {
                const response = await requestForward(requestMethod, requestUrl, request)
                originalResponse.status(response.status).send(response.data)
            }
        }
    }
}