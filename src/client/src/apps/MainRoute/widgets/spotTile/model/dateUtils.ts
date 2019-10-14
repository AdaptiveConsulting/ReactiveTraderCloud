import { DateTime } from 'luxon'
import { SPOT_DATE_FORMAT } from './spotTileUtils'

export function spotDateFormatter(date: string, tenorRequired: boolean = true) {
  const formattedDate = DateTime.fromISO(date, { zone: 'utc' }).toFormat(SPOT_DATE_FORMAT)
  return tenorRequired ? `SP. ${formattedDate}` : formattedDate
}
   