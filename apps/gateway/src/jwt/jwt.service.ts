import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class JwtTokenService {
  constructor(private jwtService: JwtService) {}

  compare(token: string) {
    const decode = this.jwtService.decode(token)
    return decode
  }

  async verify(token: string) {
    try {
      const verify = await this.jwtService.verifyAsync(token)
      return verify
    } catch (err) {
      return null
    }
  }

  async sign(userId: number, expiredIn: string): Promise<string> {
    return await this.jwtService.signAsync(
      { userId: userId },
      { expiresIn: expiredIn },
    )
  }
}
