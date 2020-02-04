import { DateTime } from 'luxon'
import memoize from 'lodash/memoize'
import { SPOT_DATE_FORMAT } from './spotTileUtils'

export function spotDateFormatter(
  date: string,
  tenorRequired: boolean = true,
  localZoneName: string = 'utc',
) {
  const dt = DateTime.fromISO(date, { zone: localZoneName })

  const formattedDate = dt.isValid ? dt.toFormat(SPOT_DATE_FORMAT) : date

  return (tenorRequired ? `SP. ${formattedDate}` : formattedDate).toLocaleUpperCase()
}

export const memoDateFormatter = (createKey: ((...args: any[]) => any) | undefined) =>
  memoize(spotDateFormatter, createKey)
