import moment from 'moment'
import { SPOT_DATE_FORMAT } from './spotTileUtils'

function momentDateFormatter(date: string, formatter: string = SPOT_DATE_FORMAT) {
  return moment.utc(date).format(formatter)
}

export function spotDateFormatter(date: string, tenorRequired: boolean = true) {
  return tenorRequired ? `SP. ${momentDateFormatter(date)}` : `${momentDateFormatter(date)}`
}
