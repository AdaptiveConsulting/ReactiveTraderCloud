import { spotDateFormatter } from './dateUtils'

describe('spotDateFormatter', () => {
  const spotDate = '2020-01-30T00:00:00Z'

  it('should return the formatted date according to different time zone', () => {
    const zoneNames = {
      sydney: 'Australia/Sydney',
      anchorage: 'America/Anchorage',
      easterIsland: 'Pacific/Easter',
      dubai: 'Asia/Dubai',
      niue: 'Pacific/Niue',
      apia: 'Pacific/Apia',
    }

    const formattedAnchorageDate = spotDateFormatter(spotDate, true, zoneNames.anchorage)
    expect(formattedAnchorageDate).toEqual('SP. 29 JAN')

    const formattedSydneyDate = spotDateFormatter(spotDate, true, zoneNames.sydney)
    expect(formattedSydneyDate).toEqual('SP. 30 JAN')

    const formattedEasterIslandDate = spotDateFormatter(spotDate, true, zoneNames.easterIsland)
    expect(formattedEasterIslandDate).toEqual('SP. 29 JAN')

    const formattedDubaiDate = spotDateFormatter(spotDate, true, zoneNames.dubai)
    expect(formattedDubaiDate).toEqual('SP. 30 JAN')

    const formattedNiueDate = spotDateFormatter(spotDate, true, zoneNames.niue)
    expect(formattedNiueDate).toEqual('SP. 29 JAN')

    const formattedApiaDate = spotDateFormatter(spotDate, true, zoneNames.apia)
    expect(formattedApiaDate).toEqual('SP. 30 JAN')
  })

  it('should return the formatted dat in utc if localZoneName is undefined', () => {
    const formatteUndefinedZoneDate = spotDateFormatter(spotDate, true, undefined)
    expect(formatteUndefinedZoneDate).toEqual('SP. 30 JAN')
  })
})
