
interface DatePartDict {
  day: string;
  month: string;
  year: string;
}

export const capitalize = (str: string | unknown) => typeof str === 'string' ? (str.charAt(0).toUpperCase() + str.slice(1)) : ''

export const formatMoney = (value: number) => {
  return  new Intl.NumberFormat('default', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(value)
}

export const formatDate = (date: Date) => {
  const { day, month, year } =  new Intl.DateTimeFormat('default', { month: 'short', day: '2-digit', year: 'numeric' }).formatToParts(date)
    .filter(({ type }) => type !== 'literal')
    .reduce<DatePartDict>((accum, { type, value}) => ({ ...accum, [type]: value }), {} as DatePartDict)

  return `${day}-${month}-${year}`
}
