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


const authBaseUrl = 'http://localhost:8001'
const validateEndpoint = 'user/validate'

const notValidatedUrls = ['user/sign-in', 'user/sign-up']

const allowedHeaders = [
    'content-type',
    'authorization',
    'cookie'
]

const filterHeaders = (originalHeaders: IncomingHttpHeaders, allowedHeaders: string[]) => {
    const filteredHeaders = Object.keys(originalHeaders).filter(header => allowedHeaders.includes(header.toLowerCase()))
    return filteredHeaders.reduce((acc, header) => ({ ...acc, [header]: originalHeaders[header] }), {})
}

const requestForward = async (method, requestUrl, request: Request): Promise<AxiosResponse> => {
    const { headers, body } = request

    const filteredHeaders = filterHeaders(headers, allowedHeaders)


    console.log(filteredHeaders, 'filterHeaders')
    if (method === 'get' || method === 'delete') {
        return await axios[method](requestUrl, { headers: filteredHeaders })
    } else {
        console.log(request.body, 'req body')
        return await axios[method](requestUrl, body, { headers: filteredHeaders })
    }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {

    async use(request: Request, originalResponse: Response, next: NextFunction) {

        let authorization

        try {
            authorization = request.headers['authorization']

            const originalUrl = request.originalUrl
            const requestUrl = `${authBaseUrl}${originalUrl}`
            const requestMethod = request.method.toLowerCase()
    
            const mustValidate = !notValidatedUrls.some(url => originalUrl.includes(url))
    
            if (!mustValidate) {
                const response = await requestForward(requestMethod, requestUrl, request)
                originalResponse.status(response.status).send(response.data)
            } else {
                if (!authorization) {
                    throw new UnauthorizedException('Credentials is not defined')
                }
                try {
                    const authResponse = await axios.post(`${authBaseUrl}/${validateEndpoint}`, {}, { headers: { authorization }})    

                    if (authResponse.status >= 100 && authResponse.status <= 300) {                
                        const response = await requestForward(requestMethod, requestUrl, request)
                        originalResponse.status(response.status).send(response.data)
                    }
                } catch(err) {
                    if (axios.isAxiosError(err)) {
                        originalResponse.status(err.status || 500).send(err.response?.data)
                    } else {
                        throw new InternalServerErrorException(`${err.message}`)
                    }
                }
            }
        } catch(err) {
            throw new InternalServerErrorException(`Something wrong. ${err.message}`)
        }
    }
}