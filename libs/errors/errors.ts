import { ErrCodeException } from '../exception-filter'
import { eCodeList } from './errorList'
import { errorName } from './errorCode'

export const ErrCodeByName = (
  errCode: typeof errorName[keyof typeof errorName],
  msg?,
): ErrCodeException => {
  for (const error of eCodeList) {
    if (error.code === errCode) {
      return new ErrCodeException(error, msg)
    }
  }

  const error = eCodeList.find((val) => val.code == errorName['e1005000'])
  return new ErrCodeException(error, msg)
}
