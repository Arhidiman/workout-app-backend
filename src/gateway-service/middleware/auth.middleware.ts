import { Injectable, NestMiddleware, Headers } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtModule, JwtService } from '@nestjs/jwt';
import axios from 'axios';


const secretKey = 'lololo13135lol'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(@Headers() req: Request, res: Response, next: NextFunction) {

    const cookie = req.headers['cookie']

    if (!cookie) {
      res.status(401).send({ code: 401, message: 'Unauthorized' })
      return
    }

    const authResponse = await axios.get('http://localhost:8001/user/validate', { headers: { cookie }})

    if (authResponse.statusText.toLowerCase().includes('ok')) next()
  }
}