import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtModule, JwtService } from '@nestjs/jwt';
import axios from 'axios';


const secretKey = 'lololo13135lol'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {

    const requestBody = req.body


    console.log(requestBody, 'request body')

    const authResponse = await axios.post('http://localhost:8001/user/sign-up', requestBody)

    console.log(authResponse.data, 'auth response data')

    res.send(`Auth success! Status code: ${authResponse.status}, data: ${JSON.stringify(authResponse.data)}`)
  }
}