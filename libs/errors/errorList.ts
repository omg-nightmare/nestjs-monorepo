import { HttpStatus } from '@nestjs/common'
import { errorName } from './errorCode'

export interface errorCode {
  status: number
  code: string
  description: string
}

export const eCodeList: errorCode[] = [
  {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    code: errorName['e1005000'],
    description: 'internal server error',
  },
  {
    status: HttpStatus.BAD_REQUEST,
    code: errorName['e1005001'],
    description: 'bad request',
  },
  {
    status: HttpStatus.UNAUTHORIZED,
    code: errorName['e1005002'],
    description: 'unauthorize',
  },
  {
    status: HttpStatus.UNAUTHORIZED,
    code: errorName['e1005003'],
    description: 'invalid token',
  },
]
