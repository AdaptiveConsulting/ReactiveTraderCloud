import { DateTime } from 'luxon'
import { SPOT_DATE_FORMAT } from './spotTileUtils'

export function spotDateFormatter(date: string, tenorRequired: boolean = true, localZoneName: string = 'utc') {
  const formattedDate = date && DateTime.fromISO(date, { zone: localZoneName}).isValid ? DateTime.fromISO(date, { zone: localZoneName}).toFormat(SPOT_DATE_FORMAT) : date

  return tenorRequired ? `SP. ${formattedDate}` : formattedDate
}
   