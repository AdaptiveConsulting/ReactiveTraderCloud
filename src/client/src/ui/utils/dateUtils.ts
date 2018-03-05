import { SPOT_DATE_FORMAT } from '../spotTile/spotTileUtils'
import * as moment from 'moment'

function momentDateFormatter (date: any, formatter:string = SPOT_DATE_FORMAT) {
  return moment(date).format(formatter)
}
export function spotDateFormatter (date: any) {
  return `SP. ${momentDateFormatter(date)}`
}
