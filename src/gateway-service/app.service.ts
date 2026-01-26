import { Injectable } from '@nestjs/common';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { IncomingHttpHeaders } from 'http';
import type { Request } from 'express';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  private allowedHeaders = [
    'content-type',
    'authorization',
    'cookie'
  ]

  private origins = {
    auth: 'http://localhost/8001',
    core: 'http://localhost/8002',
  }

  async proxyAuth(req: Request) {
    return await this.requestForward(req)
  } 

  async proxyMain(req: Request) {
    return await this.requestForward(req)
  } 

  private async requestForward (request: Request): Promise<AxiosResponse> {
    const url = new URL(request.originalUrl)
    const service = this.getServiceName(url.pathname)
    const targetUrl = `${this.origins[service]}/${request.originalUrl}`
    const method = request.method.toLowerCase()
    const { headers, body } = request
    const filteredHeaders = this.filterHeaders(headers, this.allowedHeaders)

    if (method === 'get' || method === 'delete') {
        return await axios[method](targetUrl, { headers: filteredHeaders })
    } else {
        return await axios[method](targetUrl, body, { headers: filteredHeaders })
    }
  }

  private filterHeaders  (originalHeaders: IncomingHttpHeaders, allowedHeaders: string[]): IncomingHttpHeaders {
    const filteredHeaders = Object.keys(originalHeaders).filter(header => allowedHeaders.includes(header.toLowerCase()))
    return filteredHeaders.reduce((acc, header) => ({ ...acc, [header]: originalHeaders[header] }), {})
  }

  private getServiceName(path: string) {  
    return path.split('/').map(u => u)[0]
  }
}
