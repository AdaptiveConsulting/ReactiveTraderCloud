import { DateTime } from 'luxon'
import { SPOT_DATE_FORMAT } from './spotTileUtils'

export function spotDateFormatter(date: string, tenorRequired: boolean = true, localZoneName: string) {
  const formattedDate = !date ? date : DateTime.fromISO(date, { zone: localZoneName }).toFormat(SPOT_DATE_FORMAT)

  return tenorRequired ? `SP. ${formattedDate}` : formattedDate
}
   