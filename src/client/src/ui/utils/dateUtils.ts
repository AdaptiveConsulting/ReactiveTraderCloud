import { SPOT_DATE_FORMAT } from '../spotTile/spotTileUtils'
import * as moment from 'moment'

function momentDateFormatter (date: any, formatter:string = SPOT_DATE_FORMAT) {
  return moment.utc(date).format(formatter)
}

export function spotDateFormatter (date: any, tenorRequired:boolean = true) {
  return tenorRequired ? `SP. ${momentDateFormatter(date)}` : `${momentDateFormatter(date)}`
}
