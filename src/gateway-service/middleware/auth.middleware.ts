import { Injectable, NestMiddleware, Headers, Body, Req } from '@nestjs/common'
import axios from 'axios'
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { createProxyMiddleware, Options } from 'http-proxy-middleware';

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


    // constructor() {
    //     // Подписка на ошибки один раз
    //     proxy.on('error', (err, req, res) => {
    //     console.error('Proxy error:', err);
    //         if (!res.headersSent) {
    //             (res as Response).status(500).json({ message: 'Proxy Error' });
    //         }
    //     });

    //     proxy.on('proxyReq', function(proxyReq, req, res, options) {
    //         console.log('proxy requested')
    //         proxyReq.setHeader('X-Special-Proxy-Header', 'foobar');
    //     });

    //     proxy.on('proxyRes', function (proxyRes, req, res) {
    //         console.log('RAW Response from the target', JSON.stringify(proxyRes.header));
    //     });
    
    //     proxy.on('open', function (proxySocket) {
    //         // listen for messages coming FROM the target here
    //         console.log('proxy open')
    //         proxySocket.on('data', console.log('hoohohololho'));
    //     });
    // }


    // private readonly proxy = createProxyMiddleware({
    //     target: authBaseUrl,
    //     changeOrigin: true,
    //     selfHandleResponse: true, // Ключевая опция!
    //     on: {
    //         proxyReq: (proxyReq, req: Request, res: Response) => {
    //             console.log('[Proxy] Request to:', req.url);
    //             // Модификация заголовков при необходимости
    //             proxyReq.setHeader('X-Forwarded-By', 'NestJS-Proxy');
    //         },
    //         proxyRes: (proxyRes, req: Request, res: Response) => {
    //             console.log('[Proxy] Response status:', proxyRes.statusCode);
    //             // Модификация ответа при необходимости
    //             res.setHeader('X-Processed-By', 'NestJS-Proxy');
    //         },
    //         error: (err: Error, req: Request, res: Response) => {
    //             console.error('[Proxy] Error:', err.message);
    //             if (!res.headersSent) {
    //                 res.status(502).json({ 
    //                     error: 'Proxy Error',
    //                     message: err.message 
    //                 });
    //             }
    //         }
    //     }
    // });


    use(request: Request, originalResponse: Response, next: NextFunction) {

        console.log('auth')


        originalResponse.status(200).send('success')


        // this.proxy.web(request, originalResponse, { target: authBaseUrl });
        // this.proxy(request, originalResponse);

        
        // proxy.web(request, originalResponse, { 
        //     target: authBaseUrl, 
        //     changeOrigin: true 
        // })

        // console.log(originalResponse, 'original response')

        // // Ошибки от прокси
        // proxy.on('error', (err) => {
        //     console.error('Proxy error:', err);
        //     if (!originalResponse.headersSent) {
        //         originalResponse.status(500).json({ message: 'Proxy Error' });
        //     }
        // });

        // // Когда прокси завершил работу
        // proxy.on('proxyRes', (proxyRes) => {
        //     proxyRes.on('end', () => {
        //         if (!originalResponse.headersSent) {
        //             originalResponse.end();
        //         }
        //     });
        // });

        // return await originalResponse.send('1')
        

        // const cookie = request.headers['cookie']
        // const authorization = request.headers['authorization']

        // const originalUrl = request.originalUrl
        // const requestUrl = `${authBaseUrl}${originalUrl}`
        // const requestMethod = request.method.toLowerCase()

        // const isValidatedUrl = !notValidatedUrls.some(url => originalUrl.includes(url))

        // axios.interceptors.request.use((request: InternalAxiosRequestConfig) => {
        //         request.headers.set('cookie', cookie)
        //         request.headers.set('authorization', authorization)
        //         return request;
        //     }
        // );

        // if (!isValidatedUrl) {
        //     const response = await requestForward(requestMethod, requestUrl, request)
        //     originalResponse.status(response.status).send(response.data)
        // } else {
        //     if (!authorization) {
        //         originalResponse.status(401).send({ code: 401, message: 'Unauthorized' })
        //         return
        //     }

        //     const authResponse = await axios.post(`${authBaseUrl}/${validateEndpoint}`)
        //     if (authResponse.statusText.toLowerCase().includes('ok')) {
        //         const response = await requestForward(requestMethod, requestUrl, request)
        //         originalResponse.status(response.status).send(response.data)
        //     }
        // }
    }
}