import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

@Injectable()
export class SupabaseJwtGuard implements CanActivate {
  constructor(private cfg: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const token = (req.headers['authorization'] || '').replace('Bearer ', '')
    if (!token) return false

    const client = jwksClient({ jwksUri: this.cfg.get<string>('SUPABASE_JWKS_URL')! })

    const getKey: jwt.GetPublicKeyOrSecret = (header, callback) => {
      client.getSigningKey(header.kid, (err, key) => {
        const signingKey = key?.getPublicKey()
        callback(err, signingKey as string)
      })
    }

    try {
      req.user = await new Promise((resolve, reject) => {
        jwt.verify(
          token,
          getKey,
          {
            audience: this.cfg.get<string>('SUPABASE_JWT_AUD'),
            algorithms: ['RS256', 'HS256'],
          },
          (err, decoded) => {
            if (err) reject(err)
            else resolve(decoded)
          }
        )
      })
      return true
    } catch (e) {
      return false
    }
  }
} 