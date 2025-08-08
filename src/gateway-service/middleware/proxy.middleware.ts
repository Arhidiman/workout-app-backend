import { Injectable, NestMiddleware } from '@nestjs/common'
import { createProxyMiddleware } from 'http-proxy-middleware';

import type { Request, Response, NextFunction } from 'express'

const authBaseUrl = 'http://localhost:8001'

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
    private readonly proxy = createProxyMiddleware({
        target: authBaseUrl,
        changeOrigin: true,
        selfHandleResponse: false, // Ключевая опция!
        // on: {
        //     proxyReq: (proxyReq, req: Request, res: Response) => {
        //         console.log('[Proxy] Request to:', req.url);
        //         // Модификация заголовков при необходимости
        //         proxyReq.setHeader('X-Forwarded-By', 'NestJS-Proxy');
        //     },
        //     proxyRes: (proxyRes, req: Request, res: Response) => {
        //         console.log('[Proxy] Response status:', proxyRes.statusCode);
        //         // Модификация ответа при необходимости
        //         // res.setHeader('X-Processed-By', 'NestJS-Proxy');
        //     },
        //     error: (err: Error, req: Request, res: Response) => {
        //         console.error('[Proxy] Error:', err.message);
        //         if (!res.headersSent) {
        //         res.status(502).json({ 
        //             error: 'Proxy Error',
        //             message: err.message 
        //         });
        //         }
        //     }
        // }
    });


    use(request: Request, originalResponse: Response, next: NextFunction) {
        console.log('proxy')
        this.proxy(request, originalResponse, next)
    }
}