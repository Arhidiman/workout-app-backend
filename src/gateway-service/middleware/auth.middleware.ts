import { 
    Injectable, 
    InternalServerErrorException, 
    NestMiddleware, 
    UnauthorizedException, 
} from '@nestjs/common'

import axios from 'axios'

import type { IncomingHttpHeaders } from 'http'
import type { AxiosResponse } from 'axios'
import type { Request, Response, NextFunction } from 'express'

type AuthResponse = {
    access_token: string,
    refresh_token: string
}

const authBaseUrl = 'http://localhost:8001'
const validateEndpoint = 'user/validate'

const notValidatedUrls = ['user/sign-in', 'user/sign-up']
const authUrls = ['user/sign-in', 'user/sign-up']

const allowedHeaders = [
    'content-type',
    'authorization',
    'cookie'
]

const requiredAuthHeaders = ['set-cookie', 'authorization']


const filterHeaders = (originalHeaders: IncomingHttpHeaders, allowedHeaders: string[]) => {
    const filteredHeaders = Object.keys(originalHeaders).filter(header => allowedHeaders.includes(header.toLowerCase()))
    return filteredHeaders.reduce((acc, header) => ({ ...acc, [header]: originalHeaders[header] }), {})
}

const requestForward = async (method, requestUrl, request: Request): Promise<AxiosResponse> => {
    const { headers, body } = request

    const filteredHeaders = filterHeaders(headers, allowedHeaders)

    if (method === 'get' || method === 'delete') {
        return await axios[method](requestUrl, { headers: filteredHeaders })
    } else {
        return await axios[method](requestUrl, body, { headers: filteredHeaders })
    }
}

const isUrlExcluded = (url: string) => notValidatedUrls.some(u => url.includes(u))

const isAuthUrl = (url: string) => authUrls.some(u => url.includes(u))

const validateAuthorization = async (authHeader: string | undefined) => {
    if (!authHeader) throw new UnauthorizedException('Credentials not defined')
    const response = await axios.post(`${authBaseUrl}/${validateEndpoint}`, {}, { headers: { authorization: authHeader } })

    if (response.status < 200 || response.status >= 300) throw new UnauthorizedException('Token not valid')
    return true
}

const applyHeaders = (forwardResponse: AxiosResponse, originalResponse: Response) => {
    for (let header in forwardResponse.headers) {
        const value = forwardResponse.headers[header]

        value && originalResponse.setHeader(header, value)
    }

    return originalResponse
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    async use(request: Request, originalResponse: Response) {
        try {            
            const originalUrl = request.originalUrl
            const requestUrl = `${authBaseUrl}${originalUrl}`
            const requestMethod = request.method.toLowerCase()
    
            if (!isUrlExcluded(originalUrl)) { await validateAuthorization(request.headers['authorization']) }   

            const response = await requestForward(requestMethod, requestUrl, request)

            applyHeaders(response, originalResponse).status(response.status).send(response.data)

            return
        } catch(err) {
            if (axios.isAxiosError(err)) {
                console.log(err.response?.data, 'res dsata')
                originalResponse.status(err.status || 500).send(err.response?.data)
                return
            } 

            console.log(err)
            throw new InternalServerErrorException(err.message)
        }
    }
}