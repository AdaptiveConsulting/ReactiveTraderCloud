import { SPOT_DATE_FORMAT } from '../spotTile/spotTileUtils'
import * as moment from 'moment'

/**
 * Returns the formatted date
 * @param {String} date
 * @param {String} formatter
 * @returns {String}
 */
function momentDateFormatter (date: any, formatter:string = SPOT_DATE_FORMAT) {
  return moment(date).format(formatter)
}

/**
 * Returns the spot date formatted
 * @param {String} date
 * @returns {String}
 */
export function spotDateFormatter (date: any) {
  return `SP. ${momentDateFormatter(date)}`
}
