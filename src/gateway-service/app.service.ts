import { Injectable } from '@nestjs/common';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { IncomingHttpHeaders } from 'http';
import type { Request, Response } from 'express';

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
    auth: 'http://localhost:8001',
    core: 'http://localhost:8002',
  }

  async proxy(req: Request, res: Response) {
    return await this.requestForward(req, res)
  } 


  private async requestForward (request: Request, response: Response): Promise<any> {
    const service = this.getServiceName(request.originalUrl)

    console.log(request.originalUrl,service)
    const targetUrl = `${this.origins[service]}${request.originalUrl}`
    const method = request.method.toLowerCase()
    const { headers, body } = request
    const filteredHeaders = this.filterHeaders(headers, this.allowedHeaders)

    console.log(targetUrl, 'target URL')
    console.log(filteredHeaders, 'filteredHeaders')

    if (method === 'get' || method === 'delete') {
        const res = await axios[method](targetUrl, { headers: filteredHeaders })
        return res.data
    } else {
        const axiosResponse = await axios[method](targetUrl, body, { headers: filteredHeaders })

      this.applyHeaders(response, axiosResponse.headers)
      return axiosResponse.data
    }
  }

  private applyHeaders(
    response: Response,
    headers: IncomingHttpHeaders
  ) {
    for (const [key, value] of Object.entries(headers)) {
      if (value !== undefined) {
        response.setHeader(key, value);
      }
    }
  }

  private filterHeaders  (originalHeaders: IncomingHttpHeaders, allowedHeaders: string[]): IncomingHttpHeaders {
    const filteredHeaders = Object.keys(originalHeaders).filter(header => allowedHeaders.includes(header.toLowerCase()))
    return filteredHeaders.reduce((acc, header) => ({ ...acc, [header]: originalHeaders[header] }), {})
  }

  private getServiceName(path: string) {  
    return path.split('/').filter(u => u)[0]
  }
}
