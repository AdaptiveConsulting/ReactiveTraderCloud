/* This file contains Market Definitions for the major stock exchanges.
ChartIQ will update this file periodically but please check to make sure the hours and holidays
are accurate for your exchange. If you find errors please let us know! dev@chartiq.com

Since this is a large file we recommend that you cut and paste definitions into your own code.
*/

CIQ.Market.ALTX = {
	"market_tz": "Africa/Johannesburg",
	"name": "AltX (Division of Johannesburg Stock Exchange)",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:00",
			"close": "16:50"
		},
		{
			"dayofweek": 2,
			"open": "09:00",
			"close": "16:50"
		},
		{
			"dayofweek": 3,
			"open": "09:00",
			"close": "16:50"
		},
		{
			"dayofweek": 4,
			"open": "09:00",
			"close": "16:50"
		},
		{
			"dayofweek": 5,
			"open": "09:00",
			"close": "16:50"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-03-21",
			"name": "Human Rights Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Family Day (Easter Monday)"
		},
		{
			"date": "2016-04-27",
			"name": "Freedom Day"
		},
		{
			"date": "2016-05-02",
			"name": "Workers' Day OBS"
		},
		{
			"date": "2016-06-16",
			"name": "Youth Day"
		},
		{
			"date": "2016-08-03",
			"name": "Election Day"
		},
		{
			"date": "2016-08-09",
			"name": "National Women's Day"
		},
		{
			"date": "2016-12-16",
			"name": "Day of Reconciliation"
		},
		{
			"date": "2016-12-26",
			"name": "Day of Goodwill"
		},
		{
			"date": "2016-12-27",
			"name": "Public Holiday"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-03-21",
			"name": "Human Rights Day"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Family Day (Easter Monday)"
		},
		{
			"date": "2017-04-27",
			"name": "Freedom Day"
		},
		{
			"date": "2017-05-01",
			"name": "Workers' Day"
		},
		{
			"date": "2017-06-16",
			"name": "Youth Day"
		},
		{
			"date": "2017-08-09",
			"name": "National Women's Day"
		},
		{
			"date": "2017-09-25",
			"name": "Heritage Day OBS"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Day of Goodwill"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-03-21",
			"name": "Human Rights Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Family Day (Easter Monday)"
		},
		{
			"date": "2018-04-27",
			"name": "Freedom Day"
		},
		{
			"date": "2018-05-01",
			"name": "Workers' Day"
		},
		{
			"date": "2018-08-09",
			"name": "National Women's Day"
		},
		{
			"date": "2018-09-24",
			"name": "Heritage Day"
		},
		{
			"date": "2018-12-17",
			"name": "Day of Reconciliation OBS"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Day of Goodwill"
		},
		{
			"date": "2018-12-24",
			"open": "09:00",
			"close": "11:50"
		},
		{
			"date": "2018-12-31",
			"open": "09:00",
			"close": "11:50"
		}
	]
}

CIQ.Market.ARCX = {
	"market_tz": "America/New_York",
	"name": "NYSE Arca",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 2,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 3,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 4,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 5,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-01-18",
			"name": "Martin Luther King Jr. Day"
		},
		{
			"date": "2016-02-15",
			"name": "Presidents' Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-05-30",
			"name": "Memorial Day"
		},
		{
			"date": "2016-07-04",
			"name": "Independence Day"
		},
		{
			"date": "2016-09-05",
			"name": "Labor Day"
		},
		{
			"date": "2016-11-24",
			"name": "Thanksgiving"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas OBS"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-01-16",
			"name": "Martin Luther King Jr. Day"
		},
		{
			"date": "2017-02-20",
			"name": "Presidents' Day"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-05-29",
			"name": "Memorial Day"
		},
		{
			"date": "2017-07-04",
			"name": "Independence Day"
		},
		{
			"date": "2017-09-04",
			"name": "Labor Day"
		},
		{
			"date": "2017-11-23",
			"name": "Thanksgiving"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-01-15",
			"name": "Martin Luther King Jr. Day"
		},
		{
			"date": "2018-02-19",
			"name": "Presidents' Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-05-28",
			"name": "Memorial Day"
		},
		{
			"date": "2018-07-04",
			"name": "Independence Day"
		},
		{
			"date": "2018-09-03",
			"name": "Labor Day"
		},
		{
			"date": "2018-11-22",
			"name": "Thanksgiving"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas"
		},
		{
			"date": "2018-07-03",
			"open": "09:30",
			"close": "13:00"
		},
		{
			"date": "2018-11-23",
			"open": "09:30",
			"close": "13:00"
		},
		{
			"date": "2018-12-24",
			"open": "09:30",
			"close": "13:00"
		}
	]
}

CIQ.Market.BATE = {
	"market_tz": "Europe/London",
	"name": "BATS Trading Europe",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "08:00",
			"close": "16:30"
		},
		{
			"dayofweek": 2,
			"open": "08:00",
			"close": "16:30"
		},
		{
			"dayofweek": 3,
			"open": "08:00",
			"close": "16:30"
		},
		{
			"dayofweek": 4,
			"open": "08:00",
			"close": "16:30"
		},
		{
			"dayofweek": 5,
			"open": "08:00",
			"close": "16:30"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-05-01",
			"name": "May Holiday"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-12-24",
			"open": "08:00",
			"close": "12:30"
		},
		{
			"date": "2018-12-31",
			"open": "08:00",
			"close": "12:30"
		}
	]
}

CIQ.Market.BATS = {
	"market_tz": "America/Chicago",
	"name": "BATS Trading",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 2,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 3,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 4,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 5,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-01-18",
			"name": "Martin Luther King Jr. Day"
		},
		{
			"date": "2016-02-15",
			"name": "Presidents' Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-05-30",
			"name": "Memorial Day"
		},
		{
			"date": "2016-07-04",
			"name": "Independence Day"
		},
		{
			"date": "2016-09-05",
			"name": "Labor Day"
		},
		{
			"date": "2016-11-24",
			"name": "Thanksgiving"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas OBS"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-01-16",
			"name": "Martin Luther King Jr. Day"
		},
		{
			"date": "2017-02-20",
			"name": "Presidents' Day"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-05-29",
			"name": "Memorial Day"
		},
		{
			"date": "2017-07-04",
			"name": "Independence Day"
		},
		{
			"date": "2017-09-04",
			"name": "Labor Day"
		},
		{
			"date": "2017-11-23",
			"name": "Thanksgiving"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-01-15",
			"name": "Martin Luther King Jr. Day"
		},
		{
			"date": "2018-02-19",
			"name": "Presidents' Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-05-28",
			"name": "Memorial Day"
		},
		{
			"date": "2018-07-04",
			"name": "Independence Day"
		},
		{
			"date": "2018-09-03",
			"name": "Labor Day"
		},
		{
			"date": "2018-11-22",
			"name": "Thanksgiving"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas"
		},
		{
			"date": "2018-07-03",
			"open": "09:30",
			"close": "13:00"
		},
		{
			"date": "2018-11-23",
			"open": "09:30",
			"close": "13:00"
		},
		{
			"date": "2018-12-24",
			"open": "09:30",
			"close": "13:00"
		}
	]
}

CIQ.Market.BATY = {
	"market_tz": "America/Chicago",
	"name": "BATS Y-Exchange (BYX)",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 2,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 3,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 4,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 5,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-01-18",
			"name": "Martin Luther King Jr. Day"
		},
		{
			"date": "2016-02-15",
			"name": "Presidents' Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-05-30",
			"name": "Memorial Day"
		},
		{
			"date": "2016-07-04",
			"name": "Independence Day"
		},
		{
			"date": "2016-09-05",
			"name": "Labor Day"
		},
		{
			"date": "2016-11-24",
			"name": "Thanksgiving"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas OBS"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-01-16",
			"name": "Martin Luther King Jr. Day"
		},
		{
			"date": "2017-02-20",
			"name": "Presidents' Day"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-05-29",
			"name": "Memorial Day"
		},
		{
			"date": "2017-07-04",
			"name": "Independence Day"
		},
		{
			"date": "2017-09-04",
			"name": "Labor Day"
		},
		{
			"date": "2017-11-23",
			"name": "Thanksgiving"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-01-15",
			"name": "Martin Luther King Jr. Day"
		},
		{
			"date": "2018-02-19",
			"name": "Presidents' Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-05-28",
			"name": "Memorial Day"
		},
		{
			"date": "2018-07-04",
			"name": "Independence Day"
		},
		{
			"date": "2018-09-03",
			"name": "Labor Day"
		},
		{
			"date": "2018-11-22",
			"name": "Thanksgiving"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas"
		},
		{
			"date": "2018-07-03",
			"open": "09:30",
			"close": "13:00"
		},
		{
			"date": "2018-11-23",
			"open": "09:30",
			"close": "13:00"
		},
		{
			"date": "2018-12-24",
			"open": "09:30",
			"close": "13:00"
		}
	]
}

CIQ.Market.BSEX = {
	"market_tz": "Asia/Baku",
	"name": "Baku Stock Exchange",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "10:00",
			"close": "16:00"
		},
		{
			"dayofweek": 2,
			"open": "10:00",
			"close": "16:00"
		},
		{
			"dayofweek": 3,
			"open": "10:00",
			"close": "16:00"
		},
		{
			"dayofweek": 4,
			"open": "10:00",
			"close": "16:00"
		},
		{
			"dayofweek": 5,
			"open": "10:00",
			"close": "16:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-01-04",
			"name": "New Year Holiday OBS"
		},
		{
			"date": "2016-01-20",
			"name": "Mourning Day"
		},
		{
			"date": "2016-03-08",
			"name": "Women's Day"
		},
		{
			"date": "2016-03-21",
			"name": "Novruz Bayram"
		},
		{
			"date": "2016-03-22",
			"name": "Novruz Bayram 1"
		},
		{
			"date": "2016-03-23",
			"name": "Novruz Bayram 2"
		},
		{
			"date": "2016-03-24",
			"name": "Novruz Bayram 3"
		},
		{
			"date": "2016-03-25",
			"name": "Novruz Bayram 4"
		},
		{
			"date": "2016-05-09",
			"name": "Victory Day"
		},
		{
			"date": "2016-05-30",
			"name": "Independence/Republic Day OBS"
		},
		{
			"date": "2016-06-15",
			"name": "National Salvation Day"
		},
		{
			"date": "2016-06-27",
			"name": "Armed Forces Day OBS"
		},
		{
			"date": "2016-07-06",
			"name": "Ramazan*"
		},
		{
			"date": "2016-07-07",
			"name": "Ramazan 2*"
		},
		{
			"date": "2016-09-12",
			"name": "Gurban Bayram*"
		},
		{
			"date": "2016-09-13",
			"name": "Gurban Bayram 2*"
		},
		{
			"date": "2016-09-26",
			"name": "Referendum Day"
		},
		{
			"date": "2016-11-09",
			"name": "National Flag Day"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-01-03",
			"name": "New Year Holiday OBS"
		},
		{
			"date": "2017-01-04",
			"name": "Day of Solidarity OBS"
		},
		{
			"date": "2017-01-20",
			"name": "Mourning Day"
		},
		{
			"date": "2017-03-08",
			"name": "Women's Day"
		},
		{
			"date": "2017-03-20",
			"name": "Novruz Bayram"
		},
		{
			"date": "2017-03-21",
			"name": "Novruz Bayram 1"
		},
		{
			"date": "2017-03-22",
			"name": "Novruz Bayram 2"
		},
		{
			"date": "2017-03-23",
			"name": "Novruz Bayram 3"
		},
		{
			"date": "2017-03-24",
			"name": "Novruz Bayram 4"
		},
		{
			"date": "2017-05-09",
			"name": "Victory Day"
		},
		{
			"date": "2017-05-29",
			"name": "Independence/Republic Day OBS"
		},
		{
			"date": "2017-06-15",
			"name": "National Salvation Day"
		},
		{
			"date": "2017-06-26",
			"name": "Armed Forces Day"
		},
		{
			"date": "2017-06-27",
			"name": "Ramazan*"
		},
		{
			"date": "2017-06-28",
			"name": "Ramazan 2*"
		},
		{
			"date": "2017-09-01",
			"name": "Gurban Bayram*"
		},
		{
			"date": "2017-09-04",
			"name": "Gurban Bayram Holiday"
		},
		{
			"date": "2017-11-09",
			"name": "National Flag Day"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-01-02",
			"name": "New Year Holiday"
		},
		{
			"date": "2018-01-03",
			"name": "Day of Solidarity OBS"
		},
		{
			"date": "2018-03-08",
			"name": "Women's Day"
		},
		{
			"date": "2018-03-20",
			"name": "Novruz Bayram"
		},
		{
			"date": "2018-03-21",
			"name": "Novruz Bayram 1"
		},
		{
			"date": "2018-03-22",
			"name": "Novruz Bayram 2"
		},
		{
			"date": "2018-03-23",
			"name": "Novruz Bayram 3"
		},
		{
			"date": "2018-03-26",
			"name": "Novruz Bairam Holiday"
		},
		{
			"date": "2018-05-09",
			"name": "Victory Day"
		},
		{
			"date": "2018-05-28",
			"name": "Independence/Republic Day"
		},
		{
			"date": "2018-06-15",
			"name": "National Salvation Day"
		},
		{
			"date": "2018-06-15",
			"name": "Ramazan*"
		},
		{
			"date": "2018-06-18",
			"name": "Ramazan (additonal observance)*"
		},
		{
			"date": "2018-06-19",
			"name": "Bank and Market Holiday"
		},
		{
			"date": "2018-06-26",
			"name": "Armed Forces Day"
		},
		{
			"date": "2018-08-22",
			"name": "Gurban Bayram*"
		},
		{
			"date": "2018-08-23",
			"name": "Gurban Bayram 2*"
		},
		{
			"date": "2018-10-17",
			"name": "Election Day"
		},
		{
			"date": "2018-11-09",
			"name": "National Flag Day"
		},
		{
			"date": "2018-12-31",
			"name": "Day of Solidarity"
		}
	]
}

CIQ.Market.EDGA = {
	"market_tz": "America/New_York",
	"name": "BATS EDGA (formerly Direct Edge)",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 2,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 3,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 4,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 5,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-01-18",
			"name": "Martin Luther King Jr. Day"
		},
		{
			"date": "2016-02-15",
			"name": "Presidents' Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-05-30",
			"name": "Memorial Day"
		},
		{
			"date": "2016-07-04",
			"name": "Independence Day"
		},
		{
			"date": "2016-09-05",
			"name": "Labor Day"
		},
		{
			"date": "2016-11-24",
			"name": "Thanksgiving"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas OBS"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-01-16",
			"name": "Martin Luther King Jr. Day"
		},
		{
			"date": "2017-02-20",
			"name": "Presidents' Day"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-05-29",
			"name": "Memorial Day"
		},
		{
			"date": "2017-07-04",
			"name": "Independence Day"
		},
		{
			"date": "2017-09-04",
			"name": "Labor Day"
		},
		{
			"date": "2017-11-23",
			"name": "Thanksgiving"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-01-15",
			"name": "Martin Luther King Jr. Day"
		},
		{
			"date": "2018-02-19",
			"name": "Presidents' Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-05-28",
			"name": "Memorial Day"
		},
		{
			"date": "2018-07-04",
			"name": "Independence Day"
		},
		{
			"date": "2018-09-03",
			"name": "Labor Day"
		},
		{
			"date": "2018-11-22",
			"name": "Thanksgiving"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas"
		},
		{
			"date": "2018-07-03",
			"open": "09:30",
			"close": "13:00"
		},
		{
			"date": "2018-11-23",
			"open": "09:30",
			"close": "13:00"
		},
		{
			"date": "2018-12-24",
			"open": "09:30",
			"close": "13:00"
		}
	]
}

CIQ.Market.BVCA = {
	"market_tz": "America/Caracas",
	"name": "Bolsa Valores Caracas",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:00",
			"close": "13:00"
		},
		{
			"dayofweek": 2,
			"open": "09:00",
			"close": "13:00"
		},
		{
			"dayofweek": 3,
			"open": "09:00",
			"close": "13:00"
		},
		{
			"dayofweek": 4,
			"open": "09:00",
			"close": "13:00"
		},
		{
			"dayofweek": 5,
			"open": "09:00",
			"close": "13:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-01-11",
			"name": "Epiphany OBS"
		},
		{
			"date": "2016-02-08",
			"name": "Carnival 1"
		},
		{
			"date": "2016-02-09",
			"name": "Carnival 2"
		},
		{
			"date": "2016-03-24",
			"name": "Holy Thursday"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-04-19",
			"name": "Mov. Precursor de la Independencia"
		},
		{
			"date": "2016-05-09",
			"name": "Ascension"
		},
		{
			"date": "2016-05-30",
			"name": "Corpus Christi"
		},
		{
			"date": "2016-06-24",
			"name": "Battle of Carabobo"
		},
		{
			"date": "2016-07-04",
			"name": "Sts. Peter and Paul OBS"
		},
		{
			"date": "2016-07-05",
			"name": "Independence Day"
		},
		{
			"date": "2016-08-15",
			"name": "Assumption Day"
		},
		{
			"date": "2016-10-12",
			"name": "Columbus Day"
		},
		{
			"date": "2016-11-07",
			"name": "All Saints' Day OBS"
		},
		{
			"date": "2016-12-12",
			"name": "Immaculate Conception OBS"
		},
		{
			"date": "2017-01-09",
			"name": "Epiphany OBS"
		},
		{
			"date": "2017-02-01",
			"name": "Trading Holiday"
		},
		{
			"date": "2017-02-27",
			"name": "Carnival 1"
		},
		{
			"date": "2017-02-28",
			"name": "Carnival 2"
		},
		{
			"date": "2017-04-13",
			"name": "Holy Thursday"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-19",
			"name": "Mov. Precursor de la Independencia"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-05-29",
			"name": "Ascension"
		},
		{
			"date": "2017-06-19",
			"name": "Corpus Christi"
		},
		{
			"date": "2017-07-03",
			"name": "Sts. Peter and Paul OBS"
		},
		{
			"date": "2017-07-05",
			"name": "Independence Day"
		},
		{
			"date": "2017-07-24",
			"name": "Bolivar's Birthday"
		},
		{
			"date": "2017-08-14",
			"name": "Assumption Day OBS"
		},
		{
			"date": "2017-09-11",
			"name": "Virgen de Coromoto"
		},
		{
			"date": "2017-10-12",
			"name": "Columbus Day"
		},
		{
			"date": "2017-11-06",
			"name": "All Saints' Day OBS"
		},
		{
			"date": "2017-12-11",
			"name": "Immaculate Conception OBS"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-02-12",
			"name": "Carnival 1"
		},
		{
			"date": "2018-02-13",
			"name": "Carnival 2"
		},
		{
			"date": "2018-03-19",
			"name": "St. Joseph's Day"
		},
		{
			"date": "2018-03-29",
			"name": "Holy Thursday"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-19",
			"name": "Mov. Precursor de la Independencia"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-05-14",
			"name": "Ascension"
		},
		{
			"date": "2018-06-04",
			"name": "Corpus Christi"
		},
		{
			"date": "2018-07-02",
			"name": "Sts. Peter and Paul OBS"
		},
		{
			"date": "2018-07-05",
			"name": "Independence Day"
		},
		{
			"date": "2018-07-24",
			"name": "Bolivar's Birthday"
		},
		{
			"date": "2018-08-20",
			"name": "Assumption Day OBS"
		},
		{
			"date": "2018-09-10",
			"name": "Virgen de Coromoto"
		},
		{
			"date": "2018-10-12",
			"name": "Columbus Day"
		},
		{
			"date": "2018-11-05",
			"name": "All Saints' Day OBS"
		},
		{
			"date": "2018-12-24",
			"name": "Christmas Eve"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-31",
			"name": "New Year's Eve"
		}
	]
}

CIQ.Market.MISX = {
	"market_tz": "Europe/Moscow",
	"name": "Moscow Exchange MICEX Main Market",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "10:00",
			"close": "18:39"
		},
		{
			"dayofweek": 2,
			"open": "10:00",
			"close": "18:39"
		},
		{
			"dayofweek": 3,
			"open": "10:00",
			"close": "18:39"
		},
		{
			"dayofweek": 4,
			"open": "10:00",
			"close": "18:39"
		},
		{
			"dayofweek": 5,
			"open": "10:00",
			"close": "18:39"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-01-07",
			"name": "Russian Orthodox Christmas"
		},
		{
			"date": "2016-01-08",
			"name": "New Year's Holiday OBS"
		},
		{
			"date": "2016-02-23",
			"name": "Defense of the Fatherland"
		},
		{
			"date": "2016-03-08",
			"name": "International Women's Day"
		},
		{
			"date": "2016-05-02",
			"name": "International Labour Day OBS"
		},
		{
			"date": "2016-05-03",
			"name": "International Labour Day Holiday"
		},
		{
			"date": "2016-05-09",
			"name": "Victory Day"
		},
		{
			"date": "2016-06-13",
			"name": "Declaration of Russian Sovereignty OBS"
		},
		{
			"date": "2016-11-04",
			"name": "National Unity Day"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Holiday"
		},
		{
			"date": "2017-02-23",
			"name": "Defense of the Fatherland"
		},
		{
			"date": "2017-03-08",
			"name": "International Women's Day"
		},
		{
			"date": "2017-05-01",
			"name": "International Labour Day"
		},
		{
			"date": "2017-05-08",
			"name": "Bridge Holiday"
		},
		{
			"date": "2017-05-09",
			"name": "Victory Day"
		},
		{
			"date": "2017-06-12",
			"name": "Declaration of Russian Sovereignty"
		},
		{
			"date": "2017-11-06",
			"name": "National Unity Day OBS"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-01-02",
			"name": "New Year's Holiday"
		},
		{
			"date": "2018-01-08",
			"name": "New Year's Holiday 3"
		},
		{
			"date": "2018-02-23",
			"name": "Defense of the Fatherland"
		},
		{
			"date": "2018-03-08",
			"name": "International Women's Day"
		},
		{
			"date": "2018-05-01",
			"name": "International Labour Day"
		},
		{
			"date": "2018-05-09",
			"name": "Victory Day"
		},
		{
			"date": "2018-06-12",
			"name": "Declaration of Russian Sovereignty"
		},
		{
			"date": "2018-11-05",
			"name": "National Unity Day OBS"
		},
		{
			"date": "2018-12-31",
			"name": "New Year's Eve Holiday"
		}
	]
}

CIQ.Market.MTAA = {
	"market_tz": "Europe/Rome",
	"name": "Borsa Italia MTA (Equities)",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 2,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 3,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 4,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 5,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-08-15",
			"name": "Assumption Day"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-08-15",
			"name": "Assumption Day"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-08-15",
			"name": "Assumption Day"
		},
		{
			"date": "2018-12-24",
			"name": "Christmas Eve"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-12-31",
			"name": "New Year's Eve"
		}
	]
}

CIQ.Market.ROCO = {
	"market_tz": "Asia/Taipei",
	"name": "GreTai Securities Market",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:00",
			"close": "13:30"
		},
		{
			"dayofweek": 2,
			"open": "09:00",
			"close": "13:30"
		},
		{
			"dayofweek": 3,
			"open": "09:00",
			"close": "13:30"
		},
		{
			"dayofweek": 4,
			"open": "09:00",
			"close": "13:30"
		},
		{
			"dayofweek": 5,
			"open": "09:00",
			"close": "13:30"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-02-04",
			"name": "LNY - No Trading 1"
		},
		{
			"date": "2016-02-05",
			"name": "LNY - No Trading 2"
		},
		{
			"date": "2016-02-08",
			"name": "Lunar New Year 1"
		},
		{
			"date": "2016-02-09",
			"name": "Lunar New Year 2"
		},
		{
			"date": "2016-02-10",
			"name": "Lunar New Year 3"
		},
		{
			"date": "2016-02-11",
			"name": "Additional LNY Holiday"
		},
		{
			"date": "2016-02-12",
			"name": "Additional LNY Holiday 2"
		},
		{
			"date": "2016-02-29",
			"name": "Peace Memorial Day OBS"
		},
		{
			"date": "2016-04-04",
			"name": "Children's Day"
		},
		{
			"date": "2016-04-05",
			"name": "Ching Ming Festival"
		},
		{
			"date": "2016-05-02",
			"name": "Labour Day OBS"
		},
		{
			"date": "2016-06-09",
			"name": "Dragon Boat Festival"
		},
		{
			"date": "2016-06-10",
			"name": "Adjusted Holiday 1"
		},
		{
			"date": "2016-07-08",
			"name": "Closure due to Typhoon"
		},
		{
			"date": "2016-09-15",
			"name": "Mid-Autumn Festival"
		},
		{
			"date": "2016-09-16",
			"name": "Adjusted Holiday 2"
		},
		{
			"date": "2016-09-27",
			"name": "Market Closure due to Typhoon"
		},
		{
			"date": "2016-09-28",
			"name": "Closure due to Typhoon 3"
		},
		{
			"date": "2016-10-10",
			"name": "National Day"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-01-25",
			"name": "LNY - No Trading 1"
		},
		{
			"date": "2017-01-26",
			"name": "LNY - No Trading 2"
		},
		{
			"date": "2017-01-27",
			"name": "Lunar New Year's Eve"
		},
		{
			"date": "2017-01-30",
			"name": "Lunar New Year 3"
		},
		{
			"date": "2017-01-31",
			"name": "Additional LNY Holiday"
		},
		{
			"date": "2017-02-01",
			"name": "Additional LNY Holiday 2"
		},
		{
			"date": "2017-02-27",
			"name": "Adjusted Holiday 1"
		},
		{
			"date": "2017-02-28",
			"name": "Peace Memorial Day"
		},
		{
			"date": "2017-04-03",
			"name": "Ching Ming Festival"
		},
		{
			"date": "2017-04-04",
			"name": "Children's Day"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-05-29",
			"name": "Adjusted Holiday 2"
		},
		{
			"date": "2017-05-30",
			"name": "Dragon Boat Festival"
		},
		{
			"date": "2017-10-04",
			"name": "Mid-Autumn Festival"
		},
		{
			"date": "2017-10-09",
			"name": "Adjusted Holiday 3"
		},
		{
			"date": "2017-10-10",
			"name": "National Day"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-02-13",
			"name": "LNY - No Trading 1"
		},
		{
			"date": "2018-02-14",
			"name": "LNY - No Trading 2"
		},
		{
			"date": "2018-02-15",
			"name": "Lunar New Year's Eve"
		},
		{
			"date": "2018-02-16",
			"name": "Lunar New Year 1"
		},
		{
			"date": "2018-02-19",
			"name": "Additional LNY Holiday"
		},
		{
			"date": "2018-02-20",
			"name": "Additional LNY Holiday 2"
		},
		{
			"date": "2018-02-28",
			"name": "Peace Memorial Day"
		},
		{
			"date": "2018-04-04",
			"name": "Children's Day"
		},
		{
			"date": "2018-04-05",
			"name": "Ching Ming Festival"
		},
		{
			"date": "2018-04-06",
			"name": "Adjusted Holiday 2"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-06-18",
			"name": "Dragon Boat Festival"
		},
		{
			"date": "2018-09-24",
			"name": "Mid-Autumn Festival"
		},
		{
			"date": "2018-10-10",
			"name": "National Day"
		},
		{
			"date": "2018-12-31",
			"name": "Adjusted Holiday 1"
		}
	]
}

CIQ.Market.SBIJ = {
	"market_tz": "Asia/Tokyo",
	"rules": [
		{
			"dayofweek": 1,
			"open": "08:20",
			"close": "16:00"
		},
		{
			"dayofweek": 1,
			"open": "19:00",
			"close": "23:59"
		},
		{
			"dayofweek": 2,
			"open": "08:20",
			"close": "16:00"
		},
		{
			"dayofweek": 2,
			"open": "19:00",
			"close": "23:59"
		},
		{
			"dayofweek": 3,
			"open": "08:20",
			"close": "16:00"
		},
		{
			"dayofweek": 3,
			"open": "19:00",
			"close": "23:59"
		},
		{
			"dayofweek": 4,
			"open": "08:20",
			"close": "16:00"
		},
		{
			"dayofweek": 4,
			"open": "19:00",
			"close": "23:59"
		},
		{
			"dayofweek": 5,
			"open": "08:20",
			"close": "16:00"
		},
		{
			"dayofweek": 5,
			"open": "19:00",
			"close": "23:59"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-01-11",
			"name": "Coming of Age  (Adults') Day"
		},
		{
			"date": "2016-02-11",
			"name": "National Founding Day"
		},
		{
			"date": "2016-03-21",
			"name": "Vernal Equinox OBS"
		},
		{
			"date": "2016-04-29",
			"name": "Showa Day (formerly Greenery Day)"
		},
		{
			"date": "2016-05-03",
			"name": "Constitution Day"
		},
		{
			"date": "2016-05-04",
			"name": "Greenery Day (formerly National Holiday)"
		},
		{
			"date": "2016-05-05",
			"name": "Children's Day"
		},
		{
			"date": "2016-07-18",
			"name": "Marine Day"
		},
		{
			"date": "2016-08-11",
			"name": "Mountain Day"
		},
		{
			"date": "2016-09-19",
			"name": "Respect for the Aged Day"
		},
		{
			"date": "2016-09-22",
			"name": "Autumn Equinox"
		},
		{
			"date": "2016-10-10",
			"name": "Health-Sports Day"
		},
		{
			"date": "2016-11-03",
			"name": "Culture Day"
		},
		{
			"date": "2016-11-23",
			"name": "Labour Thanksgiving Day"
		},
		{
			"date": "2016-12-23",
			"name": "Emperor's Birthday"
		},
		{
			"date": "2017-01-02",
			"name": "Bank Holiday 2"
		},
		{
			"date": "2017-01-03",
			"name": "Bank Holiday 3"
		},
		{
			"date": "2017-01-09",
			"name": "Coming of Age  (Adults') Day"
		},
		{
			"date": "2017-03-20",
			"name": "Vernal Equinox"
		},
		{
			"date": "2017-05-03",
			"name": "Constitution Day"
		},
		{
			"date": "2017-05-04",
			"name": "Greenery Day (formerly National Holiday)"
		},
		{
			"date": "2017-05-05",
			"name": "Children's Day"
		},
		{
			"date": "2017-07-17",
			"name": "Marine Day"
		},
		{
			"date": "2017-08-11",
			"name": "Mountain Day"
		},
		{
			"date": "2017-09-18",
			"name": "Respect for the Aged Day"
		},
		{
			"date": "2017-10-09",
			"name": "Health-Sports Day"
		},
		{
			"date": "2017-11-03",
			"name": "Culture Day"
		},
		{
			"date": "2017-11-23",
			"name": "Labour Thanksgiving Day"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-01-02",
			"name": "Bank Holiday 2"
		},
		{
			"date": "2018-01-03",
			"name": "Bank Holiday 3"
		},
		{
			"date": "2018-01-08",
			"name": "Coming of Age  (Adults') Day"
		},
		{
			"date": "2018-02-12",
			"name": "National Founding Day OBS"
		},
		{
			"date": "2018-03-21",
			"name": "Vernal Equinox"
		},
		{
			"date": "2018-04-30",
			"name": "Showa Day (formerly Greenery Day) OBS"
		},
		{
			"date": "2018-05-03",
			"name": "Constitution Day"
		},
		{
			"date": "2018-05-04",
			"name": "Greenery Day (formerly National Holiday)"
		},
		{
			"date": "2018-07-16",
			"name": "Marine Day"
		},
		{
			"date": "2018-09-17",
			"name": "Respect for the Aged Day"
		},
		{
			"date": "2018-09-24",
			"name": "Autumn Equinox OBS"
		},
		{
			"date": "2018-10-08",
			"name": "Health-Sports Day"
		},
		{
			"date": "2018-11-23",
			"name": "Labour Thanksgiving Day"
		},
		{
			"date": "2018-12-24",
			"name": "Emperor's Birthday OBS"
		},
		{
			"date": "2018-12-31",
			"name": "New Year's Eve"
		}
	],
	"name": "Japannext",
	"hour_aligned": false
}

CIQ.Market.SGEX = {
	"market_tz": "Asia/Hong_Kong",
	"rules": [
		{
			"dayofweek": 0,
			"open": "21:00",
			"close": "24:00"
		},
		{
			"dayofweek": 1,
			"open": "00:00",
			"close": "02:30"
		},
		{
			"dayofweek": 1,
			"open": "09:00",
			"close": "11:30"
		},
		{
			"dayofweek": 1,
			"open": "13:00",
			"close": "15:00"
		},
		{
			"dayofweek": 1,
			"open": "21:00",
			"close": "24:00"
		},
		{
			"dayofweek": 2,
			"open": "00:00",
			"close": "02:30"
		},
		{
			"dayofweek": 2,
			"open": "09:00",
			"close": "11:30"
		},
		{
			"dayofweek": 2,
			"open": "13:00",
			"close": "15:00"
		},
		{
			"dayofweek": 2,
			"open": "21:00",
			"close": "24:00"
		},
		{
			"dayofweek": 3,
			"open": "00:00",
			"close": "02:30"
		},
		{
			"dayofweek": 3,
			"open": "09:00",
			"close": "11:30"
		},
		{
			"dayofweek": 3,
			"open": "13:00",
			"close": "15:00"
		},
		{
			"dayofweek": 3,
			"open": "21:00",
			"close": "24:00"
		},
		{
			"dayofweek": 4,
			"open": "00:00",
			"close": "02:30"
		},
		{
			"dayofweek": 4,
			"open": "09:00",
			"close": "11:30"
		},
		{
			"dayofweek": 4,
			"open": "13:00",
			"close": "15:00"
		},
		{
			"dayofweek": 4,
			"open": "21:00",
			"close": "24:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-02-08",
			"name": "Lunar New Year 2"
		},
		{
			"date": "2016-02-09",
			"name": "Lunar New Year 3"
		},
		{
			"date": "2016-02-10",
			"name": "Lunar New Year 4"
		},
		{
			"date": "2016-02-11",
			"name": "Lunar New Year 5"
		},
		{
			"date": "2016-02-12",
			"name": "Lunar New Year 6"
		},
		{
			"date": "2016-04-04",
			"name": "Ching Ming Festival"
		},
		{
			"date": "2016-05-02",
			"name": "Labour Day Holiday 2"
		},
		{
			"date": "2016-06-09",
			"name": "Dragon Boat Festival (Tuen Ng Day)*"
		},
		{
			"date": "2016-06-10",
			"name": "Dragon Boat Festival Holiday"
		},
		{
			"date": "2016-09-15",
			"name": "Mid-autumn Festival*"
		},
		{
			"date": "2016-09-16",
			"name": "Mid-autumn Festival Holiday"
		},
		{
			"date": "2016-10-03",
			"name": "National Day 3"
		},
		{
			"date": "2016-10-04",
			"name": "National Day 4"
		},
		{
			"date": "2016-10-05",
			"name": "National Day 5"
		},
		{
			"date": "2016-10-06",
			"name": "National Day 6"
		},
		{
			"date": "2016-10-07",
			"name": "National Day 7"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-01-27",
			"name": "Lunar NY Eve 1"
		},
		{
			"date": "2017-01-30",
			"name": "Lunar New Year 3"
		},
		{
			"date": "2017-01-31",
			"name": "Lunar New Year 4"
		},
		{
			"date": "2017-02-01",
			"name": "Lunar New Year 5"
		},
		{
			"date": "2017-02-02",
			"name": "Lunar New Year 6"
		},
		{
			"date": "2017-04-03",
			"name": "Ching Ming Festival Eve"
		},
		{
			"date": "2017-04-04",
			"name": "Ching Ming Festival"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day 1"
		},
		{
			"date": "2017-05-29",
			"name": "Dragon Boat Festival Holiday"
		},
		{
			"date": "2017-05-30",
			"name": "Dragon Boat Festival (Tuen Ng Day)*"
		},
		{
			"date": "2017-10-02",
			"name": "National Day 2"
		},
		{
			"date": "2017-10-03",
			"name": "National Day 3"
		},
		{
			"date": "2017-10-04",
			"name": "National Day 4"
		},
		{
			"date": "2017-10-04",
			"name": "Mid-autumn Festival*"
		},
		{
			"date": "2017-10-05",
			"name": "National Day 5"
		},
		{
			"date": "2017-10-06",
			"name": "National Day 6"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-02-15",
			"name": "Lunar NY Eve 1"
		},
		{
			"date": "2018-02-16",
			"name": "Lunar New Year 1"
		},
		{
			"date": "2018-02-19",
			"name": "Lunar New Year 4"
		},
		{
			"date": "2018-02-20",
			"name": "Lunar New Year 5"
		},
		{
			"date": "2018-02-21",
			"name": "Lunar New Year 6"
		},
		{
			"date": "2018-04-05",
			"name": "Ching Ming Festival"
		},
		{
			"date": "2018-04-06",
			"name": "Ching Ming Festival Holiday"
		},
		{
			"date": "2018-04-30",
			"name": "Labour Day Holiday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day 1"
		},
		{
			"date": "2018-06-18",
			"name": "Dragon Boat Festival (Tuen Ng Day)*"
		},
		{
			"date": "2018-09-24",
			"name": "Mid-autumn Festival*"
		},
		{
			"date": "2018-10-01",
			"name": "National Day 1"
		},
		{
			"date": "2018-10-02",
			"name": "National Day 2"
		},
		{
			"date": "2018-10-03",
			"name": "National Day 3"
		},
		{
			"date": "2018-10-04",
			"name": "National Day 4"
		},
		{
			"date": "2018-10-05",
			"name": "National Day 5"
		},
		{
			"date": "2018-12-31",
			"name": "Additional New Year Holiday"
		}
	],
	"name": "Shanghai Gold Exchange",
	"hour_aligned": false
}

CIQ.Market.SHSC = {
	"market_tz": "Asia/Hong_Kong",
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:30",
			"close": "11:30"
		},
		{
			"dayofweek": 1,
			"open": "13:00",
			"close": "15:00"
		},
		{
			"dayofweek": 2,
			"open": "09:30",
			"close": "11:30"
		},
		{
			"dayofweek": 2,
			"open": "13:00",
			"close": "15:00"
		},
		{
			"dayofweek": 3,
			"open": "09:30",
			"close": "11:30"
		},
		{
			"dayofweek": 3,
			"open": "13:00",
			"close": "15:00"
		},
		{
			"dayofweek": 4,
			"open": "09:30",
			"close": "11:30"
		},
		{
			"dayofweek": 4,
			"open": "13:00",
			"close": "15:00"
		},
		{
			"dayofweek": 5,
			"open": "09:30",
			"close": "11:30"
		},
		{
			"dayofweek": 5,
			"open": "13:00",
			"close": "15:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-02-04",
			"name": "No trading 1"
		},
		{
			"date": "2016-02-05",
			"name": "No trading 2"
		},
		{
			"date": "2016-02-08",
			"name": "Lunar New Year 2"
		},
		{
			"date": "2016-02-09",
			"name": "Lunar New Year 3"
		},
		{
			"date": "2016-02-10",
			"name": "Lunar New Year 4"
		},
		{
			"date": "2016-02-11",
			"name": "Lunar New Year 5"
		},
		{
			"date": "2016-02-12",
			"name": "Lunar New Year 6"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-04-04",
			"name": "Ching Ming Festival"
		},
		{
			"date": "2016-05-02",
			"name": "Labour Day Holiday 2"
		},
		{
			"date": "2016-05-02",
			"name": "Labour Day OBS"
		},
		{
			"date": "2016-06-07",
			"name": "No trading 3"
		},
		{
			"date": "2016-06-08",
			"name": "No trading 4"
		},
		{
			"date": "2016-06-09",
			"name": "Tuen Ng Day*"
		},
		{
			"date": "2016-06-09",
			"name": "Dragon Boat Festival (Tuen Ng Day)*"
		},
		{
			"date": "2016-06-10",
			"name": "Dragon Boat Festival Holiday"
		},
		{
			"date": "2016-07-01",
			"name": "SAR Establishment Day"
		},
		{
			"date": "2016-08-02",
			"name": "Bank/Market Closure"
		},
		{
			"date": "2016-09-13",
			"name": "No trading 5"
		},
		{
			"date": "2016-09-14",
			"name": "No trading 6"
		},
		{
			"date": "2016-09-15",
			"name": "Mid-autumn Festival*"
		},
		{
			"date": "2016-09-16",
			"name": "Day Following Mid-autumn Festival*"
		},
		{
			"date": "2016-09-16",
			"name": "Mid-autumn Festival Holiday"
		},
		{
			"date": "2016-09-29",
			"name": "No trading 7"
		},
		{
			"date": "2016-09-30",
			"name": "Day before National Day"
		},
		{
			"date": "2016-10-03",
			"name": "National Day 3"
		},
		{
			"date": "2016-10-04",
			"name": "National Day 4"
		},
		{
			"date": "2016-10-05",
			"name": "National Day 5"
		},
		{
			"date": "2016-10-06",
			"name": "National Day 6"
		},
		{
			"date": "2016-10-07",
			"name": "National Day 7"
		},
		{
			"date": "2016-10-10",
			"name": "Chung Yeung Day*"
		},
		{
			"date": "2016-10-21",
			"name": "Bank/Market Closure 2"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2016-12-27",
			"name": "Christmas Day OBS"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-01-25",
			"name": "No trading 1"
		},
		{
			"date": "2017-01-26",
			"name": "No trading 2"
		},
		{
			"date": "2017-01-27",
			"name": "Lunar NY Eve 1"
		},
		{
			"date": "2017-01-30",
			"name": "Lunar New Year 3"
		},
		{
			"date": "2017-01-31",
			"name": "Lunar New Year 4"
		},
		{
			"date": "2017-02-01",
			"name": "Lunar New Year 5"
		},
		{
			"date": "2017-02-02",
			"name": "Lunar New Year 6"
		},
		{
			"date": "2017-03-30",
			"name": "No trading 3"
		},
		{
			"date": "2017-03-31",
			"name": "No trading 4"
		},
		{
			"date": "2017-04-03",
			"name": "Ching Ming Festival Eve"
		},
		{
			"date": "2017-04-04",
			"name": "Ching Ming Festival"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-05-03",
			"name": "Buddha's Birthday*"
		},
		{
			"date": "2017-05-25",
			"name": "No trading 5"
		},
		{
			"date": "2017-05-26",
			"name": "No trading 6"
		},
		{
			"date": "2017-05-29",
			"name": "Dragon Boat Festival Holiday"
		},
		{
			"date": "2017-05-30",
			"name": "Tuen Ng Day*"
		},
		{
			"date": "2017-05-30",
			"name": "Dragon Boat Festival (Tuen Ng Day)*"
		},
		{
			"date": "2017-08-23",
			"name": "Bank/Market Closure"
		},
		{
			"date": "2017-09-28",
			"name": "No trading 7"
		},
		{
			"date": "2017-09-29",
			"name": "No trading 8"
		},
		{
			"date": "2017-10-02",
			"name": "National Day 2"
		},
		{
			"date": "2017-10-03",
			"name": "National Day 3"
		},
		{
			"date": "2017-10-04",
			"name": "National Day 4"
		},
		{
			"date": "2017-10-04",
			"name": "Mid-autumn Festival*"
		},
		{
			"date": "2017-10-05",
			"name": "National Day 5"
		},
		{
			"date": "2017-10-05",
			"name": "Day Following Mid-autumn Festival*"
		},
		{
			"date": "2017-10-06",
			"name": "National Day 6"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-02-13",
			"name": "No trading 1"
		},
		{
			"date": "2018-02-14",
			"name": "No trading 2"
		},
		{
			"date": "2018-02-15",
			"name": "Lunar NY Eve 1"
		},
		{
			"date": "2018-02-16",
			"name": "Lunar New Year 1"
		},
		{
			"date": "2018-02-19",
			"name": "Lunar New Year 4"
		},
		{
			"date": "2018-02-20",
			"name": "Lunar New Year 5"
		},
		{
			"date": "2018-02-21",
			"name": "Lunar New Year 6"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-04-03",
			"name": "No trading 3"
		},
		{
			"date": "2018-04-04",
			"name": "No trading 4"
		},
		{
			"date": "2018-04-05",
			"name": "Ching Ming Festival"
		},
		{
			"date": "2018-04-06",
			"name": "Ching Ming Festival Holiday"
		},
		{
			"date": "2018-04-26",
			"name": "No trading 5"
		},
		{
			"date": "2018-04-27",
			"name": "No trading 6"
		},
		{
			"date": "2018-04-30",
			"name": "Labour Day Holiday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-05-22",
			"name": "Buddha's Birthday*"
		},
		{
			"date": "2018-06-18",
			"name": "Tuen Ng Day*"
		},
		{
			"date": "2018-06-18",
			"name": "Dragon Boat Festival (Tuen Ng Day)*"
		},
		{
			"date": "2018-07-02",
			"name": "SAR Establishment Day OBS"
		},
		{
			"date": "2018-09-20",
			"name": "No trading 7"
		},
		{
			"date": "2018-09-21",
			"name": "No trading 8"
		},
		{
			"date": "2018-09-24",
			"name": "Mid-autumn Festival*"
		},
		{
			"date": "2018-09-25",
			"name": "Day Following Mid-autumn Festival*"
		},
		{
			"date": "2018-09-27",
			"name": "No trading 9"
		},
		{
			"date": "2018-09-28",
			"name": "No trading 10"
		},
		{
			"date": "2018-10-01",
			"name": "National Day 1"
		},
		{
			"date": "2018-10-02",
			"name": "National Day 2"
		},
		{
			"date": "2018-10-03",
			"name": "National Day 3"
		},
		{
			"date": "2018-10-04",
			"name": "National Day 4"
		},
		{
			"date": "2018-10-05",
			"name": "National Day 5"
		},
		{
			"date": "2018-10-17",
			"name": "Chung Yeung Day*"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-12-31",
			"name": "Additional New Year Holiday"
		}
	],
	"name": "Shanghai-HK Stock Connect (Southbound Trading)",
	"hour_aligned": false
}

CIQ.Market.BVMF = {
	"market_tz": "America/Sao_Paulo",
	"name": "BM&FBOVESPA",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "10:00",
			"close": "16:55"
		},
		{
			"dayofweek": 2,
			"open": "10:00",
			"close": "16:55"
		},
		{
			"dayofweek": 3,
			"open": "10:00",
			"close": "16:55"
		},
		{
			"dayofweek": 4,
			"open": "10:00",
			"close": "16:55"
		},
		{
			"dayofweek": 5,
			"open": "10:00",
			"close": "16:55"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-01-25",
			"name": "Foundation Day"
		},
		{
			"date": "2016-02-08",
			"name": "Carnival Monday"
		},
		{
			"date": "2016-02-09",
			"name": "Carnival Tuesday"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-04-21",
			"name": "Tiradentes Day"
		},
		{
			"date": "2016-05-26",
			"name": "Corpus Christi"
		},
		{
			"date": "2016-09-07",
			"name": "Independence Day"
		},
		{
			"date": "2016-10-12",
			"name": "Our Lady of Aparecida"
		},
		{
			"date": "2016-11-02",
			"name": "All Souls' Day"
		},
		{
			"date": "2016-11-15",
			"name": "Proclamation of Republic"
		},
		{
			"date": "2016-12-30",
			"name": "Last Day of Year OBS"
		},
		{
			"date": "2017-01-25",
			"name": "Foundation Day"
		},
		{
			"date": "2017-02-27",
			"name": "Carnival Monday"
		},
		{
			"date": "2017-02-28",
			"name": "Carnival Tuesday"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-21",
			"name": "Tiradentes Day"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-06-15",
			"name": "Corpus Christi"
		},
		{
			"date": "2017-09-07",
			"name": "Independence Day"
		},
		{
			"date": "2017-10-12",
			"name": "Our Lady of Aparecida"
		},
		{
			"date": "2017-11-02",
			"name": "All Souls' Day"
		},
		{
			"date": "2017-11-15",
			"name": "Proclamation of Republic"
		},
		{
			"date": "2017-11-20",
			"name": "Zumbi dos Palmares Day"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas"
		},
		{
			"date": "2017-12-29",
			"name": "Last Day of Year OBS"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-01-25",
			"name": "Foundation Day"
		},
		{
			"date": "2018-02-12",
			"name": "Carnival Monday"
		},
		{
			"date": "2018-02-13",
			"name": "Carnival Tuesday"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-05-31",
			"name": "Corpus Christi"
		},
		{
			"date": "2018-07-09",
			"name": "Sao Paulo Regional Holiday"
		},
		{
			"date": "2018-09-07",
			"name": "Independence Day"
		},
		{
			"date": "2018-10-12",
			"name": "Our Lady of Aparecida"
		},
		{
			"date": "2018-11-02",
			"name": "All Souls' Day"
		},
		{
			"date": "2018-11-15",
			"name": "Proclamation of Republic"
		},
		{
			"date": "2018-11-20",
			"name": "Zumbi dos Palmares Day"
		},
		{
			"date": "2018-12-24",
			"name": "Christmas Eve"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas"
		},
		{
			"date": "2018-12-31",
			"name": "Last Day of Year"
		},
		{
			"date": "2018-02-14",
			"open": "13:00",
			"close": "17:55"
		}
	]
}

CIQ.Market.WBAH = {
	"market_tz": "Europe/Vienna",
	"name": "Wienerborse - Main market",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 2,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 3,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 4,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 5,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-01-06",
			"name": "Epiphany"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-05-05",
			"name": "Ascension Day"
		},
		{
			"date": "2016-05-16",
			"name": "Whitmonday"
		},
		{
			"date": "2016-05-26",
			"name": "Corpus Christi"
		},
		{
			"date": "2016-08-15",
			"name": "Assumption Day"
		},
		{
			"date": "2016-10-26",
			"name": "National Holiday"
		},
		{
			"date": "2016-11-01",
			"name": "All Saints' Day"
		},
		{
			"date": "2016-12-08",
			"name": "Immaculate Conception"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2017-01-06",
			"name": "Epiphany"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-05-25",
			"name": "Ascension Day"
		},
		{
			"date": "2017-06-05",
			"name": "Whitmonday"
		},
		{
			"date": "2017-06-15",
			"name": "Corpus Christi"
		},
		{
			"date": "2017-08-15",
			"name": "Assumption Day"
		},
		{
			"date": "2017-10-26",
			"name": "National Holiday"
		},
		{
			"date": "2017-11-01",
			"name": "All Saints' Day"
		},
		{
			"date": "2017-12-08",
			"name": "Immaculate Conception"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-05-10",
			"name": "Ascension Day"
		},
		{
			"date": "2018-05-21",
			"name": "Whitmonday"
		},
		{
			"date": "2018-05-31",
			"name": "Corpus Christi"
		},
		{
			"date": "2018-08-15",
			"name": "Assumption Day"
		},
		{
			"date": "2018-10-26",
			"name": "National Holiday"
		},
		{
			"date": "2018-11-01",
			"name": "All Saints' Day"
		},
		{
			"date": "2018-12-24",
			"name": "Christmas Eve"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-12-31",
			"name": "New Year's Eve"
		}
	]
}

CIQ.Market.XAMS = {
	"market_tz": "Europe/Amsterdam",
	"name": "Euronext Amsterdam",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 2,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 3,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 4,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 5,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-12-24",
			"open": "09:00",
			"close": "14:00"
		},
		{
			"date": "2018-12-31",
			"open": "09:00",
			"close": "14:00"
		}
	]
}

CIQ.Market.XASE = {
	"market_tz": "America/New_York",
	"name": "NYSE Amex Equities",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 2,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 3,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 4,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 5,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-01-18",
			"name": "Martin Luther King Jr. Day"
		},
		{
			"date": "2016-02-15",
			"name": "Presidents' Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-05-30",
			"name": "Memorial Day"
		},
		{
			"date": "2016-07-04",
			"name": "Independence Day"
		},
		{
			"date": "2016-09-05",
			"name": "Labor Day"
		},
		{
			"date": "2016-11-24",
			"name": "Thanksgiving"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas OBS"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-01-16",
			"name": "Martin Luther King Jr. Day"
		},
		{
			"date": "2017-02-20",
			"name": "Presidents' Day"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-05-29",
			"name": "Memorial Day"
		},
		{
			"date": "2017-07-04",
			"name": "Independence Day"
		},
		{
			"date": "2017-09-04",
			"name": "Labor Day"
		},
		{
			"date": "2017-11-23",
			"name": "Thanksgiving"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-01-15",
			"name": "Martin Luther King Jr. Day"
		},
		{
			"date": "2018-02-19",
			"name": "Presidents' Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-05-28",
			"name": "Memorial Day"
		},
		{
			"date": "2018-07-04",
			"name": "Independence Day"
		},
		{
			"date": "2018-09-03",
			"name": "Labor Day"
		},
		{
			"date": "2018-11-22",
			"name": "Thanksgiving"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas"
		},
		{
			"date": "2018-07-03",
			"open": "09:30",
			"close": "13:00"
		},
		{
			"date": "2018-11-23",
			"open": "09:30",
			"close": "13:00"
		},
		{
			"date": "2018-12-24",
			"open": "09:30",
			"close": "13:00"
		}
	]
}

CIQ.Market.ETLX = {
	"market_tz": "Europe/Rome",
	"name": "EuroTLX",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 2,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 3,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 4,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 5,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-08-15",
			"name": "Assumption Day"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-08-15",
			"name": "Assumption Day"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-08-15",
			"name": "Assumption Day"
		},
		{
			"date": "2018-12-24",
			"name": "Christmas Eve"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-12-31",
			"name": "New Year's Eve"
		}
	]
}

CIQ.Market.XASX = {
	"market_tz": "Australia/Sydney",
	"name": "ASX (Australian Stock Exchange)",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "10:10",
			"close": "16:00"
		},
		{
			"dayofweek": 2,
			"open": "10:10",
			"close": "16:00"
		},
		{
			"dayofweek": 3,
			"open": "10:10",
			"close": "16:00"
		},
		{
			"dayofweek": 4,
			"open": "10:10",
			"close": "16:00"
		},
		{
			"dayofweek": 5,
			"open": "10:10",
			"close": "16:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-01-26",
			"name": "Australia Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-04-25",
			"name": "ANZAC Day"
		},
		{
			"date": "2016-06-13",
			"name": "Queen's Birthday"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas Day OBS"
		},
		{
			"date": "2016-12-27",
			"name": "Boxing Day OBS"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-01-26",
			"name": "Australia Day"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-04-25",
			"name": "ANZAC Day"
		},
		{
			"date": "2017-06-12",
			"name": "Queen's Birthday"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Boxing Day"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-01-26",
			"name": "Australia Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-04-25",
			"name": "ANZAC Day"
		},
		{
			"date": "2018-06-11",
			"name": "Queen's Birthday"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Boxing Day"
		},
		{
			"date": "2018-12-24",
			"open": "10:10",
			"close": "14:10"
		},
		{
			"date": "2018-12-31",
			"open": "10:10",
			"close": "14:10"
		}
	]
}

CIQ.Market.CHIX = {
	"market_tz": "Asia/Tokyo",
	"name": "Chi-X (All markets)",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "08:00",
			"close": "16:30"
		},
		{
			"dayofweek": 2,
			"open": "08:00",
			"close": "16:30"
		},
		{
			"dayofweek": 3,
			"open": "08:00",
			"close": "16:30"
		},
		{
			"dayofweek": 4,
			"open": "08:00",
			"close": "16:30"
		},
		{
			"dayofweek": 5,
			"open": "08:00",
			"close": "16:30"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-05-01",
			"name": "May Holiday"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-12-24",
			"open": "08:00",
			"close": "12:30"
		},
		{
			"date": "2018-12-31",
			"open": "08:00",
			"close": "12:30"
		}
	]
}

CIQ.Market.XBAR = {
	"market_tz": "Europe/Madrid",
	"name": "Barcelona Stock Exchange",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 2,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 3,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 4,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 5,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-12-24",
			"open": "09:00",
			"close": "14:00"
		},
		{
			"date": "2018-12-31",
			"open": "09:00",
			"close": "14:00"
		}
	]
}

CIQ.Market.TRQX = {
	"market_tz": "Europe/London",
	"name": "Turquoise",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "08:00",
			"close": "16:30"
		},
		{
			"dayofweek": 2,
			"open": "08:00",
			"close": "16:30"
		},
		{
			"dayofweek": 3,
			"open": "08:00",
			"close": "16:30"
		},
		{
			"dayofweek": 4,
			"open": "08:00",
			"close": "16:30"
		},
		{
			"dayofweek": 5,
			"open": "08:00",
			"close": "16:30"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-05-01",
			"name": "May Holiday"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-12-24",
			"open": "08:00",
			"close": "12:30"
		},
		{
			"date": "2018-12-31",
			"open": "08:00",
			"close": "12:30"
		}
	]
}

CIQ.Market.XATH = {
	"market_tz": "Europe/Athens",
	"name": "Athens Stock Exchange",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "10:30",
			"close": "17:20"
		},
		{
			"dayofweek": 2,
			"open": "10:30",
			"close": "17:20"
		},
		{
			"dayofweek": 3,
			"open": "10:30",
			"close": "17:20"
		},
		{
			"dayofweek": 4,
			"open": "10:30",
			"close": "17:20"
		},
		{
			"dayofweek": 5,
			"open": "10:30",
			"close": "17:20"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-01-06",
			"name": "Epiphany"
		},
		{
			"date": "2016-03-14",
			"name": "Shrove Monday (Orthodox)"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-25",
			"name": "National Holiday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-04-29",
			"name": "Good Friday (Orthodox)"
		},
		{
			"date": "2016-05-02",
			"name": "Easter Monday (Orthodox)"
		},
		{
			"date": "2016-05-03",
			"name": "Substitution for Labour Day"
		},
		{
			"date": "2016-06-20",
			"name": "Whitmonday (Orthodox)"
		},
		{
			"date": "2016-08-15",
			"name": "Assumption Day"
		},
		{
			"date": "2016-10-28",
			"name": "National Day"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2017-01-06",
			"name": "Epiphany"
		},
		{
			"date": "2017-02-27",
			"name": "Shrove Monday (Orthodox)"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday (Orthodox)"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday (Orthodox)"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-06-05",
			"name": "Whitmonday (Orthodox)"
		},
		{
			"date": "2017-08-15",
			"name": "Assumption Day"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-02-19",
			"name": "Shrove Monday (Orthodox)"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-04-06",
			"name": "Good Friday (Orthodox)"
		},
		{
			"date": "2018-04-09",
			"name": "Easter Monday (Orthodox)"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-05-28",
			"name": "Whitmonday (Orthodox)"
		},
		{
			"date": "2018-08-15",
			"name": "Assumption Day"
		},
		{
			"date": "2018-12-24",
			"name": "Christmas Eve"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-12-31",
			"open": "10:30",
			"close": "15:20"
		}
	]
}

CIQ.Market.XBCL = {
	"market_tz": "America/Santiago",
	"name": "Bolsa Electronica de Chile",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 2,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 3,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 4,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 5,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-06-27",
			"name": "Saints Peter and Paul OBS"
		},
		{
			"date": "2016-08-15",
			"name": "Assumption Day"
		},
		{
			"date": "2016-09-19",
			"name": "Army Day"
		},
		{
			"date": "2016-10-10",
			"name": "Columbus Day OBS"
		},
		{
			"date": "2016-10-31",
			"name": "Evangelical Church Day"
		},
		{
			"date": "2016-11-01",
			"name": "All Saints' Day"
		},
		{
			"date": "2016-12-08",
			"name": "Immaculate Conception"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-19",
			"name": "Census Day"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-06-26",
			"name": "Saints Peter and Paul OBS"
		},
		{
			"date": "2017-08-15",
			"name": "Assumption Day"
		},
		{
			"date": "2017-09-18",
			"name": "Independence Day"
		},
		{
			"date": "2017-09-19",
			"name": "Army Day"
		},
		{
			"date": "2017-10-09",
			"name": "Columbus Day OBS"
		},
		{
			"date": "2017-10-27",
			"name": "Evangelical Church Day OBS"
		},
		{
			"date": "2017-11-01",
			"name": "All Saints' Day"
		},
		{
			"date": "2017-12-08",
			"name": "Immaculate Conception"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-01-16",
			"name": "Public Holiday 2"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-05-21",
			"name": "Battle of Iquique/Navy Day"
		},
		{
			"date": "2018-07-02",
			"name": "Saints Peter and Paul OBS"
		},
		{
			"date": "2018-07-16",
			"name": "Solemnity of Virgin of Carmen"
		},
		{
			"date": "2018-08-15",
			"name": "Assumption Day"
		},
		{
			"date": "2018-09-17",
			"name": "Public Holiday"
		},
		{
			"date": "2018-09-18",
			"name": "Independence Day"
		},
		{
			"date": "2018-09-19",
			"name": "Army Day"
		},
		{
			"date": "2018-10-15",
			"name": "Columbus Day OBS"
		},
		{
			"date": "2018-11-01",
			"name": "All Saints' Day"
		},
		{
			"date": "2018-11-02",
			"name": "Evangelical Church Day OBS"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-31",
			"name": "Bank Holiday"
		},
		{
			"date": "2018-03-29",
			"open": "09:30",
			"close": "12:30"
		},
		{
			"date": "2018-09-14",
			"open": "09:30",
			"close": "13:30"
		},
		{
			"date": "2018-12-24",
			"open": "09:30",
			"close": "12:30"
		},
		{
			"date": "2018-12-28",
			"open": "09:30",
			"close": "12:30"
		}
	]
}

CIQ.Market.XBEL = {
	"market_tz": "Europe/Belgrade",
	"name": "Belgrade Stock Exchange",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:30",
			"close": "14:00"
		},
		{
			"dayofweek": 2,
			"open": "09:30",
			"close": "14:00"
		},
		{
			"dayofweek": 3,
			"open": "09:30",
			"close": "14:00"
		},
		{
			"dayofweek": 4,
			"open": "09:30",
			"close": "14:00"
		},
		{
			"dayofweek": 5,
			"open": "09:30",
			"close": "14:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-01-07",
			"name": "Christmas Holiday"
		},
		{
			"date": "2016-02-15",
			"name": "Serbian National Day"
		},
		{
			"date": "2016-02-16",
			"name": "Serbian National Day Holiday"
		},
		{
			"date": "2016-04-29",
			"name": "Good Friday (Orthodox)"
		},
		{
			"date": "2016-05-02",
			"name": "Labour Day Holiday"
		},
		{
			"date": "2016-05-02",
			"name": "Easter Monday (Orthodox)"
		},
		{
			"date": "2016-05-03",
			"name": "Labour Day OBS"
		},
		{
			"date": "2016-11-11",
			"name": "Armistice Day"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Holiday"
		},
		{
			"date": "2017-01-03",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-02-15",
			"name": "Serbian National Day"
		},
		{
			"date": "2017-02-16",
			"name": "Serbian National Day Holiday"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday (Orthodox)"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday (Orthodox)"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-05-02",
			"name": "Labour Day Holiday"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-01-02",
			"name": "New Year's Holiday"
		},
		{
			"date": "2018-02-15",
			"name": "Serbian National Day"
		},
		{
			"date": "2018-02-16",
			"name": "Serbian National Day Holiday"
		},
		{
			"date": "2018-04-06",
			"name": "Good Friday (Orthodox)"
		},
		{
			"date": "2018-04-09",
			"name": "Easter Monday (Orthodox)"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-05-02",
			"name": "Labour Day Holiday"
		},
		{
			"date": "2018-11-12",
			"name": "Armistice Day OBS"
		},
		{
			"date": "2018-12-31",
			"name": "Trading Holiday 1"
		}
	]
}

CIQ.Market.XBNV = {
	"market_tz": "America/Costa_Rica",
	"name": "Costa Rica Stock Exchange",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "08:00",
			"close": "17:00"
		},
		{
			"dayofweek": 2,
			"open": "08:00",
			"close": "17:00"
		},
		{
			"dayofweek": 3,
			"open": "08:00",
			"close": "17:00"
		},
		{
			"dayofweek": 4,
			"open": "08:00",
			"close": "17:00"
		},
		{
			"dayofweek": 5,
			"open": "08:00",
			"close": "17:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-03-24",
			"name": "Holy Thursday"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-04-11",
			"name": "Juan Santamaria"
		},
		{
			"date": "2016-07-25",
			"name": "Anniversary of Annexation of Guanacaste"
		},
		{
			"date": "2016-08-02",
			"name": "Our Lady of Los Angeles"
		},
		{
			"date": "2016-08-15",
			"name": "Assumption/Mother's Day"
		},
		{
			"date": "2016-09-15",
			"name": "Independence Day"
		},
		{
			"date": "2016-10-17",
			"name": "Cultures Day OBS"
		},
		{
			"date": "2016-12-23",
			"name": "Christmas Eve OBS"
		},
		{
			"date": "2016-12-26",
			"name": "End of Year Trading Holiday"
		},
		{
			"date": "2016-12-27",
			"name": "End of Year Trading Holiday 2"
		},
		{
			"date": "2016-12-28",
			"name": "End of Year Trading Holiday 3"
		},
		{
			"date": "2016-12-29",
			"name": "End of Year Trading Holiday 4"
		},
		{
			"date": "2016-12-30",
			"name": "End of Year Trading Holiday 5"
		},
		{
			"date": "2017-04-11",
			"name": "Juan Santamaria"
		},
		{
			"date": "2017-04-13",
			"name": "Holy Thursday"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-07-25",
			"name": "Anniversary of Annexation of Guanacaste"
		},
		{
			"date": "2017-08-02",
			"name": "Our Lady of Los Angeles"
		},
		{
			"date": "2017-08-15",
			"name": "Assumption/Mother's Day"
		},
		{
			"date": "2017-09-15",
			"name": "Independence Day"
		},
		{
			"date": "2017-10-16",
			"name": "Cultures Day OBS"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "End of Year Trading Holiday"
		},
		{
			"date": "2017-12-27",
			"name": "End of Year Trading Holiday 2"
		},
		{
			"date": "2017-12-28",
			"name": "End of Year Trading Holiday 3"
		},
		{
			"date": "2017-12-29",
			"name": "End of Year Trading Holiday 4"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-03-29",
			"name": "Holy Thursday"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-11",
			"name": "Juan Santamaria"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-05-08",
			"name": "Election Day"
		},
		{
			"date": "2018-07-25",
			"name": "Anniversary of Annexation of Guanacaste"
		},
		{
			"date": "2018-08-02",
			"name": "Our Lady of Los Angeles"
		},
		{
			"date": "2018-08-15",
			"name": "Assumption/Mother's Day"
		},
		{
			"date": "2018-10-15",
			"name": "Cultures Day OBS"
		},
		{
			"date": "2018-12-24",
			"name": "Christmas Eve"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "End of Year Trading Holiday"
		},
		{
			"date": "2018-12-27",
			"name": "End of Year Trading Holiday 2"
		},
		{
			"date": "2018-12-28",
			"name": "End of Year Trading Holiday 3"
		},
		{
			"date": "2018-12-31",
			"name": "New Year's Eve"
		}
	]
}

CIQ.Market.XBKK = {
	"market_tz": "Asia/Bangkok",
	"rules": [
		{
			"dayofweek": 1,
			"open": "10:00",
			"close": "12:30"
		},
		{
			"dayofweek": 1,
			"open": "14:30",
			"close": "16:30"
		},
		{
			"dayofweek": 2,
			"open": "10:00",
			"close": "12:30"
		},
		{
			"dayofweek": 2,
			"open": "14:30",
			"close": "16:30"
		},
		{
			"dayofweek": 3,
			"open": "10:00",
			"close": "12:30"
		},
		{
			"dayofweek": 3,
			"open": "14:30",
			"close": "16:30"
		},
		{
			"dayofweek": 4,
			"open": "10:00",
			"close": "12:30"
		},
		{
			"dayofweek": 4,
			"open": "14:30",
			"close": "16:30"
		},
		{
			"dayofweek": 5,
			"open": "10:00",
			"close": "12:30"
		},
		{
			"dayofweek": 5,
			"open": "14:30",
			"close": "16:30"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-02-22",
			"name": "Makha Bucha Day*"
		},
		{
			"date": "2016-04-06",
			"name": "Shakri Day"
		},
		{
			"date": "2016-04-13",
			"name": "Songkran Festival 1"
		},
		{
			"date": "2016-04-14",
			"name": "Songkran Festival 2"
		},
		{
			"date": "2016-04-15",
			"name": "Songkran Festival 3"
		},
		{
			"date": "2016-05-02",
			"name": "Labour Day OBS"
		},
		{
			"date": "2016-05-05",
			"name": "Coronation Day"
		},
		{
			"date": "2016-05-06",
			"name": "Special Holiday"
		},
		{
			"date": "2016-05-20",
			"name": "Vishaka Bucha Day*"
		},
		{
			"date": "2016-07-01",
			"name": "Mid-year Bank Holiday"
		},
		{
			"date": "2016-07-18",
			"name": "Special Holiday 2"
		},
		{
			"date": "2016-07-19",
			"name": "Asarnha Bucha Day"
		},
		{
			"date": "2016-08-12",
			"name": "Queen's Birthday"
		},
		{
			"date": "2016-10-24",
			"name": "King Chulalongkorn Memorial Day OBS"
		},
		{
			"date": "2016-12-05",
			"name": "King Rama IX's Birthday"
		},
		{
			"date": "2016-12-12",
			"name": "Constitution Day OBS"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-01-03",
			"name": "New Year Holiday"
		},
		{
			"date": "2017-02-13",
			"name": "Makha Bucha Day*"
		},
		{
			"date": "2017-04-06",
			"name": "Shakri Day"
		},
		{
			"date": "2017-04-13",
			"name": "Songkran Festival 1"
		},
		{
			"date": "2017-04-14",
			"name": "Songkran Festival 2"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-05-10",
			"name": "Vishaka Bucha Day*"
		},
		{
			"date": "2017-07-10",
			"name": "Asarnha Bucha Day"
		},
		{
			"date": "2017-07-28",
			"name": "King's Birthday"
		},
		{
			"date": "2017-08-14",
			"name": "Queen's Birthday OBS"
		},
		{
			"date": "2017-10-13",
			"name": "King Bhumibol Adulyadej Memorial Day"
		},
		{
			"date": "2017-10-23",
			"name": "King Chulalongkorn Memorial Day"
		},
		{
			"date": "2017-10-26",
			"name": "Special Holiday"
		},
		{
			"date": "2017-12-05",
			"name": "King Rama IX's Birthday"
		},
		{
			"date": "2017-12-11",
			"name": "Constitution Day OBS"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-01-02",
			"name": "New Year's Eve OBS"
		},
		{
			"date": "2018-03-01",
			"name": "Makha Bucha Day*"
		},
		{
			"date": "2018-04-06",
			"name": "Shakri Day"
		},
		{
			"date": "2018-04-13",
			"name": "Songkran Festival 1"
		},
		{
			"date": "2018-04-16",
			"name": "Songkran Festival 3 OBS"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-05-29",
			"name": "Vishaka Bucha Day*"
		},
		{
			"date": "2018-07-27",
			"name": "Asarnha Bucha Day"
		},
		{
			"date": "2018-07-30",
			"name": "King's Birthday OBS"
		},
		{
			"date": "2018-08-13",
			"name": "Queen's Birthday OBS"
		},
		{
			"date": "2018-10-15",
			"name": "King Bhumibol Adulyadej Memorial Day OBS"
		},
		{
			"date": "2018-10-23",
			"name": "King Chulalongkorn Memorial Day"
		},
		{
			"date": "2018-12-05",
			"name": "King Rama IX's Birthday"
		},
		{
			"date": "2018-12-10",
			"name": "Constitution Day"
		},
		{
			"date": "2018-12-31",
			"name": "New Year's Eve"
		}
	],
	"name": "Thailand Stock Exchange",
	"hour_aligned": false
}

CIQ.Market.XBOG = {
	"market_tz": "America/Bogota",
	"name": "Colombia Stock Exchange",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "08:30",
			"close": "15:00"
		},
		{
			"dayofweek": 2,
			"open": "08:30",
			"close": "15:00"
		},
		{
			"dayofweek": 3,
			"open": "08:30",
			"close": "15:00"
		},
		{
			"dayofweek": 4,
			"open": "08:30",
			"close": "15:00"
		},
		{
			"dayofweek": 5,
			"open": "08:30",
			"close": "15:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-01-11",
			"name": "Epiphany OBS"
		},
		{
			"date": "2016-03-21",
			"name": "St. Joseph's Day OBS"
		},
		{
			"date": "2016-03-24",
			"name": "Holy Thursday"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-05-09",
			"name": "Ascension"
		},
		{
			"date": "2016-05-30",
			"name": "Corpus Christi"
		},
		{
			"date": "2016-06-06",
			"name": "Sacred Heart"
		},
		{
			"date": "2016-07-04",
			"name": "Sts. Peter and Paul OBS"
		},
		{
			"date": "2016-07-20",
			"name": "Colombian Independence Day"
		},
		{
			"date": "2016-08-15",
			"name": "Assumption Day"
		},
		{
			"date": "2016-10-17",
			"name": "Race Day OBS"
		},
		{
			"date": "2016-11-07",
			"name": "All Saints' Day OBS"
		},
		{
			"date": "2016-11-14",
			"name": "Independence of Cartagena OBS"
		},
		{
			"date": "2016-12-08",
			"name": "Immaculate Conception"
		},
		{
			"date": "2016-12-30",
			"name": "Last business day of year OBS"
		},
		{
			"date": "2017-01-09",
			"name": "Epiphany OBS"
		},
		{
			"date": "2017-03-20",
			"name": "St. Joseph's Day OBS"
		},
		{
			"date": "2017-04-13",
			"name": "Holy Thursday"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-05-29",
			"name": "Ascension"
		},
		{
			"date": "2017-06-19",
			"name": "Corpus Christi"
		},
		{
			"date": "2017-06-26",
			"name": "Sacred Heart"
		},
		{
			"date": "2017-07-03",
			"name": "Sts. Peter and Paul OBS"
		},
		{
			"date": "2017-07-20",
			"name": "Colombian Independence Day"
		},
		{
			"date": "2017-08-07",
			"name": "Battle of Boyaca"
		},
		{
			"date": "2017-08-21",
			"name": "Assumption Day OBS"
		},
		{
			"date": "2017-10-16",
			"name": "Race Day OBS"
		},
		{
			"date": "2017-11-06",
			"name": "All Saints' Day OBS"
		},
		{
			"date": "2017-11-13",
			"name": "Independence of Cartagena OBS"
		},
		{
			"date": "2017-12-08",
			"name": "Immaculate Conception"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas"
		},
		{
			"date": "2017-12-29",
			"name": "Last business day of year OBS"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-01-08",
			"name": "Epiphany OBS"
		},
		{
			"date": "2018-03-19",
			"name": "St. Joseph's Day"
		},
		{
			"date": "2018-03-29",
			"name": "Holy Thursday"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-05-14",
			"name": "Ascension"
		},
		{
			"date": "2018-06-04",
			"name": "Corpus Christi"
		},
		{
			"date": "2018-06-11",
			"name": "Sacred Heart"
		},
		{
			"date": "2018-07-02",
			"name": "Sts. Peter and Paul OBS"
		},
		{
			"date": "2018-07-20",
			"name": "Colombian Independence Day"
		},
		{
			"date": "2018-08-07",
			"name": "Battle of Boyaca"
		},
		{
			"date": "2018-08-20",
			"name": "Assumption Day OBS"
		},
		{
			"date": "2018-10-15",
			"name": "Race Day OBS"
		},
		{
			"date": "2018-11-05",
			"name": "All Saints' Day OBS"
		},
		{
			"date": "2018-11-12",
			"name": "Independence of Cartagena OBS"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas"
		},
		{
			"date": "2018-12-31",
			"name": "Last business day of year"
		}
	]
}

CIQ.Market.XBOM = {
	"market_tz": "Asia/Kolkata",
	"name": "Bombay Stock Exchange",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:15",
			"close": "15:40"
		},
		{
			"dayofweek": 2,
			"open": "09:15",
			"close": "15:40"
		},
		{
			"dayofweek": 3,
			"open": "09:15",
			"close": "15:40"
		},
		{
			"dayofweek": 4,
			"open": "09:15",
			"close": "15:40"
		},
		{
			"dayofweek": 5,
			"open": "09:15",
			"close": "15:40"
		},
		{
			"date": "2016-01-26",
			"name": "Republic Day"
		},
		{
			"date": "2016-03-07",
			"name": "Mahashivratri*"
		},
		{
			"date": "2016-03-24",
			"name": "Holi (2nd day)*"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-04-14",
			"name": "Dr. Babsaheb Ambedkar Jayanti"
		},
		{
			"date": "2016-04-15",
			"name": "Ram Navmi*"
		},
		{
			"date": "2016-04-19",
			"name": "Mahavir Jayanti*"
		},
		{
			"date": "2016-07-06",
			"name": "Ramzan-id (Id-ul-fitar)*"
		},
		{
			"date": "2016-08-15",
			"name": "Independence Day"
		},
		{
			"date": "2016-09-05",
			"name": "Ganesh Chaturthi*"
		},
		{
			"date": "2016-09-13",
			"name": "Bakri-id*"
		},
		{
			"date": "2016-10-11",
			"name": "Dasara*"
		},
		{
			"date": "2016-10-12",
			"name": "Moharrum*"
		},
		{
			"date": "2016-10-31",
			"name": "Diwali (Bali Pratipada)"
		},
		{
			"date": "2016-11-14",
			"name": "Guru Nanak Jayanti*"
		},
		{
			"date": "2017-01-26",
			"name": "Republic Day"
		},
		{
			"date": "2017-02-24",
			"name": "Mahashivratri*"
		},
		{
			"date": "2017-03-13",
			"name": "Holi (2nd day)*"
		},
		{
			"date": "2017-04-04",
			"name": "Ram Navmi*"
		},
		{
			"date": "2017-04-14",
			"name": "Dr. Babsaheb Ambedkar Jayanti"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-05-01",
			"name": "Maharashtra or May Day"
		},
		{
			"date": "2017-06-26",
			"name": "Ramzan-id (Id-ul-fitar)*"
		},
		{
			"date": "2017-08-15",
			"name": "Independence Day"
		},
		{
			"date": "2017-08-25",
			"name": "Ganesh Chaturthi*"
		},
		{
			"date": "2017-10-02",
			"name": "Mahatma Gandhi's Birthday"
		},
		{
			"date": "2017-10-19",
			"name": "Diwali Amavasya (Muhurat trading)*"
		},
		{
			"date": "2017-10-20",
			"name": "Diwali (Bali Pratipada)"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-01-26",
			"name": "Republic Day"
		},
		{
			"date": "2018-02-13",
			"name": "Mahashivratri*"
		},
		{
			"date": "2018-03-02",
			"name": "Holi (2nd day)*"
		},
		{
			"date": "2018-03-29",
			"name": "Mahavir Jayanti*"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-05-01",
			"name": "Maharashtra or May Day"
		},
		{
			"date": "2018-08-15",
			"name": "Independence Day"
		},
		{
			"date": "2018-08-22",
			"name": "Bakri-id*"
		},
		{
			"date": "2018-09-13",
			"name": "Ganesh Chaturthi*"
		},
		{
			"date": "2018-09-20",
			"name": "Moharrum*"
		},
		{
			"date": "2018-10-02",
			"name": "Mahatma Gandhi's Birthday"
		},
		{
			"date": "2018-10-18",
			"name": "Dasara*"
		},
		{
			"date": "2018-11-07",
			"name": "Diwali Amavasya (Muhurat trading)*"
		},
		{
			"date": "2018-11-08",
			"name": "Diwali (Bali Pratipada)"
		},
		{
			"date": "2018-11-23",
			"name": "Guru Nanak Jayanti*"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		}
	]
}

CIQ.Market.XBRU = {
	"market_tz": "Europe/Brussels",
	"name": "Euronext Brussels",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 2,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 3,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 4,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 5,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-12-24",
			"open": "09:00",
			"close": "14:00"
		},
		{
			"date": "2018-12-31",
			"open": "09:00",
			"close": "14:00"
		}
	]
}

CIQ.Market.XBSE = {
	"market_tz": "Europe/Bucharest",
	"name": "Bucharest Stock Exchange",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:45",
			"close": "17:55"
		},
		{
			"dayofweek": 2,
			"open": "09:45",
			"close": "17:55"
		},
		{
			"dayofweek": 3,
			"open": "09:45",
			"close": "17:55"
		},
		{
			"dayofweek": 4,
			"open": "09:45",
			"close": "17:55"
		},
		{
			"dayofweek": 5,
			"open": "09:45",
			"close": "17:55"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-05-02",
			"name": "Easter Monday (Orthodox)"
		},
		{
			"date": "2016-06-20",
			"name": "Pentecost Monday (Orthodox)"
		},
		{
			"date": "2016-08-15",
			"name": "Assumption Day"
		},
		{
			"date": "2016-11-30",
			"name": "St. Andrew's Day"
		},
		{
			"date": "2016-12-01",
			"name": "National Holiday"
		},
		{
			"date": "2016-12-26",
			"name": "Boxing Day"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Holiday"
		},
		{
			"date": "2017-01-24",
			"name": "Anniversary of Romanian Principalities Union"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday (Orthodox)"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-06-01",
			"name": "Children's Day"
		},
		{
			"date": "2017-06-02",
			"name": "Trading Holiday 1"
		},
		{
			"date": "2017-06-05",
			"name": "Pentecost Monday (Orthodox)"
		},
		{
			"date": "2017-08-15",
			"name": "Assumption Day"
		},
		{
			"date": "2017-11-30",
			"name": "St. Andrew's Day"
		},
		{
			"date": "2017-12-01",
			"name": "National Holiday"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Boxing Day"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-01-02",
			"name": "New Year's Holiday"
		},
		{
			"date": "2018-01-24",
			"name": "Anniversary of Romanian Principalities Union"
		},
		{
			"date": "2018-04-09",
			"name": "Easter Monday (Orthodox)"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-05-28",
			"name": "Pentecost Monday (Orthodox)"
		},
		{
			"date": "2018-06-01",
			"name": "Children's Day"
		},
		{
			"date": "2018-08-15",
			"name": "Assumption Day"
		},
		{
			"date": "2018-11-30",
			"name": "St. Andrew's Day"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Boxing Day"
		},
		{
			"date": "2018-12-31",
			"name": "New Year's Eve"
		}
	]
}

CIQ.Market.XBUE = {
	"market_tz": "America/Argentina/Buenos_Aires",
	"name": "Buenos Aires Bolsa de Comercio",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "11:00",
			"close": "17:00"
		},
		{
			"dayofweek": 2,
			"open": "11:00",
			"close": "17:00"
		},
		{
			"dayofweek": 3,
			"open": "11:00",
			"close": "17:00"
		},
		{
			"dayofweek": 4,
			"open": "11:00",
			"close": "17:00"
		},
		{
			"dayofweek": 5,
			"open": "11:00",
			"close": "17:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-02-08",
			"name": "Carnival Monday"
		},
		{
			"date": "2016-02-09",
			"name": "Carnival Tuesday"
		},
		{
			"date": "2016-03-24",
			"name": "Holy Thursday"
		},
		{
			"date": "2016-03-24",
			"name": "Truth and Justice Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-05-25",
			"name": "National Holiday"
		},
		{
			"date": "2016-06-17",
			"name": "Martin Miguel de Guemes Day"
		},
		{
			"date": "2016-06-20",
			"name": "Flag Day"
		},
		{
			"date": "2016-07-08",
			"name": "Bridge Holiday 1"
		},
		{
			"date": "2016-08-15",
			"name": "Anniversary of the Death of General San Martin"
		},
		{
			"date": "2016-10-10",
			"name": "Day of Respect for Cultural Diversity"
		},
		{
			"date": "2016-11-28",
			"name": "National Sovereignty Day"
		},
		{
			"date": "2016-12-08",
			"name": "Immaculate Conception"
		},
		{
			"date": "2016-12-09",
			"name": "Bridge Holiday 2"
		},
		{
			"date": "2016-12-30",
			"name": "Last business day of year OBS"
		},
		{
			"date": "2017-02-27",
			"name": "Carnival Monday"
		},
		{
			"date": "2017-02-28",
			"name": "Carnival Tuesday"
		},
		{
			"date": "2017-03-24",
			"name": "Truth and Justice Day"
		},
		{
			"date": "2017-04-13",
			"name": "Holy Thursday"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-05-01",
			"name": "Workers' Day"
		},
		{
			"date": "2017-05-25",
			"name": "National Holiday"
		},
		{
			"date": "2017-06-20",
			"name": "Flag Day"
		},
		{
			"date": "2017-08-21",
			"name": "Anniversary of the Death of General San Martin OBS"
		},
		{
			"date": "2017-10-16",
			"name": "Day of Respect for Cultural Diversity OBS"
		},
		{
			"date": "2017-11-06",
			"name": "Bank Holiday"
		},
		{
			"date": "2017-11-20",
			"name": "National Sovereignty Day"
		},
		{
			"date": "2017-12-08",
			"name": "Immaculate Conception"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-02-12",
			"name": "Carnival Monday"
		},
		{
			"date": "2018-02-13",
			"name": "Carnival Tuesday"
		},
		{
			"date": "2018-03-29",
			"name": "Holy Thursday"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Malvinas Islands Memorial"
		},
		{
			"date": "2018-04-30",
			"name": "Bridge Holiday 1"
		},
		{
			"date": "2018-05-01",
			"name": "Workers' Day"
		},
		{
			"date": "2018-05-25",
			"name": "National Holiday"
		},
		{
			"date": "2018-06-20",
			"name": "Flag Day"
		},
		{
			"date": "2018-07-09",
			"name": "Independence Day"
		},
		{
			"date": "2018-08-20",
			"name": "Anniversary of the Death of General San Martin OBS"
		},
		{
			"date": "2018-10-15",
			"name": "Day of Respect for Cultural Diversity OBS"
		},
		{
			"date": "2018-11-06",
			"name": "Bank Holiday"
		},
		{
			"date": "2018-11-19",
			"name": "National Sovereignty Day OBS"
		},
		{
			"date": "2018-12-24",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-31",
			"name": "New Year's Holiday"
		}
	]
}

CIQ.Market.XBER = {
	"market_tz": "Europe/Berlin",
	"name": "Berlin Stock Exchange",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "08:00",
			"close": "20:00"
		},
		{
			"dayofweek": 2,
			"open": "08:00",
			"close": "20:00"
		},
		{
			"dayofweek": 3,
			"open": "08:00",
			"close": "20:00"
		},
		{
			"dayofweek": 4,
			"open": "08:00",
			"close": "20:00"
		},
		{
			"dayofweek": 5,
			"open": "08:00",
			"close": "20:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-12-24",
			"name": "Christmas Eve"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-12-31",
			"name": "New Year's Eve"
		},
		{
			"date": "2018-12-28",
			"open": "08:00",
			"close": "14:00"
		}
	]
}

CIQ.Market.XCAS = {
	"market_tz": "Africa/Casablanca",
	"name": "Casablanca Stock Exchange",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:30",
			"close": "15:30"
		},
		{
			"dayofweek": 2,
			"open": "09:30",
			"close": "15:30"
		},
		{
			"dayofweek": 3,
			"open": "09:30",
			"close": "15:30"
		},
		{
			"dayofweek": 4,
			"open": "09:30",
			"close": "15:30"
		},
		{
			"dayofweek": 5,
			"open": "09:30",
			"close": "15:30"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-01-11",
			"name": "National Holiday"
		},
		{
			"date": "2016-07-06",
			"name": "Eid al-Fitr 1*"
		},
		{
			"date": "2016-07-07",
			"name": "Eid al-Fitr 2*"
		},
		{
			"date": "2016-07-08",
			"name": "Eid al-Fitr 3*"
		},
		{
			"date": "2016-09-12",
			"name": "Eid al-Adha 1*"
		},
		{
			"date": "2016-09-13",
			"name": "Eid al-Adha 2*"
		},
		{
			"date": "2016-10-03",
			"name": "Islamic (Hijri) New Year*"
		},
		{
			"date": "2016-11-18",
			"name": "Independence Day"
		},
		{
			"date": "2016-12-12",
			"name": "Prophet's Birthday 1*"
		},
		{
			"date": "2016-12-13",
			"name": "Prophet's Birthday 2*"
		},
		{
			"date": "2017-01-11",
			"name": "National Holiday"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-06-26",
			"name": "Eid al-Fitr 1*"
		},
		{
			"date": "2017-06-27",
			"name": "Eid al-Fitr 2*"
		},
		{
			"date": "2017-08-14",
			"name": "Oued Eddahab"
		},
		{
			"date": "2017-08-21",
			"name": "Youth Day"
		},
		{
			"date": "2017-09-01",
			"name": "Eid al-Adha 1*"
		},
		{
			"date": "2017-09-22",
			"name": "Islamic (Hijri) New Year*"
		},
		{
			"date": "2017-11-06",
			"name": "Green March Day"
		},
		{
			"date": "2017-12-01",
			"name": "Prophet's Birthday 1*"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-01-11",
			"name": "National Holiday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-06-15",
			"name": "Eid al-Fitr 1*"
		},
		{
			"date": "2018-07-30",
			"name": "Feast of the Throne"
		},
		{
			"date": "2018-08-14",
			"name": "Oued Eddahab"
		},
		{
			"date": "2018-08-20",
			"name": "Revolution of King and People"
		},
		{
			"date": "2018-08-21",
			"name": "Youth Day"
		},
		{
			"date": "2018-08-22",
			"name": "Eid al-Adha 1*"
		},
		{
			"date": "2018-08-23",
			"name": "Eid al-Adha 2*"
		},
		{
			"date": "2018-09-11",
			"name": "Islamic (Hijri) New Year*"
		},
		{
			"date": "2018-11-06",
			"name": "Green March Day"
		},
		{
			"date": "2018-11-20",
			"name": "Prophet's Birthday 1*"
		},
		{
			"date": "2018-11-21",
			"name": "Prophet's Birthday 2*"
		}
	]
}

CIQ.Market.XCHG = {
	"market_tz": "Asia/Dhaka",
	"name": "Chittagong Stock Exchange",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "10:30",
			"close": "14:40"
		},
		{
			"dayofweek": 2,
			"open": "10:30",
			"close": "14:40"
		},
		{
			"dayofweek": 3,
			"open": "10:30",
			"close": "14:40"
		},
		{
			"dayofweek": 4,
			"open": "10:30",
			"close": "14:40"
		},
		{
			"dayofweek": 5,
			"open": "10:30",
			"close": "14:40"
		},
		{
			"date": "2016-02-21",
			"name": "Shahid/Martyrs Day"
		},
		{
			"date": "2016-03-17",
			"name": "Birthday of Father of the Nation"
		},
		{
			"date": "2016-04-14",
			"name": "Bengali New Year"
		},
		{
			"date": "2016-05-01",
			"name": "May Day"
		},
		{
			"date": "2016-05-23",
			"name": "Shab-e-Barat*"
		},
		{
			"date": "2016-07-03",
			"name": "Shab-e-Qadar*"
		},
		{
			"date": "2016-07-04",
			"name": "Eid al-Fitr Closing"
		},
		{
			"date": "2016-07-05",
			"name": "Eid-ul Fitr Holiday"
		},
		{
			"date": "2016-07-06",
			"name": "Eid-ul -Fitr 1*"
		},
		{
			"date": "2016-07-07",
			"name": "Eid-ul Fitr 2*"
		},
		{
			"date": "2016-08-15",
			"name": "National Mourning Day"
		},
		{
			"date": "2016-08-25",
			"name": "Janmastami*"
		},
		{
			"date": "2016-09-11",
			"name": "Eid-ul Azha 1*"
		},
		{
			"date": "2016-09-12",
			"name": "Eid-ul Azha 2*"
		},
		{
			"date": "2016-09-13",
			"name": "Eid-ul Azha 3*"
		},
		{
			"date": "2016-09-14",
			"name": "Eid-ul Azha Holiday*"
		},
		{
			"date": "2016-09-15",
			"name": "Eid-ul Azha Holiday"
		},
		{
			"date": "2016-10-11",
			"name": "Durga Puja*"
		},
		{
			"date": "2016-10-12",
			"name": "Ashura (Muharram)*"
		},
		{
			"date": "2016-12-13",
			"name": "Eid-e-Milad-un-Nabi*"
		},
		{
			"date": "2016-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-02-21",
			"name": "Shahid/Martyrs Day"
		},
		{
			"date": "2017-03-26",
			"name": "Independence/National Day"
		},
		{
			"date": "2017-05-01",
			"name": "May Day"
		},
		{
			"date": "2017-05-10",
			"name": "Buddha Purnima*"
		},
		{
			"date": "2017-06-25",
			"name": "Eid-ul -Fitr 1*"
		},
		{
			"date": "2017-06-26",
			"name": "Eid-ul Fitr 2*"
		},
		{
			"date": "2017-06-27",
			"name": "Eid-ul Fitr 3*"
		},
		{
			"date": "2017-08-14",
			"name": "Janmastami*"
		},
		{
			"date": "2017-08-15",
			"name": "National Mourning Day"
		},
		{
			"date": "2017-09-03",
			"name": "Eid-ul Azha 3*"
		},
		{
			"date": "2017-10-01",
			"name": "Ashura (Muharram)*"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-31",
			"name": "Year-end Bank Holiday"
		},
		{
			"date": "2018-02-21",
			"name": "Shahid/Martyrs Day"
		},
		{
			"date": "2018-03-26",
			"name": "Independence/National Day"
		},
		{
			"date": "2018-04-29",
			"name": "Buddha Purnima*"
		},
		{
			"date": "2018-05-01",
			"name": "May Day"
		},
		{
			"date": "2018-05-02",
			"name": "Shab-e-Barat*"
		},
		{
			"date": "2018-06-12",
			"name": "Shab-e-Qadar*"
		},
		{
			"date": "2018-06-17",
			"name": "Eid-ul Fitr 3*"
		},
		{
			"date": "2018-07-01",
			"name": "Mid-year Bank Holiday"
		},
		{
			"date": "2018-08-15",
			"name": "National Mourning Day"
		},
		{
			"date": "2018-08-21",
			"name": "Eid-ul Azha 1*"
		},
		{
			"date": "2018-08-22",
			"name": "Eid-ul Azha 2*"
		},
		{
			"date": "2018-08-23",
			"name": "Eid-ul Azha 3*"
		},
		{
			"date": "2018-09-02",
			"name": "Janmastami*"
		},
		{
			"date": "2018-11-21",
			"name": "Eid-e-Milad-un-Nabi*"
		},
		{
			"date": "2018-12-16",
			"name": "Victory Day"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-31",
			"name": "Year-end Bank Holiday"
		}
	]
}

CIQ.Market.XBIL = {
	"market_tz": "Europe/Madrid",
	"name": "Bilbao Stock Exchange",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 2,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 3,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 4,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 5,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-12-24",
			"open": "09:00",
			"close": "14:00"
		},
		{
			"date": "2018-12-31",
			"open": "09:00",
			"close": "14:00"
		}
	]
}

CIQ.Market.XCHI = {
	"market_tz": "America/Chicago",
	"name": "Chicago Stock Exchange",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "08:30",
			"close": "15:00"
		},
		{
			"dayofweek": 2,
			"open": "08:30",
			"close": "15:00"
		},
		{
			"dayofweek": 3,
			"open": "08:30",
			"close": "15:00"
		},
		{
			"dayofweek": 4,
			"open": "08:30",
			"close": "15:00"
		},
		{
			"dayofweek": 5,
			"open": "08:30",
			"close": "15:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-01-18",
			"name": "Martin Luther King Jr. Day"
		},
		{
			"date": "2016-02-15",
			"name": "Presidents' Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-05-30",
			"name": "Memorial Day"
		},
		{
			"date": "2016-07-04",
			"name": "Independence Day"
		},
		{
			"date": "2016-09-05",
			"name": "Labor Day"
		},
		{
			"date": "2016-11-24",
			"name": "Thanksgiving"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas OBS"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-01-16",
			"name": "Martin Luther King Jr. Day"
		},
		{
			"date": "2017-02-20",
			"name": "Presidents' Day"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-05-29",
			"name": "Memorial Day"
		},
		{
			"date": "2017-07-04",
			"name": "Independence Day"
		},
		{
			"date": "2017-09-04",
			"name": "Labor Day"
		},
		{
			"date": "2017-11-23",
			"name": "Thanksgiving"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-01-15",
			"name": "Martin Luther King Jr. Day"
		},
		{
			"date": "2018-02-19",
			"name": "Presidents' Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-05-28",
			"name": "Memorial Day"
		},
		{
			"date": "2018-07-04",
			"name": "Independence Day"
		},
		{
			"date": "2018-09-03",
			"name": "Labor Day"
		},
		{
			"date": "2018-11-22",
			"name": "Thanksgiving"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas"
		},
		{
			"date": "2018-07-03",
			"open": "08:30",
			"close": "12:00"
		},
		{
			"date": "2018-11-23",
			"open": "08:30",
			"close": "12:00"
		},
		{
			"date": "2018-12-24",
			"open": "08:30",
			"close": "12:00"
		}
	]
}

CIQ.Market.XCSE = {
	"market_tz": "Europe/Copenhagen",
	"name": "OMX Nordic Exchange Copenhagen",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:00",
			"close": "17:00"
		},
		{
			"dayofweek": 2,
			"open": "09:00",
			"close": "17:00"
		},
		{
			"dayofweek": 3,
			"open": "09:00",
			"close": "17:00"
		},
		{
			"dayofweek": 4,
			"open": "09:00",
			"close": "17:00"
		},
		{
			"dayofweek": 5,
			"open": "09:00",
			"close": "17:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-03-24",
			"name": "Holy Thursday"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-04-22",
			"name": "General Prayer Day"
		},
		{
			"date": "2016-05-05",
			"name": "Ascension Day"
		},
		{
			"date": "2016-05-06",
			"name": "Day After Ascension"
		},
		{
			"date": "2016-05-16",
			"name": "Whitmonday"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2017-04-13",
			"name": "Holy Thursday"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-05-12",
			"name": "General Prayer Day"
		},
		{
			"date": "2017-05-25",
			"name": "Ascension Day"
		},
		{
			"date": "2017-05-26",
			"name": "Day After Ascension"
		},
		{
			"date": "2017-06-05",
			"name": "Constitution Day"
		},
		{
			"date": "2017-06-05",
			"name": "Whitmonday"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-03-29",
			"name": "Holy Thursday"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-04-27",
			"name": "General Prayer Day"
		},
		{
			"date": "2018-05-10",
			"name": "Ascension Day"
		},
		{
			"date": "2018-05-11",
			"name": "Day After Ascension"
		},
		{
			"date": "2018-05-21",
			"name": "Whitmonday"
		},
		{
			"date": "2018-06-05",
			"name": "Constitution Day"
		},
		{
			"date": "2018-12-24",
			"name": "Christmas Eve"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-12-31",
			"name": "New Year's Eve"
		}
	]
}

CIQ.Market.XDHA = {
	"market_tz": "Asia/Dhaka",
	"name": "Dhaka Stock Exchange",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "10:30",
			"close": "14:30"
		},
		{
			"dayofweek": 2,
			"open": "10:30",
			"close": "14:30"
		},
		{
			"dayofweek": 3,
			"open": "10:30",
			"close": "14:30"
		},
		{
			"dayofweek": 4,
			"open": "10:30",
			"close": "14:30"
		},
		{
			"dayofweek": 5,
			"open": "10:30",
			"close": "14:30"
		},
		{
			"date": "2016-02-21",
			"name": "Shahid/Martyrs Day"
		},
		{
			"date": "2016-03-17",
			"name": "Birthday of Father of the Nation"
		},
		{
			"date": "2016-04-14",
			"name": "Bengali New Year"
		},
		{
			"date": "2016-05-01",
			"name": "May Day"
		},
		{
			"date": "2016-05-23",
			"name": "Shab-e-Barat*"
		},
		{
			"date": "2016-07-03",
			"name": "Shab-e-Qadar*"
		},
		{
			"date": "2016-07-04",
			"name": "Eid al-Fitr Closing"
		},
		{
			"date": "2016-07-05",
			"name": "Eid-ul Fitr Holiday"
		},
		{
			"date": "2016-07-06",
			"name": "Eid-ul -Fitr 1*"
		},
		{
			"date": "2016-07-07",
			"name": "Eid-ul Fitr 2*"
		},
		{
			"date": "2016-08-15",
			"name": "National Mourning Day"
		},
		{
			"date": "2016-08-25",
			"name": "Janmastami*"
		},
		{
			"date": "2016-09-11",
			"name": "Eid-ul Azha 1*"
		},
		{
			"date": "2016-09-12",
			"name": "Eid-ul Azha 2*"
		},
		{
			"date": "2016-09-13",
			"name": "Eid-ul Azha 3*"
		},
		{
			"date": "2016-09-14",
			"name": "Eid-ul Azha Holiday*"
		},
		{
			"date": "2016-09-15",
			"name": "Eid-ul Azha Holiday"
		},
		{
			"date": "2016-10-11",
			"name": "Durga Puja*"
		},
		{
			"date": "2016-10-12",
			"name": "Ashura (Muharram)*"
		},
		{
			"date": "2016-12-13",
			"name": "Eid-e-Milad-un-Nabi*"
		},
		{
			"date": "2016-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-02-21",
			"name": "Shahid/Martyrs Day"
		},
		{
			"date": "2017-03-26",
			"name": "Independence/National Day"
		},
		{
			"date": "2017-05-01",
			"name": "May Day"
		},
		{
			"date": "2017-05-10",
			"name": "Buddha Purnima*"
		},
		{
			"date": "2017-06-25",
			"name": "Eid-ul -Fitr 1*"
		},
		{
			"date": "2017-06-26",
			"name": "Eid-ul Fitr 2*"
		},
		{
			"date": "2017-06-27",
			"name": "Eid-ul Fitr 3*"
		},
		{
			"date": "2017-08-14",
			"name": "Janmastami*"
		},
		{
			"date": "2017-08-15",
			"name": "National Mourning Day"
		},
		{
			"date": "2017-09-03",
			"name": "Eid-ul Azha 3*"
		},
		{
			"date": "2017-10-01",
			"name": "Ashura (Muharram)*"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-31",
			"name": "Year-end Bank Holiday"
		},
		{
			"date": "2018-02-21",
			"name": "Shahid/Martyrs Day"
		},
		{
			"date": "2018-03-26",
			"name": "Independence/National Day"
		},
		{
			"date": "2018-04-29",
			"name": "Buddha Purnima*"
		},
		{
			"date": "2018-05-01",
			"name": "May Day"
		},
		{
			"date": "2018-05-02",
			"name": "Shab-e-Barat*"
		},
		{
			"date": "2018-06-12",
			"name": "Shab-e-Qadar*"
		},
		{
			"date": "2018-06-17",
			"name": "Eid-ul Fitr 3*"
		},
		{
			"date": "2018-07-01",
			"name": "Mid-year Bank Holiday"
		},
		{
			"date": "2018-08-15",
			"name": "National Mourning Day"
		},
		{
			"date": "2018-08-21",
			"name": "Eid-ul Azha 1*"
		},
		{
			"date": "2018-08-22",
			"name": "Eid-ul Azha 2*"
		},
		{
			"date": "2018-08-23",
			"name": "Eid-ul Azha 3*"
		},
		{
			"date": "2018-09-02",
			"name": "Janmastami*"
		},
		{
			"date": "2018-11-21",
			"name": "Eid-e-Milad-un-Nabi*"
		},
		{
			"date": "2018-12-16",
			"name": "Victory Day"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-31",
			"name": "Year-end Bank Holiday"
		}
	]
}

CIQ.Market.XDUS = {
	"market_tz": "Europe/Berlin",
	"name": "Dusseldorf Stock Exchange",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "08:00",
			"close": "20:00"
		},
		{
			"dayofweek": 2,
			"open": "08:00",
			"close": "20:00"
		},
		{
			"dayofweek": 3,
			"open": "08:00",
			"close": "20:00"
		},
		{
			"dayofweek": 4,
			"open": "08:00",
			"close": "20:00"
		},
		{
			"dayofweek": 5,
			"open": "08:00",
			"close": "20:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-12-24",
			"name": "Christmas Eve"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-12-31",
			"name": "New Year's Eve"
		},
		{
			"date": "2018-12-28",
			"open": "08:00",
			"close": "14:00"
		}
	]
}

CIQ.Market.XETR = {
	"market_tz": "Europe/Berlin",
	"name": "XETRA",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 2,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 3,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 4,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 5,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-05-16",
			"name": "Whitmonday"
		},
		{
			"date": "2016-10-03",
			"name": "National Day"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-06-05",
			"name": "Whitmonday"
		},
		{
			"date": "2017-10-03",
			"name": "National Day"
		},
		{
			"date": "2017-10-31",
			"name": "Reformation Day 500th Anniversary"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-05-21",
			"name": "Whitmonday"
		},
		{
			"date": "2018-12-24",
			"name": "Christmas Eve"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-12-31",
			"name": "New Year's Eve"
		},
		{
			"date": "2018-12-28",
			"open": "09:00",
			"close": "14:00"
		}
	]
}

CIQ.Market.XEUR = {
	"market_tz": "Europe/Berlin",
	"rules": [
		{
			"dayofweek": 1,
			"open": "08:30",
			"close": "17:00"
		},
		{
			"dayofweek": 2,
			"open": "08:30",
			"close": "17:00"
		},
		{
			"dayofweek": 3,
			"open": "08:30",
			"close": "17:00"
		},
		{
			"dayofweek": 4,
			"open": "08:30",
			"close": "17:00"
		},
		{
			"dayofweek": 5,
			"open": "08:30",
			"close": "17:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-12-24",
			"name": "Christmas Eve"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-12-31",
			"name": "New Year's Eve"
		}
	],
	"name": "Eurex (All Products ex. German and Swiss)",
	"hour_aligned": false
}

CIQ.Market.XDUB = {
	"market_tz": "Europe/Dublin",
	"name": "Irish Stock Exchange",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "08:00",
			"close": "16:30"
		},
		{
			"dayofweek": 2,
			"open": "08:00",
			"close": "16:30"
		},
		{
			"dayofweek": 3,
			"open": "08:00",
			"close": "16:30"
		},
		{
			"dayofweek": 4,
			"open": "08:00",
			"close": "16:30"
		},
		{
			"dayofweek": 5,
			"open": "08:00",
			"close": "16:30"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-05-02",
			"name": "May Bank Holiday"
		},
		{
			"date": "2016-06-06",
			"name": "June Bank Holiday"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas Day OBS"
		},
		{
			"date": "2016-12-27",
			"name": "St. Stephen's Day OBS"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-05-01",
			"name": "May Bank Holiday"
		},
		{
			"date": "2017-06-05",
			"name": "June Bank Holiday"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "St. Stephen's Day"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-05-07",
			"name": "May Bank Holiday"
		},
		{
			"date": "2018-06-04",
			"name": "June Bank Holiday"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "St. Stephen's Day"
		},
		{
			"date": "2018-12-24",
			"open": "08:00",
			"close": "12:30"
		},
		{
			"date": "2018-12-31",
			"open": "08:00",
			"close": "12:30"
		}
	]
}

CIQ.Market.XFRA = {
	"market_tz": "Europe/Berlin",
	"name": "German Deutscheboerse",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "08:00",
			"close": "20:00"
		},
		{
			"dayofweek": 2,
			"open": "08:00",
			"close": "20:00"
		},
		{
			"dayofweek": 3,
			"open": "08:00",
			"close": "20:00"
		},
		{
			"dayofweek": 4,
			"open": "08:00",
			"close": "20:00"
		},
		{
			"dayofweek": 5,
			"open": "08:00",
			"close": "20:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-05-16",
			"name": "Whitmonday"
		},
		{
			"date": "2016-10-03",
			"name": "National Day"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-06-05",
			"name": "Whitmonday"
		},
		{
			"date": "2017-10-03",
			"name": "National Day"
		},
		{
			"date": "2017-10-31",
			"name": "Reformation Day 500th Anniversary"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-05-21",
			"name": "Whitmonday"
		},
		{
			"date": "2018-12-24",
			"name": "Christmas Eve"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-12-31",
			"name": "New Year's Eve"
		},
		{
			"date": "2018-12-28",
			"open": "08:00",
			"close": "14:00"
		}
	]
}

CIQ.Market.XHAM = {
	"market_tz": "Europe/Berlin",
	"name": "Hamburg Stock Exchange",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "08:00",
			"close": "20:00"
		},
		{
			"dayofweek": 2,
			"open": "08:00",
			"close": "20:00"
		},
		{
			"dayofweek": 3,
			"open": "08:00",
			"close": "20:00"
		},
		{
			"dayofweek": 4,
			"open": "08:00",
			"close": "20:00"
		},
		{
			"dayofweek": 5,
			"open": "08:00",
			"close": "20:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-05-16",
			"name": "May Holiday"
		},
		{
			"date": "2016-10-03",
			"name": "National Day"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-06-05",
			"name": "Whitmonday"
		},
		{
			"date": "2017-10-03",
			"name": "National Day"
		},
		{
			"date": "2017-10-31",
			"name": "Reformation Day 500th Anniversary"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-05-21",
			"name": "Whitmonday"
		},
		{
			"date": "2018-12-24",
			"name": "Christmas Eve"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-12-31",
			"name": "New Year's Eve"
		},
		{
			"date": "2018-12-28",
			"open": "08:00",
			"close": "14:00"
		}
	]
}

CIQ.Market.XHAN = {
	"market_tz": "Europe/Berlin",
	"name": "Hanover Stock Exchange",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "08:00",
			"close": "20:00"
		},
		{
			"dayofweek": 2,
			"open": "08:00",
			"close": "20:00"
		},
		{
			"dayofweek": 3,
			"open": "08:00",
			"close": "20:00"
		},
		{
			"dayofweek": 4,
			"open": "08:00",
			"close": "20:00"
		},
		{
			"dayofweek": 5,
			"open": "08:00",
			"close": "20:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-05-16",
			"name": "May Holiday"
		},
		{
			"date": "2016-10-03",
			"name": "National Day"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-06-05",
			"name": "Whitmonday"
		},
		{
			"date": "2017-10-03",
			"name": "National Day"
		},
		{
			"date": "2017-10-31",
			"name": "Reformation Day 500th Anniversary"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-05-21",
			"name": "Whitmonday"
		},
		{
			"date": "2018-12-24",
			"name": "Christmas Eve"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-12-31",
			"name": "New Year's Eve"
		},
		{
			"date": "2018-12-28",
			"open": "08:00",
			"close": "14:00"
		}
	]
}

CIQ.Market.XHEL = {
	"market_tz": "Europe/Helsinki",
	"name": "OMX Nordic Exchange Helsinki",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "10:00",
			"close": "18:30"
		},
		{
			"dayofweek": 2,
			"open": "10:00",
			"close": "18:30"
		},
		{
			"dayofweek": 3,
			"open": "10:00",
			"close": "18:30"
		},
		{
			"dayofweek": 4,
			"open": "10:00",
			"close": "18:30"
		},
		{
			"dayofweek": 5,
			"open": "10:00",
			"close": "18:30"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-01-06",
			"name": "Epiphany"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-05-05",
			"name": "Ascension Day"
		},
		{
			"date": "2016-06-24",
			"name": "Midsummer Eve OBS"
		},
		{
			"date": "2016-12-06",
			"name": "Independence Day"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2017-01-06",
			"name": "Epiphany"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-05-25",
			"name": "Ascension Day"
		},
		{
			"date": "2017-06-23",
			"name": "Midsummer Eve OBS"
		},
		{
			"date": "2017-12-06",
			"name": "Independence Day"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-05-10",
			"name": "Ascension Day"
		},
		{
			"date": "2018-06-22",
			"name": "Midsummer Eve OBS"
		},
		{
			"date": "2018-12-06",
			"name": "Independence Day"
		},
		{
			"date": "2018-12-24",
			"name": "Christmas Eve"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-12-31",
			"name": "New Year's Eve"
		}
	]
}

CIQ.Market.XHKF = {
	"market_tz": "Asia/Hong_Kong",
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:15",
			"close": "12:00"
		},
		{
			"dayofweek": 1,
			"open": "13:00",
			"close": "16:00"
		},
		{
			"dayofweek": 2,
			"open": "09:15",
			"close": "12:00"
		},
		{
			"dayofweek": 2,
			"open": "13:00",
			"close": "16:00"
		},
		{
			"dayofweek": 3,
			"open": "09:15",
			"close": "12:00"
		},
		{
			"dayofweek": 3,
			"open": "13:00",
			"close": "16:00"
		},
		{
			"dayofweek": 4,
			"open": "09:15",
			"close": "12:00"
		},
		{
			"dayofweek": 4,
			"open": "13:00",
			"close": "16:00"
		},
		{
			"dayofweek": 5,
			"open": "09:15",
			"close": "12:00"
		},
		{
			"dayofweek": 5,
			"open": "13:00",
			"close": "16:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-02-08",
			"name": "Lunar New Year 1"
		},
		{
			"date": "2016-02-09",
			"name": "Lunar New Year 2"
		},
		{
			"date": "2016-02-10",
			"name": "Lunar New Year 3"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-04-04",
			"name": "Ching Ming Festival"
		},
		{
			"date": "2016-05-02",
			"name": "Labour Day OBS"
		},
		{
			"date": "2016-06-09",
			"name": "Tuen Ng Day*"
		},
		{
			"date": "2016-07-01",
			"name": "SAR Establishment Day"
		},
		{
			"date": "2016-08-02",
			"name": "Bank/Market Closure"
		},
		{
			"date": "2016-09-16",
			"name": "Day Following Mid-autumn Festival*"
		},
		{
			"date": "2016-10-10",
			"name": "Chung Yeung Day*"
		},
		{
			"date": "2016-10-21",
			"name": "Bank/Market Closure 2"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2016-12-27",
			"name": "Christmas Day OBS"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-01-30",
			"name": "Lunar New Year 3"
		},
		{
			"date": "2017-01-31",
			"name": "Lunar New Year 4"
		},
		{
			"date": "2017-04-04",
			"name": "Ching Ming Festival"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-05-03",
			"name": "Buddha's Birthday*"
		},
		{
			"date": "2017-05-30",
			"name": "Tuen Ng Day*"
		},
		{
			"date": "2017-08-23",
			"name": "Bank/Market Closure"
		},
		{
			"date": "2017-10-02",
			"name": "Chinese National Day OBS"
		},
		{
			"date": "2017-10-05",
			"name": "Day Following Mid-autumn Festival*"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-02-16",
			"name": "Lunar New Year 1"
		},
		{
			"date": "2018-02-19",
			"name": "Lunar New Year 4"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-04-05",
			"name": "Ching Ming Festival"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-05-22",
			"name": "Buddha's Birthday*"
		},
		{
			"date": "2018-06-18",
			"name": "Tuen Ng Day*"
		},
		{
			"date": "2018-07-02",
			"name": "SAR Establishment Day OBS"
		},
		{
			"date": "2018-09-25",
			"name": "Day Following Mid-autumn Festival*"
		},
		{
			"date": "2018-10-01",
			"name": "Chinese National Day"
		},
		{
			"date": "2018-10-17",
			"name": "Chung Yeung Day*"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Christmas Holiday"
		}
	],
	"name": "Hong Kong Futures Exchange",
	"hour_aligned": false
}

CIQ.Market.XHKG = {
	"market_tz": "Asia/Hong_Kong",
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:30",
			"close": "12:00"
		},
		{
			"dayofweek": 1,
			"open": "13:00",
			"close": "16:00"
		},
		{
			"dayofweek": 2,
			"open": "09:30",
			"close": "12:00"
		},
		{
			"dayofweek": 2,
			"open": "13:00",
			"close": "16:00"
		},
		{
			"dayofweek": 3,
			"open": "09:30",
			"close": "12:00"
		},
		{
			"dayofweek": 3,
			"open": "13:00",
			"close": "16:00"
		},
		{
			"dayofweek": 4,
			"open": "09:30",
			"close": "12:00"
		},
		{
			"dayofweek": 4,
			"open": "13:00",
			"close": "16:00"
		},
		{
			"dayofweek": 5,
			"open": "09:30",
			"close": "12:00"
		},
		{
			"dayofweek": 5,
			"open": "13:00",
			"close": "16:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-02-08",
			"name": "Lunar New Year 1"
		},
		{
			"date": "2016-02-09",
			"name": "Lunar New Year 2"
		},
		{
			"date": "2016-02-10",
			"name": "Lunar New Year 3"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-04-04",
			"name": "Ching Ming Festival"
		},
		{
			"date": "2016-05-02",
			"name": "Labour Day OBS"
		},
		{
			"date": "2016-06-09",
			"name": "Tuen Ng Day*"
		},
		{
			"date": "2016-07-01",
			"name": "SAR Establishment Day"
		},
		{
			"date": "2016-08-02",
			"name": "Bank/Market Closure"
		},
		{
			"date": "2016-09-16",
			"name": "Day Following Mid-autumn Festival*"
		},
		{
			"date": "2016-10-10",
			"name": "Chung Yeung Day*"
		},
		{
			"date": "2016-10-21",
			"name": "Bank/Market Closure 2"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2016-12-27",
			"name": "Christmas Day OBS"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-01-30",
			"name": "Lunar New Year 3"
		},
		{
			"date": "2017-01-31",
			"name": "Lunar New Year 4"
		},
		{
			"date": "2017-04-04",
			"name": "Ching Ming Festival"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-05-03",
			"name": "Buddha's Birthday*"
		},
		{
			"date": "2017-05-30",
			"name": "Tuen Ng Day*"
		},
		{
			"date": "2017-08-23",
			"name": "Bank/Market Closure"
		},
		{
			"date": "2017-10-02",
			"name": "Chinese National Day OBS"
		},
		{
			"date": "2017-10-05",
			"name": "Day Following Mid-autumn Festival*"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-02-16",
			"name": "Lunar New Year 1"
		},
		{
			"date": "2018-02-19",
			"name": "Lunar New Year 4"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-04-05",
			"name": "Ching Ming Festival"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-05-22",
			"name": "Buddha's Birthday*"
		},
		{
			"date": "2018-06-18",
			"name": "Tuen Ng Day*"
		},
		{
			"date": "2018-07-02",
			"name": "SAR Establishment Day OBS"
		},
		{
			"date": "2018-09-25",
			"name": "Day Following Mid-autumn Festival*"
		},
		{
			"date": "2018-10-01",
			"name": "Chinese National Day"
		},
		{
			"date": "2018-10-17",
			"name": "Chung Yeung Day*"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Christmas Holiday"
		}
	],
	"name": "Hong Kong Stock Exchange",
	"hour_aligned": false
}

CIQ.Market.XICE = {
	"market_tz": "Atlantic/Reykjavik",
	"name": "OMX Nordic Exchange Iceland",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:30",
			"close": "15:30"
		},
		{
			"dayofweek": 2,
			"open": "09:30",
			"close": "15:30"
		},
		{
			"dayofweek": 3,
			"open": "09:30",
			"close": "15:30"
		},
		{
			"dayofweek": 4,
			"open": "09:30",
			"close": "15:30"
		},
		{
			"dayofweek": 5,
			"open": "09:30",
			"close": "15:30"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-03-24",
			"name": "Maundy Thursday"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-04-21",
			"name": "First Day of Summer OBS"
		},
		{
			"date": "2016-05-05",
			"name": "Ascension Day"
		},
		{
			"date": "2016-05-16",
			"name": "Whitmonday"
		},
		{
			"date": "2016-06-17",
			"name": "National Day"
		},
		{
			"date": "2016-08-01",
			"name": "Bank Holiday"
		},
		{
			"date": "2016-12-26",
			"name": "Boxing Day"
		},
		{
			"date": "2017-04-13",
			"name": "Maundy Thursday"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-04-20",
			"name": "First Day of Summer OBS"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-05-25",
			"name": "Ascension Day"
		},
		{
			"date": "2017-06-05",
			"name": "Whitmonday"
		},
		{
			"date": "2017-08-07",
			"name": "Bank Holiday"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Boxing Day"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-03-29",
			"name": "Maundy Thursday"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-04-19",
			"name": "First Day of Summer"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-05-10",
			"name": "Ascension Day"
		},
		{
			"date": "2018-05-21",
			"name": "Whitmonday"
		},
		{
			"date": "2018-08-06",
			"name": "Bank Holiday"
		},
		{
			"date": "2018-12-24",
			"name": "Christmas Eve"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Boxing Day"
		},
		{
			"date": "2018-12-31",
			"name": "New Year's Eve"
		}
	]
}

CIQ.Market.XCAI = {
	"market_tz": "Africa/Cairo",
	"name": "Egyptian Exchange",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "10:00",
			"close": "14:30"
		},
		{
			"dayofweek": 2,
			"open": "10:00",
			"close": "14:30"
		},
		{
			"dayofweek": 3,
			"open": "10:00",
			"close": "14:30"
		},
		{
			"dayofweek": 4,
			"open": "10:00",
			"close": "14:30"
		},
		{
			"dayofweek": 5,
			"open": "10:00",
			"close": "14:30"
		},
		{
			"date": "2016-01-07",
			"name": "Christmas (Eastern)"
		},
		{
			"date": "2016-01-25",
			"name": "Police Day"
		},
		{
			"date": "2016-04-25",
			"name": "Sinai Liberation Day"
		},
		{
			"date": "2016-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2016-05-01",
			"name": "Easter Sunday (Coptic)"
		},
		{
			"date": "2016-05-02",
			"name": "Easter Monday (Coptic)"
		},
		{
			"date": "2016-06-30",
			"name": "Market Closure"
		},
		{
			"date": "2016-07-05",
			"name": "Eid al-Fitr 1*"
		},
		{
			"date": "2016-07-06",
			"name": "Eid al-Fitr 2*"
		},
		{
			"date": "2016-07-07",
			"name": "Eid al-Fitr 3*"
		},
		{
			"date": "2016-09-11",
			"name": "Eid al-Adha 1*"
		},
		{
			"date": "2016-09-12",
			"name": "Eid al-Adha 2*"
		},
		{
			"date": "2016-09-13",
			"name": "Eid al-Adha 3*"
		},
		{
			"date": "2016-10-02",
			"name": "Islamic (Hijri) New Year*"
		},
		{
			"date": "2016-10-06",
			"name": "Armed Forces Day"
		},
		{
			"date": "2016-12-11",
			"name": "Prophet's Birthday*"
		},
		{
			"date": "2017-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2017-01-25",
			"name": "Police Day"
		},
		{
			"date": "2017-04-16",
			"name": "Easter Sunday (Coptic)"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday (Coptic)"
		},
		{
			"date": "2017-04-25",
			"name": "Sinai Liberation Day"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-06-25",
			"name": "Eid al-Fitr 1*"
		},
		{
			"date": "2017-06-26",
			"name": "Eid al-Fitr 2*"
		},
		{
			"date": "2017-06-27",
			"name": "Eid al-Fitr 3*"
		},
		{
			"date": "2017-06-29",
			"name": "Market Closure"
		},
		{
			"date": "2017-07-23",
			"name": "Revolution Day"
		},
		{
			"date": "2017-08-31",
			"name": "Wakfet Arafat*"
		},
		{
			"date": "2017-09-03",
			"name": "Eid al-Adha 3*"
		},
		{
			"date": "2017-09-04",
			"name": "Eid al-Adha 4*"
		},
		{
			"date": "2017-09-21",
			"name": "Islamic (Hijri) New Year*"
		},
		{
			"date": "2017-10-05",
			"name": "Armed Forces Day"
		},
		{
			"date": "2017-11-30",
			"name": "Prophet's Birthday*"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-01-07",
			"name": "Christmas (Eastern)"
		},
		{
			"date": "2018-01-25",
			"name": "Police Day"
		},
		{
			"date": "2018-04-08",
			"name": "Easter Sunday (Coptic)"
		},
		{
			"date": "2018-04-09",
			"name": "Easter Monday (Coptic)"
		},
		{
			"date": "2018-04-25",
			"name": "Sinai Liberation Day"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-07-01",
			"name": "Bank Holiday"
		},
		{
			"date": "2018-07-23",
			"name": "Revolution Day"
		},
		{
			"date": "2018-08-20",
			"name": "Wakfet Arafat*"
		},
		{
			"date": "2018-08-21",
			"name": "Eid al-Adha 1*"
		},
		{
			"date": "2018-08-22",
			"name": "Eid al-Adha 2*"
		},
		{
			"date": "2018-09-11",
			"name": "Islamic (Hijri) New Year*"
		},
		{
			"date": "2018-11-20",
			"name": "Prophet's Birthday*"
		}
	]
}

CIQ.Market.XJAS = {
	"market_tz": "Asia/Tokyo",
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:00",
			"close": "11:30"
		},
		{
			"dayofweek": 1,
			"open": "12:30",
			"close": "15:00"
		},
		{
			"dayofweek": 2,
			"open": "09:00",
			"close": "11:30"
		},
		{
			"dayofweek": 2,
			"open": "12:30",
			"close": "15:00"
		},
		{
			"dayofweek": 3,
			"open": "09:00",
			"close": "11:30"
		},
		{
			"dayofweek": 3,
			"open": "12:30",
			"close": "15:00"
		},
		{
			"dayofweek": 4,
			"open": "09:00",
			"close": "11:30"
		},
		{
			"dayofweek": 4,
			"open": "12:30",
			"close": "15:00"
		},
		{
			"dayofweek": 5,
			"open": "09:00",
			"close": "11:30"
		},
		{
			"dayofweek": 5,
			"open": "12:30",
			"close": "15:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-01-11",
			"name": "Coming of Age  (Adults') Day"
		},
		{
			"date": "2016-02-11",
			"name": "National Founding Day"
		},
		{
			"date": "2016-03-21",
			"name": "Vernal Equinox OBS"
		},
		{
			"date": "2016-04-29",
			"name": "Showa Day (formerly Greenery Day)"
		},
		{
			"date": "2016-05-03",
			"name": "Constitution Day"
		},
		{
			"date": "2016-05-04",
			"name": "Greenery Day (formerly National Holiday)"
		},
		{
			"date": "2016-05-05",
			"name": "Children's Day"
		},
		{
			"date": "2016-07-18",
			"name": "Marine Day"
		},
		{
			"date": "2016-08-11",
			"name": "Mountain Day"
		},
		{
			"date": "2016-09-19",
			"name": "Respect for the Aged Day"
		},
		{
			"date": "2016-09-22",
			"name": "Autumn Equinox"
		},
		{
			"date": "2016-10-10",
			"name": "Health-Sports Day"
		},
		{
			"date": "2016-11-03",
			"name": "Culture Day"
		},
		{
			"date": "2016-11-23",
			"name": "Labour Thanksgiving Day"
		},
		{
			"date": "2016-12-23",
			"name": "Emperor's Birthday"
		},
		{
			"date": "2017-01-02",
			"name": "Bank Holiday 2"
		},
		{
			"date": "2017-01-03",
			"name": "Bank Holiday 3"
		},
		{
			"date": "2017-01-09",
			"name": "Coming of Age  (Adults') Day"
		},
		{
			"date": "2017-03-20",
			"name": "Vernal Equinox"
		},
		{
			"date": "2017-05-03",
			"name": "Constitution Day"
		},
		{
			"date": "2017-05-04",
			"name": "Greenery Day (formerly National Holiday)"
		},
		{
			"date": "2017-05-05",
			"name": "Children's Day"
		},
		{
			"date": "2017-07-17",
			"name": "Marine Day"
		},
		{
			"date": "2017-08-11",
			"name": "Mountain Day"
		},
		{
			"date": "2017-09-18",
			"name": "Respect for the Aged Day"
		},
		{
			"date": "2017-10-09",
			"name": "Health-Sports Day"
		},
		{
			"date": "2017-11-03",
			"name": "Culture Day"
		},
		{
			"date": "2017-11-23",
			"name": "Labour Thanksgiving Day"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-01-02",
			"name": "Bank Holiday 2"
		},
		{
			"date": "2018-01-03",
			"name": "Bank Holiday 3"
		},
		{
			"date": "2018-01-08",
			"name": "Coming of Age  (Adults') Day"
		},
		{
			"date": "2018-02-12",
			"name": "National Founding Day OBS"
		},
		{
			"date": "2018-03-21",
			"name": "Vernal Equinox"
		},
		{
			"date": "2018-04-30",
			"name": "Showa Day (formerly Greenery Day) OBS"
		},
		{
			"date": "2018-05-03",
			"name": "Constitution Day"
		},
		{
			"date": "2018-05-04",
			"name": "Greenery Day (formerly National Holiday)"
		},
		{
			"date": "2018-07-16",
			"name": "Marine Day"
		},
		{
			"date": "2018-09-17",
			"name": "Respect for the Aged Day"
		},
		{
			"date": "2018-09-24",
			"name": "Autumn Equinox OBS"
		},
		{
			"date": "2018-10-08",
			"name": "Health-Sports Day"
		},
		{
			"date": "2018-11-23",
			"name": "Labour Thanksgiving Day"
		},
		{
			"date": "2018-12-24",
			"name": "Emperor's Birthday OBS"
		},
		{
			"date": "2018-12-31",
			"name": "New Year's Eve"
		}
	],
	"name": "JASDAQ",
	"hour_aligned": false
}

CIQ.Market.XIST = {
	"market_tz": "Europe/Istanbul",
	"name": "Istanbul Stock Exchange",
	"hour_aligned": false,
	"rules": [
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-05-19",
			"name": "Youth and Sports Day"
		},
		{
			"date": "2016-07-05",
			"name": "Ramadan (Shaker) Bairam 1*"
		},
		{
			"date": "2016-07-06",
			"name": "Ramadan (Shaker) Bairam 2*"
		},
		{
			"date": "2016-07-07",
			"name": "Ramadan (Shaker) Bairam 3*"
		},
		{
			"date": "2016-08-30",
			"name": "Victory Day"
		},
		{
			"date": "2016-09-12",
			"name": "Kurban Bairam 1*"
		},
		{
			"date": "2016-09-13",
			"name": "Kurban Bairam 2*"
		},
		{
			"date": "2016-09-14",
			"name": "Kurban Bairam 3*"
		},
		{
			"date": "2016-09-15",
			"name": "Kurban Bairam 4*"
		},
		{
			"date": "2017-05-01",
			"name": "Labour and Solidarity Day"
		},
		{
			"date": "2017-05-19",
			"name": "Youth and Sports Day"
		},
		{
			"date": "2017-06-26",
			"name": "Ramadan (Shaker) Bairam 2*"
		},
		{
			"date": "2017-06-27",
			"name": "Ramadan (Shaker) Bairam 3*"
		},
		{
			"date": "2017-08-30",
			"name": "Victory Day"
		},
		{
			"date": "2017-09-01",
			"name": "Kurban Bairam 1*"
		},
		{
			"date": "2017-09-04",
			"name": "Kurban Bairam 4*"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-04-23",
			"name": "National Sovereignty and Children's Day"
		},
		{
			"date": "2018-05-01",
			"name": "Labour and Solidarity Day"
		},
		{
			"date": "2018-06-15",
			"name": "Ramadan (Shaker) Bairam 1*"
		},
		{
			"date": "2018-08-21",
			"name": "Kurban Bairam 1*"
		},
		{
			"date": "2018-08-22",
			"name": "Kurban Bairam 2*"
		},
		{
			"date": "2018-08-23",
			"name": "Kurban Bairam 3*"
		},
		{
			"date": "2018-08-24",
			"name": "Kurban Bairam 4*"
		},
		{
			"date": "2018-08-30",
			"name": "Victory Day"
		},
		{
			"date": "2018-10-29",
			"name": "Republic Day"
		}
	]
}

CIQ.Market.XKAR = {
	"market_tz": "America/Chicago",
	"name": "Pakistan Stock Exchange",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:32",
			"close": "15:30"
		},
		{
			"dayofweek": 2,
			"open": "09:32",
			"close": "15:30"
		},
		{
			"dayofweek": 3,
			"open": "09:32",
			"close": "15:30"
		},
		{
			"dayofweek": 4,
			"open": "09:32",
			"close": "15:30"
		},
		{
			"dayofweek": 5,
			"open": "09:32",
			"close": "15:30"
		},
		{
			"date": "2016-02-05",
			"name": "Kashmir Day"
		},
		{
			"date": "2016-03-23",
			"name": "Pakistan Day"
		},
		{
			"date": "2016-07-01",
			"name": "Jummah-tul-Widah*"
		},
		{
			"date": "2016-07-05",
			"name": "Eid-ul-Fitr 1*"
		},
		{
			"date": "2016-07-06",
			"name": "Eid-ul-Fitr 2*"
		},
		{
			"date": "2016-07-07",
			"name": "Eid-ul-Fitr 3*"
		},
		{
			"date": "2016-07-08",
			"name": "Eid-ul-Fitr 4*"
		},
		{
			"date": "2016-09-12",
			"name": "Eid-ul-Adha 1*"
		},
		{
			"date": "2016-09-13",
			"name": "Eid-ul-Adha 2*"
		},
		{
			"date": "2016-09-14",
			"name": "Eid-ul-Adha 3*"
		},
		{
			"date": "2016-10-11",
			"name": "Moharram (Ashura) 1*"
		},
		{
			"date": "2016-10-12",
			"name": "Moharram (Ashura) 2*"
		},
		{
			"date": "2016-12-12",
			"name": "Prophet's Birthday*"
		},
		{
			"date": "2017-03-23",
			"name": "Pakistan Day"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-06-23",
			"name": "Jummah-tul-Widah*"
		},
		{
			"date": "2017-06-26",
			"name": "Eid-ul-Fitr 1*"
		},
		{
			"date": "2017-06-27",
			"name": "Eid-ul-Fitr 2*"
		},
		{
			"date": "2017-06-28",
			"name": "Eid-ul-Fitr 3*"
		},
		{
			"date": "2017-08-14",
			"name": "Independence Day"
		},
		{
			"date": "2017-09-01",
			"name": "Eid-ul-Adha 1*"
		},
		{
			"date": "2017-09-04",
			"name": "Eid-ul-Adha 4*"
		},
		{
			"date": "2017-12-01",
			"name": "Prophet's Birthday*"
		},
		{
			"date": "2017-12-25",
			"name": "Quaid-i-Azam Birthday (Christmas)"
		},
		{
			"date": "2018-02-05",
			"name": "Kashmir Day"
		},
		{
			"date": "2018-03-23",
			"name": "Pakistan Day"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-06-08",
			"name": "Jummah-tul-Widah*"
		},
		{
			"date": "2018-06-15",
			"name": "Eid-ul-Fitr 1*"
		},
		{
			"date": "2018-08-14",
			"name": "Independence Day"
		},
		{
			"date": "2018-08-22",
			"name": "Eid-ul-Adha 1*"
		},
		{
			"date": "2018-08-23",
			"name": "Eid-ul-Adha 2*"
		},
		{
			"date": "2018-09-20",
			"name": "Moharram (Ashura) 1*"
		},
		{
			"date": "2018-09-21",
			"name": "Moharram (Ashura) 2*"
		},
		{
			"date": "2018-11-20",
			"name": "Prophet's Birthday*"
		},
		{
			"date": "2018-12-25",
			"name": "Quaid-i-Azam Birthday (Christmas)"
		}
	]
}

CIQ.Market.XKLS = {
	"market_tz": "Asia/Kuala_Lumpur",
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:00",
			"close": "12:30"
		},
		{
			"dayofweek": 1,
			"open": "14:30",
			"close": "17:00"
		},
		{
			"dayofweek": 2,
			"open": "09:00",
			"close": "12:30"
		},
		{
			"dayofweek": 2,
			"open": "14:30",
			"close": "17:00"
		},
		{
			"dayofweek": 3,
			"open": "09:00",
			"close": "12:30"
		},
		{
			"dayofweek": 3,
			"open": "14:30",
			"close": "17:00"
		},
		{
			"dayofweek": 4,
			"open": "09:00",
			"close": "12:30"
		},
		{
			"dayofweek": 4,
			"open": "14:30",
			"close": "17:00"
		},
		{
			"dayofweek": 5,
			"open": "09:00",
			"close": "12:30"
		},
		{
			"dayofweek": 5,
			"open": "14:30",
			"close": "17:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-01-25",
			"name": "Thaipusam"
		},
		{
			"date": "2016-02-01",
			"name": "Federal Territory Day"
		},
		{
			"date": "2016-02-08",
			"name": "Lunar New Year 1*"
		},
		{
			"date": "2016-02-09",
			"name": "Lunar New Year 2*"
		},
		{
			"date": "2016-05-02",
			"name": "Labour Day OBS"
		},
		{
			"date": "2016-06-22",
			"name": "Nuzul Al Quran"
		},
		{
			"date": "2016-07-06",
			"name": "Hari Raya Puasa 1*"
		},
		{
			"date": "2016-07-07",
			"name": "Hari Raya Puasa 2*"
		},
		{
			"date": "2016-08-31",
			"name": "National Day"
		},
		{
			"date": "2016-09-12",
			"name": "Hari Raya Haji*"
		},
		{
			"date": "2016-09-16",
			"name": "Malaysia Day"
		},
		{
			"date": "2016-10-03",
			"name": "First Day of Muharram*"
		},
		{
			"date": "2016-12-12",
			"name": "Prophet's Birthday*"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas Day OBS"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-01-30",
			"name": "Lunar New Year Holiday"
		},
		{
			"date": "2017-02-01",
			"name": "Federal Territory Day"
		},
		{
			"date": "2017-02-09",
			"name": "Thaipusam"
		},
		{
			"date": "2017-04-24",
			"name": "Installation of Yang di-Pertuan Agong"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-05-10",
			"name": "Wesak Day*"
		},
		{
			"date": "2017-06-12",
			"name": "Nuzul Al Quran Holiday"
		},
		{
			"date": "2017-06-26",
			"name": "Hari Raya Puasa 2*"
		},
		{
			"date": "2017-06-27",
			"name": "Hari Raya Puasa Holiday"
		},
		{
			"date": "2017-08-31",
			"name": "National Day"
		},
		{
			"date": "2017-09-01",
			"name": "Hari Raya Haji*"
		},
		{
			"date": "2017-09-04",
			"name": "Public Holiday"
		},
		{
			"date": "2017-09-22",
			"name": "First Day of Muharram*"
		},
		{
			"date": "2017-10-18",
			"name": "Deepavali*"
		},
		{
			"date": "2017-12-01",
			"name": "Prophet's Birthday*"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-01-31",
			"name": "Thaipusam"
		},
		{
			"date": "2018-02-01",
			"name": "Federal Territory Day"
		},
		{
			"date": "2018-02-16",
			"name": "Lunar New Year 1*"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-05-29",
			"name": "Wesak Day*"
		},
		{
			"date": "2018-06-15",
			"name": "Hari Raya Puasa 1*"
		},
		{
			"date": "2018-08-22",
			"name": "Hari Raya Haji*"
		},
		{
			"date": "2018-08-31",
			"name": "National Day"
		},
		{
			"date": "2018-09-10",
			"name": "Birthday of Yang DiPertuan Agong"
		},
		{
			"date": "2018-09-11",
			"name": "First Day of Muharram*"
		},
		{
			"date": "2018-09-17",
			"name": "Malaysia Day OBS"
		},
		{
			"date": "2018-11-06",
			"name": "Deepavali*"
		},
		{
			"date": "2018-11-20",
			"name": "Prophet's Birthday*"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		}
	],
	"name": "Bursa Malaysia",
	"hour_aligned": false
}

CIQ.Market.XKOS = {
	"market_tz": "Asia/Seoul",
	"name": "KOSDAQ",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:00",
			"close": "15:30"
		},
		{
			"dayofweek": 2,
			"open": "09:00",
			"close": "15:30"
		},
		{
			"dayofweek": 3,
			"open": "09:00",
			"close": "15:30"
		},
		{
			"dayofweek": 4,
			"open": "09:00",
			"close": "15:30"
		},
		{
			"dayofweek": 5,
			"open": "09:00",
			"close": "15:30"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-02-08",
			"name": "Lunar New Year 1"
		},
		{
			"date": "2016-02-09",
			"name": "Lunar New Year 2"
		},
		{
			"date": "2016-02-10",
			"name": "Lunar New Year Additional Holiday"
		},
		{
			"date": "2016-03-01",
			"name": "Independence Movement Day"
		},
		{
			"date": "2016-04-13",
			"name": "Parliamentary Election Day"
		},
		{
			"date": "2016-05-05",
			"name": "Children's Day"
		},
		{
			"date": "2016-05-06",
			"name": "Public Holiday"
		},
		{
			"date": "2016-06-06",
			"name": "Memorial Day"
		},
		{
			"date": "2016-08-15",
			"name": "Liberation Day"
		},
		{
			"date": "2016-09-14",
			"name": "Harvest Moon Festival Eve"
		},
		{
			"date": "2016-09-15",
			"name": "Harvest Moon Festival Day"
		},
		{
			"date": "2016-09-16",
			"name": "Harvest Moon Festival Holiday"
		},
		{
			"date": "2016-10-03",
			"name": "National Foundation Day"
		},
		{
			"date": "2016-12-30",
			"name": "Last Day of Year OBS"
		},
		{
			"date": "2017-01-27",
			"name": "Lunar New Year's Eve"
		},
		{
			"date": "2017-01-30",
			"name": "Lunar New Year Additional Holiday"
		},
		{
			"date": "2017-03-01",
			"name": "Independence Movement Day"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-05-03",
			"name": "Buddha's Birthday"
		},
		{
			"date": "2017-05-05",
			"name": "Children's Day"
		},
		{
			"date": "2017-05-09",
			"name": "Presidential Election Day"
		},
		{
			"date": "2017-06-06",
			"name": "Memorial Day"
		},
		{
			"date": "2017-08-15",
			"name": "Liberation Day"
		},
		{
			"date": "2017-10-02",
			"name": "Harvest Moon Festival Additional Holiday 2"
		},
		{
			"date": "2017-10-03",
			"name": "National Foundation Day"
		},
		{
			"date": "2017-10-03",
			"name": "Harvest Moon Festival Eve"
		},
		{
			"date": "2017-10-04",
			"name": "Harvest Moon Festival Day"
		},
		{
			"date": "2017-10-05",
			"name": "Harvest Moon Festival Holiday"
		},
		{
			"date": "2017-10-06",
			"name": "Harvest Moon Festival Additional Holiday"
		},
		{
			"date": "2017-10-09",
			"name": "Hangul Day"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-29",
			"name": "Last Day of Year OBS"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-02-15",
			"name": "Lunar New Year's Eve"
		},
		{
			"date": "2018-02-16",
			"name": "Lunar New Year 1"
		},
		{
			"date": "2018-03-01",
			"name": "Independence Movement Day"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-05-07",
			"name": "Children's Day OBS"
		},
		{
			"date": "2018-05-22",
			"name": "Buddha's Birthday"
		},
		{
			"date": "2018-06-06",
			"name": "Memorial Day"
		},
		{
			"date": "2018-06-13",
			"name": "Local Elections Day"
		},
		{
			"date": "2018-08-15",
			"name": "Liberation Day"
		},
		{
			"date": "2018-09-24",
			"name": "Harvest Moon Festival Day"
		},
		{
			"date": "2018-09-25",
			"name": "Harvest Moon Festival Holiday"
		},
		{
			"date": "2018-09-26",
			"name": "Harvest Moon Festival Additional Holiday"
		},
		{
			"date": "2018-10-03",
			"name": "National Foundation Day"
		},
		{
			"date": "2018-10-09",
			"name": "Hangul Day"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-31",
			"name": "Last Day of Year"
		},
		{
			"date": "2018-01-02",
			"open": "10:00",
			"close": "15:30"
		},
		{
			"date": "2018-11-15",
			"open": "10:00",
			"close": "16:30"
		}
	]
}

CIQ.Market.XKUW = {
	"market_tz": "Asia/Kuwait",
	"name": "Kuwait Stock Exchange",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:00",
			"close": "12:30"
		},
		{
			"dayofweek": 2,
			"open": "09:00",
			"close": "12:30"
		},
		{
			"dayofweek": 3,
			"open": "09:00",
			"close": "12:30"
		},
		{
			"dayofweek": 4,
			"open": "09:00",
			"close": "12:30"
		},
		{
			"dayofweek": 5,
			"open": "09:00",
			"close": "12:30"
		},
		{
			"date": "2016-01-03",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2016-02-25",
			"name": "National Day"
		},
		{
			"date": "2016-05-05",
			"name": "Lailat al Miraj*"
		},
		{
			"date": "2016-07-05",
			"name": "Eid-al-Fitr 1*"
		},
		{
			"date": "2016-07-06",
			"name": "Eid-al-Fitr 2*"
		},
		{
			"date": "2016-07-07",
			"name": "Eid-al-Fitr 3*"
		},
		{
			"date": "2016-09-11",
			"name": "Arafat Day"
		},
		{
			"date": "2016-09-12",
			"name": "Eid-al-Adha 1*"
		},
		{
			"date": "2016-09-13",
			"name": "Eid-al-Adha 2*"
		},
		{
			"date": "2016-09-14",
			"name": "Eid-al-Adha 3*"
		},
		{
			"date": "2016-09-15",
			"name": "Additional Eid Holiday"
		},
		{
			"date": "2016-10-02",
			"name": "Islamic New Year (Hijra)*"
		},
		{
			"date": "2016-12-08",
			"name": "Prophet's Birthday*"
		},
		{
			"date": "2017-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2017-02-26",
			"name": "Liberation Day"
		},
		{
			"date": "2017-04-27",
			"name": "Lailat al Miraj*"
		},
		{
			"date": "2017-06-25",
			"name": "Eid-al-Fitr 1*"
		},
		{
			"date": "2017-06-26",
			"name": "Eid-al-Fitr 2*"
		},
		{
			"date": "2017-06-27",
			"name": "Eid-al-Fitr 3*"
		},
		{
			"date": "2017-08-31",
			"name": "Arafat Day"
		},
		{
			"date": "2017-09-03",
			"name": "Eid-al-Adha 3*"
		},
		{
			"date": "2017-09-04",
			"name": "Eid-al-Adha 4*"
		},
		{
			"date": "2017-09-21",
			"name": "Islamic New Year (Hijra)*"
		},
		{
			"date": "2017-11-30",
			"name": "Prophet's Birthday*"
		},
		{
			"date": "2017-12-31",
			"name": "Bank/Market Holiday 1"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-02-25",
			"name": "National Day"
		},
		{
			"date": "2018-02-26",
			"name": "Liberation Day"
		},
		{
			"date": "2018-06-14",
			"name": "Eid-al-Fitr 1*"
		},
		{
			"date": "2018-08-20",
			"name": "Arafat Day"
		},
		{
			"date": "2018-08-21",
			"name": "Eid-al-Adha 1*"
		},
		{
			"date": "2018-08-22",
			"name": "Eid-al-Adha 2*"
		},
		{
			"date": "2018-08-23",
			"name": "Eid-al-Adha 3*"
		},
		{
			"date": "2018-09-11",
			"name": "Islamic New Year (Hijra)*"
		},
		{
			"date": "2018-11-20",
			"name": "Prophet's Birthday*"
		}
	]
}

CIQ.Market.XJSE = {
	"market_tz": "Africa/Johannesburg",
	"name": "Johannesburg Stock Exchange",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:00",
			"close": "16:50"
		},
		{
			"dayofweek": 2,
			"open": "09:00",
			"close": "16:50"
		},
		{
			"dayofweek": 3,
			"open": "09:00",
			"close": "16:50"
		},
		{
			"dayofweek": 4,
			"open": "09:00",
			"close": "16:50"
		},
		{
			"dayofweek": 5,
			"open": "09:00",
			"close": "16:50"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-03-21",
			"name": "Human Rights Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Family Day (Easter Monday)"
		},
		{
			"date": "2016-04-27",
			"name": "Freedom Day"
		},
		{
			"date": "2016-05-02",
			"name": "Workers' Day OBS"
		},
		{
			"date": "2016-06-16",
			"name": "Youth Day"
		},
		{
			"date": "2016-08-03",
			"name": "Election Day"
		},
		{
			"date": "2016-08-09",
			"name": "National Women's Day"
		},
		{
			"date": "2016-12-16",
			"name": "Day of Reconciliation"
		},
		{
			"date": "2016-12-26",
			"name": "Day of Goodwill"
		},
		{
			"date": "2016-12-27",
			"name": "Public Holiday"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-03-21",
			"name": "Human Rights Day"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Family Day (Easter Monday)"
		},
		{
			"date": "2017-04-27",
			"name": "Freedom Day"
		},
		{
			"date": "2017-05-01",
			"name": "Workers' Day"
		},
		{
			"date": "2017-06-16",
			"name": "Youth Day"
		},
		{
			"date": "2017-08-09",
			"name": "National Women's Day"
		},
		{
			"date": "2017-09-25",
			"name": "Heritage Day OBS"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Day of Goodwill"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-03-21",
			"name": "Human Rights Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Family Day (Easter Monday)"
		},
		{
			"date": "2018-04-27",
			"name": "Freedom Day"
		},
		{
			"date": "2018-05-01",
			"name": "Workers' Day"
		},
		{
			"date": "2018-08-09",
			"name": "National Women's Day"
		},
		{
			"date": "2018-09-24",
			"name": "Heritage Day"
		},
		{
			"date": "2018-12-17",
			"name": "Day of Reconciliation OBS"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Day of Goodwill"
		},
		{
			"date": "2018-12-24",
			"open": "09:00",
			"close": "11:50"
		},
		{
			"date": "2018-12-31",
			"open": "09:00",
			"close": "11:50"
		}
	]
}

CIQ.Market.XMAD = {
	"market_tz": "Europe/Madrid",
	"name": "Madrid Stock Exchange",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 2,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 3,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 4,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 5,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-12-24",
			"open": "09:00",
			"close": "14:00"
		},
		{
			"date": "2018-12-31",
			"open": "09:00",
			"close": "14:00"
		}
	]
}

CIQ.Market.XMEV = {
	"market_tz": "America/Argentina/Buenos_Aires",
	"name": "Buenos Aires Mercado de Valores",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "11:00",
			"close": "17:00"
		},
		{
			"dayofweek": 2,
			"open": "11:00",
			"close": "17:00"
		},
		{
			"dayofweek": 3,
			"open": "11:00",
			"close": "17:00"
		},
		{
			"dayofweek": 4,
			"open": "11:00",
			"close": "17:00"
		},
		{
			"dayofweek": 5,
			"open": "11:00",
			"close": "17:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-02-08",
			"name": "Carnival Monday"
		},
		{
			"date": "2016-02-09",
			"name": "Carnival Tuesday"
		},
		{
			"date": "2016-03-24",
			"name": "Holy Thursday"
		},
		{
			"date": "2016-03-24",
			"name": "Truth and Justice Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-05-25",
			"name": "National Holiday"
		},
		{
			"date": "2016-06-17",
			"name": "Martin Miguel de Guemes Day"
		},
		{
			"date": "2016-06-20",
			"name": "Flag Day"
		},
		{
			"date": "2016-07-08",
			"name": "Bridge Holiday 1"
		},
		{
			"date": "2016-08-15",
			"name": "Anniversary of the Death of General San Martin"
		},
		{
			"date": "2016-10-10",
			"name": "Day of Respect for Cultural Diversity"
		},
		{
			"date": "2016-11-28",
			"name": "National Sovereignty Day"
		},
		{
			"date": "2016-12-08",
			"name": "Immaculate Conception"
		},
		{
			"date": "2016-12-09",
			"name": "Bridge Holiday 2"
		},
		{
			"date": "2016-12-30",
			"name": "Last business day of year OBS"
		},
		{
			"date": "2017-02-27",
			"name": "Carnival Monday"
		},
		{
			"date": "2017-02-28",
			"name": "Carnival Tuesday"
		},
		{
			"date": "2017-03-24",
			"name": "Truth and Justice Day"
		},
		{
			"date": "2017-04-13",
			"name": "Holy Thursday"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-05-01",
			"name": "Workers' Day"
		},
		{
			"date": "2017-05-25",
			"name": "National Holiday"
		},
		{
			"date": "2017-06-20",
			"name": "Flag Day"
		},
		{
			"date": "2017-08-21",
			"name": "Anniversary of the Death of General San Martin OBS"
		},
		{
			"date": "2017-10-16",
			"name": "Day of Respect for Cultural Diversity OBS"
		},
		{
			"date": "2017-11-06",
			"name": "Bank Holiday"
		},
		{
			"date": "2017-11-20",
			"name": "National Sovereignty Day"
		},
		{
			"date": "2017-12-08",
			"name": "Immaculate Conception"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-02-12",
			"name": "Carnival Monday"
		},
		{
			"date": "2018-02-13",
			"name": "Carnival Tuesday"
		},
		{
			"date": "2018-03-29",
			"name": "Holy Thursday"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Malvinas Islands Memorial"
		},
		{
			"date": "2018-04-30",
			"name": "Bridge Holiday 1"
		},
		{
			"date": "2018-05-01",
			"name": "Workers' Day"
		},
		{
			"date": "2018-05-25",
			"name": "National Holiday"
		},
		{
			"date": "2018-06-20",
			"name": "Flag Day"
		},
		{
			"date": "2018-07-09",
			"name": "Independence Day"
		},
		{
			"date": "2018-08-20",
			"name": "Anniversary of the Death of General San Martin OBS"
		},
		{
			"date": "2018-10-15",
			"name": "Day of Respect for Cultural Diversity OBS"
		},
		{
			"date": "2018-11-06",
			"name": "Bank Holiday"
		},
		{
			"date": "2018-11-19",
			"name": "National Sovereignty Day OBS"
		},
		{
			"date": "2018-12-24",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-31",
			"name": "New Year's Holiday"
		}
	]
}

CIQ.Market.XLON = {
	"market_tz": "Europe/London",
	"name": "London Stock Exchange",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "08:00",
			"close": "16:30"
		},
		{
			"dayofweek": 2,
			"open": "08:00",
			"close": "16:30"
		},
		{
			"dayofweek": 3,
			"open": "08:00",
			"close": "16:30"
		},
		{
			"dayofweek": 4,
			"open": "08:00",
			"close": "16:30"
		},
		{
			"dayofweek": 5,
			"open": "08:00",
			"close": "16:30"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-05-02",
			"name": "Early May Bank Holiday"
		},
		{
			"date": "2016-05-30",
			"name": "Late May Bank Holiday"
		},
		{
			"date": "2016-08-29",
			"name": "Summer Bank Holiday"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas OBS"
		},
		{
			"date": "2016-12-27",
			"name": "Boxing Day OBS"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-05-01",
			"name": "Early May Bank Holiday"
		},
		{
			"date": "2017-05-29",
			"name": "Late May Bank Holiday"
		},
		{
			"date": "2017-08-28",
			"name": "Summer Bank Holiday"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas"
		},
		{
			"date": "2017-12-26",
			"name": "Boxing Day"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-05-07",
			"name": "Early May Bank Holiday"
		},
		{
			"date": "2018-05-28",
			"name": "Late May Bank Holiday"
		},
		{
			"date": "2018-08-27",
			"name": "Summer Bank Holiday"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas"
		},
		{
			"date": "2018-12-26",
			"name": "Boxing Day"
		},
		{
			"date": "2018-12-24",
			"open": "08:00",
			"close": "12:30"
		},
		{
			"date": "2018-12-31",
			"open": "08:00",
			"close": "12:30"
		}
	]
}

CIQ.Market.XMEX = {
	"market_tz": "America/Mexico_City",
	"name": "Mexico Stock Exchange",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "08:30",
			"close": "15:00"
		},
		{
			"dayofweek": 2,
			"open": "08:30",
			"close": "15:00"
		},
		{
			"dayofweek": 3,
			"open": "08:30",
			"close": "15:00"
		},
		{
			"dayofweek": 4,
			"open": "08:30",
			"close": "15:00"
		},
		{
			"dayofweek": 5,
			"open": "08:30",
			"close": "15:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-02-01",
			"name": "Constitution Day"
		},
		{
			"date": "2016-03-21",
			"name": "Juarez's  Birthday"
		},
		{
			"date": "2016-03-24",
			"name": "Holy Thursday"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-09-16",
			"name": "Independence Day"
		},
		{
			"date": "2016-11-02",
			"name": "All Souls' Day"
		},
		{
			"date": "2016-11-21",
			"name": "Mexican Revolution"
		},
		{
			"date": "2016-12-12",
			"name": "Our Lady of Guadalupe"
		},
		{
			"date": "2017-02-06",
			"name": "Constitution Day"
		},
		{
			"date": "2017-03-20",
			"name": "Juarez's  Birthday"
		},
		{
			"date": "2017-04-13",
			"name": "Holy Thursday"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-11-02",
			"name": "All Souls' Day"
		},
		{
			"date": "2017-11-20",
			"name": "Mexican Revolution"
		},
		{
			"date": "2017-12-12",
			"name": "Our Lady of Guadalupe"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-02-05",
			"name": "Constitution Day"
		},
		{
			"date": "2018-03-19",
			"name": "Juarez's  Birthday"
		},
		{
			"date": "2018-03-29",
			"name": "Holy Thursday"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-11-02",
			"name": "All Souls' Day"
		},
		{
			"date": "2018-11-19",
			"name": "Mexican Revolution"
		},
		{
			"date": "2018-12-12",
			"name": "Our Lady of Guadalupe"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-24",
			"open": "08:30",
			"close": "12:00"
		},
		{
			"date": "2018-12-31",
			"open": "08:30",
			"close": "12:00"
		}
	]
}

CIQ.Market.XMUN = {
	"market_tz": "Europe/Berlin",
	"name": "Munich Stock Exchange",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "08:00",
			"close": "20:00"
		},
		{
			"dayofweek": 2,
			"open": "08:00",
			"close": "20:00"
		},
		{
			"dayofweek": 3,
			"open": "08:00",
			"close": "20:00"
		},
		{
			"dayofweek": 4,
			"open": "08:00",
			"close": "20:00"
		},
		{
			"dayofweek": 5,
			"open": "08:00",
			"close": "20:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-05-16",
			"name": "May Holiday"
		},
		{
			"date": "2016-10-03",
			"name": "National Day"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-06-05",
			"name": "Whitmonday"
		},
		{
			"date": "2017-10-03",
			"name": "National Day"
		},
		{
			"date": "2017-10-31",
			"name": "Reformation Day 500th Anniversary"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-05-21",
			"name": "Whitmonday"
		},
		{
			"date": "2018-12-24",
			"name": "Christmas Eve"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-12-31",
			"name": "New Year's Eve"
		},
		{
			"date": "2018-12-28",
			"open": "08:00",
			"close": "14:00"
		}
	]
}

CIQ.Market.XGRM = {
	"market_tz": "Europe/Berlin",
	"name": "Tradegate Exchange - Regular Market",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "08:00",
			"close": "22:00"
		},
		{
			"dayofweek": 2,
			"open": "08:00",
			"close": "22:00"
		},
		{
			"dayofweek": 3,
			"open": "08:00",
			"close": "22:00"
		},
		{
			"dayofweek": 4,
			"open": "08:00",
			"close": "22:00"
		},
		{
			"dayofweek": 5,
			"open": "08:00",
			"close": "22:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-12-24",
			"name": "Christmas Eve"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-12-31",
			"name": "New Year's Eve"
		},
		{
			"date": "2018-05-10",
			"open": "08:00",
			"close": "20:00"
		},
		{
			"date": "2018-05-21",
			"open": "08:00",
			"close": "20:00"
		},
		{
			"date": "2018-10-03",
			"open": "08:00",
			"close": "20:00"
		},
		{
			"date": "2018-12-28",
			"open": "08:00",
			"close": "14:00"
		}
	]
}

CIQ.Market.XMUS = {
	"market_tz": "Asia/Muscat",
	"name": "Muscat Securities Market",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "10:00",
			"close": "13:00"
		},
		{
			"dayofweek": 2,
			"open": "10:00",
			"close": "13:00"
		},
		{
			"dayofweek": 3,
			"open": "10:00",
			"close": "13:00"
		},
		{
			"dayofweek": 4,
			"open": "10:00",
			"close": "13:00"
		},
		{
			"dayofweek": 5,
			"open": "10:00",
			"close": "13:00"
		},
		{
			"date": "2016-05-05",
			"name": "Ascension of Prophet Muhammad*"
		},
		{
			"date": "2016-07-05",
			"name": "Eid al-Fitr 1*"
		},
		{
			"date": "2016-07-06",
			"name": "Eid al-Fitr 2*"
		},
		{
			"date": "2016-07-07",
			"name": "Eid al-Fitr 3*"
		},
		{
			"date": "2016-07-24",
			"name": "Renaissance Day Observance"
		},
		{
			"date": "2016-09-11",
			"name": "Eid al-Adha 1*"
		},
		{
			"date": "2016-09-12",
			"name": "Eid al-Adha 2*"
		},
		{
			"date": "2016-09-13",
			"name": "Eid al-Adha 3*"
		},
		{
			"date": "2016-09-14",
			"name": "Eid al-Adha 4*"
		},
		{
			"date": "2016-09-15",
			"name": "Eid al-Adha 5*"
		},
		{
			"date": "2016-10-03",
			"name": "Islamic (Hijri) New Year*"
		},
		{
			"date": "2016-11-23",
			"name": "National Day"
		},
		{
			"date": "2016-11-24",
			"name": "National Day Holiday"
		},
		{
			"date": "2016-12-12",
			"name": "Prophet's Birthday*"
		},
		{
			"date": "2017-04-25",
			"name": "Ascension of Prophet Muhammad*"
		},
		{
			"date": "2017-06-25",
			"name": "Eid al-Fitr 1*"
		},
		{
			"date": "2017-06-26",
			"name": "Eid al-Fitr 2*"
		},
		{
			"date": "2017-06-27",
			"name": "Eid al-Fitr 3*"
		},
		{
			"date": "2017-06-28",
			"name": "Eid al-Fitr 4*"
		},
		{
			"date": "2017-06-29",
			"name": "Eid al-Fitr 5*"
		},
		{
			"date": "2017-07-23",
			"name": "Renaissance Day"
		},
		{
			"date": "2017-08-31",
			"name": "Eid al-Adha 1*"
		},
		{
			"date": "2017-09-03",
			"name": "Eid al-Adha 4*"
		},
		{
			"date": "2017-09-04",
			"name": "Eid al-Adha 5*"
		},
		{
			"date": "2017-09-24",
			"name": "Islamic (Hijri) New Year*"
		},
		{
			"date": "2017-12-03",
			"name": "National Day"
		},
		{
			"date": "2017-12-04",
			"name": "National Day Holiday"
		},
		{
			"date": "2017-12-05",
			"name": "Prophet's Birthday*"
		},
		{
			"date": "2018-06-17",
			"name": "Eid al-Fitr 3*"
		},
		{
			"date": "2018-07-23",
			"name": "Renaissance Day"
		},
		{
			"date": "2018-08-22",
			"name": "Eid al-Adha 1*"
		},
		{
			"date": "2018-08-23",
			"name": "Eid al-Adha 2*"
		},
		{
			"date": "2018-09-11",
			"name": "Islamic (Hijri) New Year*"
		},
		{
			"date": "2018-11-20",
			"name": "Prophet's Birthday*"
		}
	]
}

CIQ.Market.XNAI = {
	"market_tz": "Africa/Nairobi",
	"name": "Nairobi Stock Exchange",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:31",
			"close": "15:00"
		},
		{
			"dayofweek": 2,
			"open": "09:31",
			"close": "15:00"
		},
		{
			"dayofweek": 3,
			"open": "09:31",
			"close": "15:00"
		},
		{
			"dayofweek": 4,
			"open": "09:31",
			"close": "15:00"
		},
		{
			"dayofweek": 5,
			"open": "09:31",
			"close": "15:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-05-02",
			"name": "Labour Day OBS"
		},
		{
			"date": "2016-06-01",
			"name": "Madaraka Day"
		},
		{
			"date": "2016-07-07",
			"name": "Id-ul-Fitr*"
		},
		{
			"date": "2016-09-12",
			"name": "Idd-ul-Adha*"
		},
		{
			"date": "2016-10-20",
			"name": "Mashujaa Day"
		},
		{
			"date": "2016-12-12",
			"name": "Jamhuri Day"
		},
		{
			"date": "2016-12-26",
			"name": "Boxing Day"
		},
		{
			"date": "2016-12-27",
			"name": "Christmas Day OBS"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-06-01",
			"name": "Madaraka Day"
		},
		{
			"date": "2017-06-26",
			"name": "Id-ul-Fitr*"
		},
		{
			"date": "2017-08-08",
			"name": "Public Holiday"
		},
		{
			"date": "2017-10-20",
			"name": "Mashujaa Day"
		},
		{
			"date": "2017-10-25",
			"name": "Public Holiday 3"
		},
		{
			"date": "2017-10-26",
			"name": "Public Holiday 2"
		},
		{
			"date": "2017-11-28",
			"name": "Public Holiday 4"
		},
		{
			"date": "2017-12-12",
			"name": "Jamhuri Day"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Boxing Day"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-06-01",
			"name": "Madaraka Day"
		},
		{
			"date": "2018-06-15",
			"name": "Id-ul-Fitr*"
		},
		{
			"date": "2018-12-12",
			"name": "Jamhuri Day"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Boxing Day"
		}
	]
}

CIQ.Market.XNCM = {
	"market_tz": "America/New_York",
	"name": "NASDAQ Capital Market",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 2,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 3,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 4,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 5,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-01-18",
			"name": "Martin Luther King Jr. Day"
		},
		{
			"date": "2016-02-15",
			"name": "Presidents' Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-05-30",
			"name": "Memorial Day"
		},
		{
			"date": "2016-07-04",
			"name": "Independence Day"
		},
		{
			"date": "2016-09-05",
			"name": "Labor Day"
		},
		{
			"date": "2016-11-24",
			"name": "Thanksgiving"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas OBS"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-01-16",
			"name": "Martin Luther King Jr. Day"
		},
		{
			"date": "2017-02-20",
			"name": "Presidents' Day"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-05-29",
			"name": "Memorial Day"
		},
		{
			"date": "2017-07-04",
			"name": "Independence Day"
		},
		{
			"date": "2017-09-04",
			"name": "Labor Day"
		},
		{
			"date": "2017-11-23",
			"name": "Thanksgiving"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-01-15",
			"name": "Martin Luther King Jr. Day"
		},
		{
			"date": "2018-02-19",
			"name": "Presidents' Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-05-28",
			"name": "Memorial Day"
		},
		{
			"date": "2018-07-04",
			"name": "Independence Day"
		},
		{
			"date": "2018-09-03",
			"name": "Labor Day"
		},
		{
			"date": "2018-11-22",
			"name": "Thanksgiving"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas"
		},
		{
			"date": "2018-07-03",
			"open": "09:30",
			"close": "13:00"
		},
		{
			"date": "2018-11-23",
			"open": "09:30",
			"close": "13:00"
		},
		{
			"date": "2018-12-24",
			"open": "09:30",
			"close": "13:00"
		}
	]
}

CIQ.Market.XNGO = {
	"market_tz": "Asia/Tokyo",
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:00",
			"close": "11:30"
		},
		{
			"dayofweek": 1,
			"open": "12:30",
			"close": "15:00"
		},
		{
			"dayofweek": 2,
			"open": "09:00",
			"close": "11:30"
		},
		{
			"dayofweek": 2,
			"open": "12:30",
			"close": "15:00"
		},
		{
			"dayofweek": 3,
			"open": "09:00",
			"close": "11:30"
		},
		{
			"dayofweek": 3,
			"open": "12:30",
			"close": "15:00"
		},
		{
			"dayofweek": 4,
			"open": "09:00",
			"close": "11:30"
		},
		{
			"dayofweek": 4,
			"open": "12:30",
			"close": "15:00"
		},
		{
			"dayofweek": 5,
			"open": "09:00",
			"close": "11:30"
		},
		{
			"dayofweek": 5,
			"open": "12:30",
			"close": "15:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-01-11",
			"name": "Coming of Age  (Adults') Day"
		},
		{
			"date": "2016-02-11",
			"name": "National Founding Day"
		},
		{
			"date": "2016-03-21",
			"name": "Vernal Equinox OBS"
		},
		{
			"date": "2016-04-29",
			"name": "Showa Day (formerly Greenery Day)"
		},
		{
			"date": "2016-05-03",
			"name": "Constitution Day"
		},
		{
			"date": "2016-05-04",
			"name": "Greenery Day (formerly National Holiday)"
		},
		{
			"date": "2016-05-05",
			"name": "Children's Day"
		},
		{
			"date": "2016-07-18",
			"name": "Marine Day"
		},
		{
			"date": "2016-08-11",
			"name": "Mountain Day"
		},
		{
			"date": "2016-09-19",
			"name": "Respect for the Aged Day"
		},
		{
			"date": "2016-09-22",
			"name": "Autumn Equinox"
		},
		{
			"date": "2016-10-10",
			"name": "Health-Sports Day"
		},
		{
			"date": "2016-11-03",
			"name": "Culture Day"
		},
		{
			"date": "2016-11-23",
			"name": "Labour Thanksgiving Day"
		},
		{
			"date": "2016-12-23",
			"name": "Emperor's Birthday"
		},
		{
			"date": "2017-01-02",
			"name": "Bank Holiday 2"
		},
		{
			"date": "2017-01-03",
			"name": "Bank Holiday 3"
		},
		{
			"date": "2017-01-09",
			"name": "Coming of Age  (Adults') Day"
		},
		{
			"date": "2017-03-20",
			"name": "Vernal Equinox"
		},
		{
			"date": "2017-05-03",
			"name": "Constitution Day"
		},
		{
			"date": "2017-05-04",
			"name": "Greenery Day (formerly National Holiday)"
		},
		{
			"date": "2017-05-05",
			"name": "Children's Day"
		},
		{
			"date": "2017-07-17",
			"name": "Marine Day"
		},
		{
			"date": "2017-08-11",
			"name": "Mountain Day"
		},
		{
			"date": "2017-09-18",
			"name": "Respect for the Aged Day"
		},
		{
			"date": "2017-10-09",
			"name": "Health-Sports Day"
		},
		{
			"date": "2017-11-03",
			"name": "Culture Day"
		},
		{
			"date": "2017-11-23",
			"name": "Labour Thanksgiving Day"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-01-02",
			"name": "Bank Holiday 2"
		},
		{
			"date": "2018-01-03",
			"name": "Bank Holiday 3"
		},
		{
			"date": "2018-01-08",
			"name": "Coming of Age  (Adults') Day"
		},
		{
			"date": "2018-02-12",
			"name": "National Founding Day OBS"
		},
		{
			"date": "2018-03-21",
			"name": "Vernal Equinox"
		},
		{
			"date": "2018-04-30",
			"name": "Showa Day (formerly Greenery Day) OBS"
		},
		{
			"date": "2018-05-03",
			"name": "Constitution Day"
		},
		{
			"date": "2018-05-04",
			"name": "Greenery Day (formerly National Holiday)"
		},
		{
			"date": "2018-07-16",
			"name": "Marine Day"
		},
		{
			"date": "2018-09-17",
			"name": "Respect for the Aged Day"
		},
		{
			"date": "2018-09-24",
			"name": "Autumn Equinox OBS"
		},
		{
			"date": "2018-10-08",
			"name": "Health-Sports Day"
		},
		{
			"date": "2018-11-23",
			"name": "Labour Thanksgiving Day"
		},
		{
			"date": "2018-12-24",
			"name": "Emperor's Birthday OBS"
		},
		{
			"date": "2018-12-31",
			"name": "New Year's Eve"
		}
	],
	"name": "Nagoya Stock Exchange",
	"hour_aligned": false
}

CIQ.Market.XNGS = {
	"market_tz": "America/New_York",
	"name": "NASDAQ Global Select Market",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 2,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 3,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 4,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 5,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-01-18",
			"name": "Martin Luther King Jr. Day"
		},
		{
			"date": "2016-02-15",
			"name": "Presidents' Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-05-30",
			"name": "Memorial Day"
		},
		{
			"date": "2016-07-04",
			"name": "Independence Day"
		},
		{
			"date": "2016-09-05",
			"name": "Labor Day"
		},
		{
			"date": "2016-11-24",
			"name": "Thanksgiving"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas OBS"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-01-16",
			"name": "Martin Luther King Jr. Day"
		},
		{
			"date": "2017-02-20",
			"name": "Presidents' Day"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-05-29",
			"name": "Memorial Day"
		},
		{
			"date": "2017-07-04",
			"name": "Independence Day"
		},
		{
			"date": "2017-09-04",
			"name": "Labor Day"
		},
		{
			"date": "2017-11-23",
			"name": "Thanksgiving"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-01-15",
			"name": "Martin Luther King Jr. Day"
		},
		{
			"date": "2018-02-19",
			"name": "Presidents' Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-05-28",
			"name": "Memorial Day"
		},
		{
			"date": "2018-07-04",
			"name": "Independence Day"
		},
		{
			"date": "2018-09-03",
			"name": "Labor Day"
		},
		{
			"date": "2018-11-22",
			"name": "Thanksgiving"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas"
		},
		{
			"date": "2018-07-03",
			"open": "09:30",
			"close": "13:00"
		},
		{
			"date": "2018-11-23",
			"open": "09:30",
			"close": "13:00"
		},
		{
			"date": "2018-12-24",
			"open": "09:30",
			"close": "13:00"
		}
	]
}

CIQ.Market.XNYS = {
	"market_tz": "America/New_York",
	"name": "New York Stock Exchange",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 2,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 3,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 4,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 5,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-01-18",
			"name": "Martin Luther King Jr. Day"
		},
		{
			"date": "2016-02-15",
			"name": "Presidents' Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-05-30",
			"name": "Memorial Day"
		},
		{
			"date": "2016-07-04",
			"name": "Independence Day"
		},
		{
			"date": "2016-09-05",
			"name": "Labor Day"
		},
		{
			"date": "2016-11-24",
			"name": "Thanksgiving"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas OBS"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-01-16",
			"name": "Martin Luther King Jr. Day"
		},
		{
			"date": "2017-02-20",
			"name": "Presidents' Day"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-05-29",
			"name": "Memorial Day"
		},
		{
			"date": "2017-07-04",
			"name": "Independence Day"
		},
		{
			"date": "2017-09-04",
			"name": "Labor Day"
		},
		{
			"date": "2017-11-23",
			"name": "Thanksgiving"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-01-15",
			"name": "Martin Luther King Jr. Day"
		},
		{
			"date": "2018-02-19",
			"name": "Presidents' Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-05-28",
			"name": "Memorial Day"
		},
		{
			"date": "2018-07-04",
			"name": "Independence Day"
		},
		{
			"date": "2018-09-03",
			"name": "Labor Day"
		},
		{
			"date": "2018-11-22",
			"name": "Thanksgiving"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas"
		},
		{
			"date": "2018-07-03",
			"open": "09:30",
			"close": "13:00"
		},
		{
			"date": "2018-11-23",
			"open": "09:30",
			"close": "13:00"
		},
		{
			"date": "2018-12-24",
			"open": "09:30",
			"close": "13:00"
		}
	]
}

CIQ.Market.XNSE = {
	"market_tz": "Asia/Kolkata",
	"name": "National Stock Exchange of India",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:15",
			"close": "15:30"
		},
		{
			"dayofweek": 2,
			"open": "09:15",
			"close": "15:30"
		},
		{
			"dayofweek": 3,
			"open": "09:15",
			"close": "15:30"
		},
		{
			"dayofweek": 4,
			"open": "09:15",
			"close": "15:30"
		},
		{
			"dayofweek": 5,
			"open": "09:15",
			"close": "15:30"
		},
		{
			"date": "2016-01-26",
			"name": "Republic Day"
		},
		{
			"date": "2016-03-07",
			"name": "Mahashivratri*"
		},
		{
			"date": "2016-03-24",
			"name": "Holi (2nd day)*"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-04-14",
			"name": "Dr. Babsaheb Ambedkar Jayanti"
		},
		{
			"date": "2016-04-15",
			"name": "Ram Navmi*"
		},
		{
			"date": "2016-04-19",
			"name": "Mahavir Jayanti*"
		},
		{
			"date": "2016-07-06",
			"name": "Ramzan-id (Id-ul-fitar)*"
		},
		{
			"date": "2016-08-15",
			"name": "Independence Day"
		},
		{
			"date": "2016-09-05",
			"name": "Ganesh Chaturthi*"
		},
		{
			"date": "2016-09-13",
			"name": "Bakri-id*"
		},
		{
			"date": "2016-10-11",
			"name": "Dasara*"
		},
		{
			"date": "2016-10-12",
			"name": "Moharrum*"
		},
		{
			"date": "2016-10-31",
			"name": "Diwali (Bali Pratipada)"
		},
		{
			"date": "2016-11-14",
			"name": "Guru Nanak Jayanti*"
		},
		{
			"date": "2017-01-26",
			"name": "Republic Day"
		},
		{
			"date": "2017-02-24",
			"name": "Mahashivratri*"
		},
		{
			"date": "2017-03-13",
			"name": "Holi (2nd day)*"
		},
		{
			"date": "2017-04-04",
			"name": "Ram Navmi*"
		},
		{
			"date": "2017-04-14",
			"name": "Dr. Babsaheb Ambedkar Jayanti"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-05-01",
			"name": "Maharashtra or May Day"
		},
		{
			"date": "2017-06-26",
			"name": "Ramzan-id (Id-ul-fitar)*"
		},
		{
			"date": "2017-08-15",
			"name": "Independence Day"
		},
		{
			"date": "2017-08-25",
			"name": "Ganesh Chaturthi*"
		},
		{
			"date": "2017-10-02",
			"name": "Mahatma Gandhi's Birthday"
		},
		{
			"date": "2017-10-19",
			"name": "Diwali Amavasya (Muhurat trading)*"
		},
		{
			"date": "2017-10-20",
			"name": "Diwali (Bali Pratipada)"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-01-26",
			"name": "Republic Day"
		},
		{
			"date": "2018-02-13",
			"name": "Mahashivratri*"
		},
		{
			"date": "2018-03-02",
			"name": "Holi (2nd day)*"
		},
		{
			"date": "2018-03-29",
			"name": "Mahavir Jayanti*"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-05-01",
			"name": "Maharashtra or May Day"
		},
		{
			"date": "2018-08-15",
			"name": "Independence Day"
		},
		{
			"date": "2018-08-22",
			"name": "Bakri-id*"
		},
		{
			"date": "2018-09-13",
			"name": "Ganesh Chaturthi*"
		},
		{
			"date": "2018-09-20",
			"name": "Moharrum*"
		},
		{
			"date": "2018-10-02",
			"name": "Mahatma Gandhi's Birthday"
		},
		{
			"date": "2018-10-18",
			"name": "Dasara*"
		},
		{
			"date": "2018-11-07",
			"name": "Diwali Amavasya (Muhurat trading)*"
		},
		{
			"date": "2018-11-08",
			"name": "Diwali (Bali Pratipada)"
		},
		{
			"date": "2018-11-23",
			"name": "Guru Nanak Jayanti*"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		}
	]
}

CIQ.Market.XNZE = {
	"market_tz": "Pacific/Auckland",
	"name": "NZX (New Zealand Stock Exchange)",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "10:00",
			"close": "17:00"
		},
		{
			"dayofweek": 2,
			"open": "10:00",
			"close": "17:00"
		},
		{
			"dayofweek": 3,
			"open": "10:00",
			"close": "17:00"
		},
		{
			"dayofweek": 4,
			"open": "10:00",
			"close": "17:00"
		},
		{
			"dayofweek": 5,
			"open": "10:00",
			"close": "17:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-01-04",
			"name": "New Year's Obs. OBS"
		},
		{
			"date": "2016-02-08",
			"name": "Waitangi Day OBS"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-04-25",
			"name": "ANZAC Day"
		},
		{
			"date": "2016-06-06",
			"name": "Queen's Birthday"
		},
		{
			"date": "2016-10-24",
			"name": "Labour Day"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas Day OBS"
		},
		{
			"date": "2016-12-27",
			"name": "Boxing Day OBS"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-01-03",
			"name": "New Year's Obs. OBS"
		},
		{
			"date": "2017-02-06",
			"name": "Waitangi Day"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-04-25",
			"name": "ANZAC Day"
		},
		{
			"date": "2017-06-05",
			"name": "Queen's Birthday"
		},
		{
			"date": "2017-10-23",
			"name": "Labour Day"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Boxing Day"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-01-02",
			"name": "New Year's Obs."
		},
		{
			"date": "2018-02-06",
			"name": "Waitangi Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-04-25",
			"name": "ANZAC Day"
		},
		{
			"date": "2018-06-04",
			"name": "Queen's Birthday"
		},
		{
			"date": "2018-10-22",
			"name": "Labour Day"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Boxing Day"
		},
		{
			"date": "2018-12-24",
			"open": "10:00",
			"close": "13:00"
		},
		{
			"date": "2018-12-31",
			"open": "10:00",
			"close": "13:00"
		}
	]
}

CIQ.Market.XPAR = {
	"market_tz": "Europe/Paris",
	"name": "Euronext Paris",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 2,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 3,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 4,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 5,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-12-24",
			"open": "09:00",
			"close": "14:00"
		},
		{
			"date": "2018-12-31",
			"open": "09:00",
			"close": "14:00"
		}
	]
}

CIQ.Market.XSAP = {
	"market_tz": "Asia/Tokyo",
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:00",
			"close": "11:00"
		},
		{
			"dayofweek": 1,
			"open": "12:30",
			"close": "15:30"
		},
		{
			"dayofweek": 2,
			"open": "09:00",
			"close": "11:00"
		},
		{
			"dayofweek": 2,
			"open": "12:30",
			"close": "15:30"
		},
		{
			"dayofweek": 3,
			"open": "09:00",
			"close": "11:00"
		},
		{
			"dayofweek": 3,
			"open": "12:30",
			"close": "15:30"
		},
		{
			"dayofweek": 4,
			"open": "09:00",
			"close": "11:00"
		},
		{
			"dayofweek": 4,
			"open": "12:30",
			"close": "15:30"
		},
		{
			"dayofweek": 5,
			"open": "09:00",
			"close": "11:00"
		},
		{
			"dayofweek": 5,
			"open": "12:30",
			"close": "15:30"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-01-11",
			"name": "Coming of Age  (Adults') Day"
		},
		{
			"date": "2016-02-11",
			"name": "National Founding Day"
		},
		{
			"date": "2016-03-21",
			"name": "Vernal Equinox OBS"
		},
		{
			"date": "2016-04-29",
			"name": "Showa Day (formerly Greenery Day)"
		},
		{
			"date": "2016-05-03",
			"name": "Constitution Day"
		},
		{
			"date": "2016-05-04",
			"name": "Greenery Day (formerly National Holiday)"
		},
		{
			"date": "2016-05-05",
			"name": "Children's Day"
		},
		{
			"date": "2016-07-18",
			"name": "Marine Day"
		},
		{
			"date": "2016-08-11",
			"name": "Mountain Day"
		},
		{
			"date": "2016-09-19",
			"name": "Respect for the Aged Day"
		},
		{
			"date": "2016-09-22",
			"name": "Autumn Equinox"
		},
		{
			"date": "2016-10-10",
			"name": "Health-Sports Day"
		},
		{
			"date": "2016-11-03",
			"name": "Culture Day"
		},
		{
			"date": "2016-11-23",
			"name": "Labour Thanksgiving Day"
		},
		{
			"date": "2016-12-23",
			"name": "Emperor's Birthday"
		},
		{
			"date": "2017-01-02",
			"name": "Bank Holiday 2"
		},
		{
			"date": "2017-01-03",
			"name": "Bank Holiday 3"
		},
		{
			"date": "2017-01-09",
			"name": "Coming of Age  (Adults') Day"
		},
		{
			"date": "2017-03-20",
			"name": "Vernal Equinox"
		},
		{
			"date": "2017-05-03",
			"name": "Constitution Day"
		},
		{
			"date": "2017-05-04",
			"name": "Greenery Day (formerly National Holiday)"
		},
		{
			"date": "2017-05-05",
			"name": "Children's Day"
		},
		{
			"date": "2017-07-17",
			"name": "Marine Day"
		},
		{
			"date": "2017-08-11",
			"name": "Mountain Day"
		},
		{
			"date": "2017-09-18",
			"name": "Respect for the Aged Day"
		},
		{
			"date": "2017-10-09",
			"name": "Health-Sports Day"
		},
		{
			"date": "2017-11-03",
			"name": "Culture Day"
		},
		{
			"date": "2017-11-23",
			"name": "Labour Thanksgiving Day"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-01-02",
			"name": "Bank Holiday 2"
		},
		{
			"date": "2018-01-03",
			"name": "Bank Holiday 3"
		},
		{
			"date": "2018-01-08",
			"name": "Coming of Age  (Adults') Day"
		},
		{
			"date": "2018-02-12",
			"name": "National Founding Day OBS"
		},
		{
			"date": "2018-03-21",
			"name": "Vernal Equinox"
		},
		{
			"date": "2018-04-30",
			"name": "Showa Day (formerly Greenery Day) OBS"
		},
		{
			"date": "2018-05-03",
			"name": "Constitution Day"
		},
		{
			"date": "2018-05-04",
			"name": "Greenery Day (formerly National Holiday)"
		},
		{
			"date": "2018-07-16",
			"name": "Marine Day"
		},
		{
			"date": "2018-09-17",
			"name": "Respect for the Aged Day"
		},
		{
			"date": "2018-09-24",
			"name": "Autumn Equinox OBS"
		},
		{
			"date": "2018-10-08",
			"name": "Health-Sports Day"
		},
		{
			"date": "2018-11-23",
			"name": "Labour Thanksgiving Day"
		},
		{
			"date": "2018-12-24",
			"name": "Emperor's Birthday OBS"
		},
		{
			"date": "2018-12-31",
			"name": "New Year's Eve"
		}
	],
	"name": "Sapporo Securities Exchange",
	"hour_aligned": false
}

CIQ.Market.XSGE = {
	"market_tz": "Asia/Hong_Kong",
	"rules": [
		{
			"dayofweek": 1,
			"open": "00:00",
			"close": "02:30"
		},
		{
			"dayofweek": 1,
			"open": "09:00",
			"close": "11:30"
		},
		{
			"dayofweek": 1,
			"open": "13:00",
			"close": "15:00"
		},
		{
			"dayofweek": 1,
			"open": "21:00",
			"close": "24:00"
		},
		{
			"dayofweek": 2,
			"open": "00:00",
			"close": "02:30"
		},
		{
			"dayofweek": 2,
			"open": "09:00",
			"close": "11:30"
		},
		{
			"dayofweek": 2,
			"open": "13:00",
			"close": "15:00"
		},
		{
			"dayofweek": 2,
			"open": "21:00",
			"close": "24:00"
		},
		{
			"dayofweek": 3,
			"open": "00:00",
			"close": "02:30"
		},
		{
			"dayofweek": 3,
			"open": "09:00",
			"close": "11:30"
		},
		{
			"dayofweek": 3,
			"open": "13:00",
			"close": "15:00"
		},
		{
			"dayofweek": 3,
			"open": "21:00",
			"close": "24:00"
		},
		{
			"dayofweek": 4,
			"open": "00:00",
			"close": "02:30"
		},
		{
			"dayofweek": 4,
			"open": "09:00",
			"close": "11:30"
		},
		{
			"dayofweek": 4,
			"open": "13:00",
			"close": "15:00"
		},
		{
			"dayofweek": 4,
			"open": "21:00",
			"close": "24:00"
		},
		{
			"dayofweek": 5,
			"open": "00:00",
			"close": "02:30"
		},
		{
			"dayofweek": 5,
			"open": "13:00",
			"close": "15:00"
		},
		{
			"dayofweek": 5,
			"open": "21:00",
			"close": "24:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-02-08",
			"name": "Lunar New Year 2"
		},
		{
			"date": "2016-02-09",
			"name": "Lunar New Year 3"
		},
		{
			"date": "2016-02-10",
			"name": "Lunar New Year 4"
		},
		{
			"date": "2016-02-11",
			"name": "Lunar New Year 5"
		},
		{
			"date": "2016-02-12",
			"name": "Lunar New Year 6"
		},
		{
			"date": "2016-04-04",
			"name": "Ching Ming Festival"
		},
		{
			"date": "2016-05-02",
			"name": "Labour Day Holiday 2"
		},
		{
			"date": "2016-06-09",
			"name": "Dragon Boat Festival (Tuen Ng Day)*"
		},
		{
			"date": "2016-06-10",
			"name": "Dragon Boat Festival Holiday"
		},
		{
			"date": "2016-09-15",
			"name": "Mid-autumn Festival*"
		},
		{
			"date": "2016-09-16",
			"name": "Mid-autumn Festival Holiday"
		},
		{
			"date": "2016-10-03",
			"name": "National Day 3"
		},
		{
			"date": "2016-10-04",
			"name": "National Day 4"
		},
		{
			"date": "2016-10-05",
			"name": "National Day 5"
		},
		{
			"date": "2016-10-06",
			"name": "National Day 6"
		},
		{
			"date": "2016-10-07",
			"name": "National Day 7"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-01-27",
			"name": "Lunar NY Eve 1"
		},
		{
			"date": "2017-01-30",
			"name": "Lunar New Year 3"
		},
		{
			"date": "2017-01-31",
			"name": "Lunar New Year 4"
		},
		{
			"date": "2017-02-01",
			"name": "Lunar New Year 5"
		},
		{
			"date": "2017-02-02",
			"name": "Lunar New Year 6"
		},
		{
			"date": "2017-04-03",
			"name": "Ching Ming Festival Eve"
		},
		{
			"date": "2017-04-04",
			"name": "Ching Ming Festival"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day 1"
		},
		{
			"date": "2017-05-29",
			"name": "Dragon Boat Festival Holiday"
		},
		{
			"date": "2017-05-30",
			"name": "Dragon Boat Festival (Tuen Ng Day)*"
		},
		{
			"date": "2017-10-02",
			"name": "National Day 2"
		},
		{
			"date": "2017-10-03",
			"name": "National Day 3"
		},
		{
			"date": "2017-10-04",
			"name": "National Day 4"
		},
		{
			"date": "2017-10-04",
			"name": "Mid-autumn Festival*"
		},
		{
			"date": "2017-10-05",
			"name": "National Day 5"
		},
		{
			"date": "2017-10-06",
			"name": "National Day 6"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-02-15",
			"name": "Lunar NY Eve 1"
		},
		{
			"date": "2018-02-16",
			"name": "Lunar New Year 1"
		},
		{
			"date": "2018-02-19",
			"name": "Lunar New Year 4"
		},
		{
			"date": "2018-02-20",
			"name": "Lunar New Year 5"
		},
		{
			"date": "2018-02-21",
			"name": "Lunar New Year 6"
		},
		{
			"date": "2018-04-05",
			"name": "Ching Ming Festival"
		},
		{
			"date": "2018-04-06",
			"name": "Ching Ming Festival Holiday"
		},
		{
			"date": "2018-04-30",
			"name": "Labour Day Holiday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day 1"
		},
		{
			"date": "2018-06-18",
			"name": "Dragon Boat Festival (Tuen Ng Day)*"
		},
		{
			"date": "2018-09-24",
			"name": "Mid-autumn Festival*"
		},
		{
			"date": "2018-10-01",
			"name": "National Day 1"
		},
		{
			"date": "2018-10-02",
			"name": "National Day 2"
		},
		{
			"date": "2018-10-03",
			"name": "National Day 3"
		},
		{
			"date": "2018-10-04",
			"name": "National Day 4"
		},
		{
			"date": "2018-10-05",
			"name": "National Day 5"
		},
		{
			"date": "2018-12-31",
			"name": "Additional New Year Holiday"
		}
	],
	"name": "Shanghai Futures Exchange",
	"hour_aligned": false
}

CIQ.Market.XSGO = {
	"market_tz": "America/Santiago",
	"name": "Santiago Stock Exchange",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 2,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 3,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 4,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 5,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-06-27",
			"name": "Saints Peter and Paul OBS"
		},
		{
			"date": "2016-08-15",
			"name": "Assumption Day"
		},
		{
			"date": "2016-09-19",
			"name": "Army Day"
		},
		{
			"date": "2016-10-10",
			"name": "Columbus Day OBS"
		},
		{
			"date": "2016-10-31",
			"name": "Evangelical Church Day"
		},
		{
			"date": "2016-11-01",
			"name": "All Saints' Day"
		},
		{
			"date": "2016-12-08",
			"name": "Immaculate Conception"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-19",
			"name": "Census Day"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-06-26",
			"name": "Saints Peter and Paul OBS"
		},
		{
			"date": "2017-08-15",
			"name": "Assumption Day"
		},
		{
			"date": "2017-09-18",
			"name": "Independence Day"
		},
		{
			"date": "2017-09-19",
			"name": "Army Day"
		},
		{
			"date": "2017-10-09",
			"name": "Columbus Day OBS"
		},
		{
			"date": "2017-10-27",
			"name": "Evangelical Church Day OBS"
		},
		{
			"date": "2017-11-01",
			"name": "All Saints' Day"
		},
		{
			"date": "2017-12-08",
			"name": "Immaculate Conception"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-01-16",
			"name": "Public Holiday 2"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-05-21",
			"name": "Battle of Iquique/Navy Day"
		},
		{
			"date": "2018-07-02",
			"name": "Saints Peter and Paul OBS"
		},
		{
			"date": "2018-07-16",
			"name": "Solemnity of Virgin of Carmen"
		},
		{
			"date": "2018-08-15",
			"name": "Assumption Day"
		},
		{
			"date": "2018-09-17",
			"name": "Public Holiday"
		},
		{
			"date": "2018-09-18",
			"name": "Independence Day"
		},
		{
			"date": "2018-09-19",
			"name": "Army Day"
		},
		{
			"date": "2018-10-15",
			"name": "Columbus Day OBS"
		},
		{
			"date": "2018-11-01",
			"name": "All Saints' Day"
		},
		{
			"date": "2018-11-02",
			"name": "Evangelical Church Day OBS"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-31",
			"name": "Bank Holiday"
		},
		{
			"date": "2018-03-29",
			"open": "09:30",
			"close": "12:30"
		},
		{
			"date": "2018-09-14",
			"open": "09:30",
			"close": "13:30"
		},
		{
			"date": "2018-12-24",
			"open": "09:30",
			"close": "12:30"
		},
		{
			"date": "2018-12-28",
			"open": "09:30",
			"close": "12:30"
		}
	]
}

CIQ.Market.XSHG = {
	"market_tz": "Asia/Hong_Kong",
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:30",
			"close": "11:30"
		},
		{
			"dayofweek": 1,
			"open": "13:00",
			"close": "15:00"
		},
		{
			"dayofweek": 2,
			"open": "09:30",
			"close": "11:30"
		},
		{
			"dayofweek": 2,
			"open": "13:00",
			"close": "15:00"
		},
		{
			"dayofweek": 3,
			"open": "09:30",
			"close": "11:30"
		},
		{
			"dayofweek": 3,
			"open": "13:00",
			"close": "15:00"
		},
		{
			"dayofweek": 4,
			"open": "09:30",
			"close": "11:30"
		},
		{
			"dayofweek": 4,
			"open": "13:00",
			"close": "15:00"
		},
		{
			"dayofweek": 5,
			"open": "09:30",
			"close": "11:30"
		},
		{
			"dayofweek": 5,
			"open": "13:00",
			"close": "15:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-02-08",
			"name": "Lunar New Year 2"
		},
		{
			"date": "2016-02-09",
			"name": "Lunar New Year 3"
		},
		{
			"date": "2016-02-10",
			"name": "Lunar New Year 4"
		},
		{
			"date": "2016-02-11",
			"name": "Lunar New Year 5"
		},
		{
			"date": "2016-02-12",
			"name": "Lunar New Year 6"
		},
		{
			"date": "2016-04-04",
			"name": "Ching Ming Festival"
		},
		{
			"date": "2016-05-02",
			"name": "Labour Day Holiday 2"
		},
		{
			"date": "2016-06-09",
			"name": "Dragon Boat Festival (Tuen Ng Day)*"
		},
		{
			"date": "2016-06-10",
			"name": "Dragon Boat Festival Holiday"
		},
		{
			"date": "2016-09-15",
			"name": "Mid-autumn Festival*"
		},
		{
			"date": "2016-09-16",
			"name": "Mid-autumn Festival Holiday"
		},
		{
			"date": "2016-10-03",
			"name": "National Day 3"
		},
		{
			"date": "2016-10-04",
			"name": "National Day 4"
		},
		{
			"date": "2016-10-05",
			"name": "National Day 5"
		},
		{
			"date": "2016-10-06",
			"name": "National Day 6"
		},
		{
			"date": "2016-10-07",
			"name": "National Day 7"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-01-27",
			"name": "Lunar NY Eve 1"
		},
		{
			"date": "2017-01-30",
			"name": "Lunar New Year 3"
		},
		{
			"date": "2017-01-31",
			"name": "Lunar New Year 4"
		},
		{
			"date": "2017-02-01",
			"name": "Lunar New Year 5"
		},
		{
			"date": "2017-02-02",
			"name": "Lunar New Year 6"
		},
		{
			"date": "2017-04-03",
			"name": "Ching Ming Festival Eve"
		},
		{
			"date": "2017-04-04",
			"name": "Ching Ming Festival"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day 1"
		},
		{
			"date": "2017-05-29",
			"name": "Dragon Boat Festival Holiday"
		},
		{
			"date": "2017-05-30",
			"name": "Dragon Boat Festival (Tuen Ng Day)*"
		},
		{
			"date": "2017-10-02",
			"name": "National Day 2"
		},
		{
			"date": "2017-10-03",
			"name": "National Day 3"
		},
		{
			"date": "2017-10-04",
			"name": "National Day 4"
		},
		{
			"date": "2017-10-04",
			"name": "Mid-autumn Festival*"
		},
		{
			"date": "2017-10-05",
			"name": "National Day 5"
		},
		{
			"date": "2017-10-06",
			"name": "National Day 6"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-02-15",
			"name": "Lunar NY Eve 1"
		},
		{
			"date": "2018-02-16",
			"name": "Lunar New Year 1"
		},
		{
			"date": "2018-02-19",
			"name": "Lunar New Year 4"
		},
		{
			"date": "2018-02-20",
			"name": "Lunar New Year 5"
		},
		{
			"date": "2018-02-21",
			"name": "Lunar New Year 6"
		},
		{
			"date": "2018-04-05",
			"name": "Ching Ming Festival"
		},
		{
			"date": "2018-04-06",
			"name": "Ching Ming Festival Holiday"
		},
		{
			"date": "2018-04-30",
			"name": "Labour Day Holiday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day 1"
		},
		{
			"date": "2018-06-18",
			"name": "Dragon Boat Festival (Tuen Ng Day)*"
		},
		{
			"date": "2018-09-24",
			"name": "Mid-autumn Festival*"
		},
		{
			"date": "2018-10-01",
			"name": "National Day 1"
		},
		{
			"date": "2018-10-02",
			"name": "National Day 2"
		},
		{
			"date": "2018-10-03",
			"name": "National Day 3"
		},
		{
			"date": "2018-10-04",
			"name": "National Day 4"
		},
		{
			"date": "2018-10-05",
			"name": "National Day 5"
		},
		{
			"date": "2018-12-31",
			"name": "Additional New Year Holiday"
		}
	],
	"name": "Shanghai Stock Exchange A-shares",
	"hour_aligned": false
}

CIQ.Market.XSHG-USD = {
	"market_tz": "Asia/Hong_Kong",
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:30",
			"close": "11:30"
		},
		{
			"dayofweek": 1,
			"open": "13:00",
			"close": "15:00"
		},
		{
			"dayofweek": 2,
			"open": "09:30",
			"close": "11:30"
		},
		{
			"dayofweek": 2,
			"open": "13:00",
			"close": "15:00"
		},
		{
			"dayofweek": 3,
			"open": "09:30",
			"close": "11:30"
		},
		{
			"dayofweek": 3,
			"open": "13:00",
			"close": "15:00"
		},
		{
			"dayofweek": 4,
			"open": "09:30",
			"close": "11:30"
		},
		{
			"dayofweek": 4,
			"open": "13:00",
			"close": "15:00"
		},
		{
			"dayofweek": 5,
			"open": "09:30",
			"close": "11:30"
		},
		{
			"dayofweek": 5,
			"open": "13:00",
			"close": "15:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-02-08",
			"name": "Lunar New Year 2"
		},
		{
			"date": "2016-02-09",
			"name": "Lunar New Year 3"
		},
		{
			"date": "2016-02-10",
			"name": "Lunar New Year 4"
		},
		{
			"date": "2016-02-11",
			"name": "Lunar New Year 5"
		},
		{
			"date": "2016-02-12",
			"name": "Lunar New Year 6"
		},
		{
			"date": "2016-04-04",
			"name": "Ching Ming Festival"
		},
		{
			"date": "2016-05-02",
			"name": "Labour Day Holiday 2"
		},
		{
			"date": "2016-06-09",
			"name": "Dragon Boat Festival (Tuen Ng Day)*"
		},
		{
			"date": "2016-06-10",
			"name": "Dragon Boat Festival Holiday"
		},
		{
			"date": "2016-09-15",
			"name": "Mid-autumn Festival*"
		},
		{
			"date": "2016-09-16",
			"name": "Mid-autumn Festival Holiday"
		},
		{
			"date": "2016-10-03",
			"name": "National Day 3"
		},
		{
			"date": "2016-10-04",
			"name": "National Day 4"
		},
		{
			"date": "2016-10-05",
			"name": "National Day 5"
		},
		{
			"date": "2016-10-06",
			"name": "National Day 6"
		},
		{
			"date": "2016-10-07",
			"name": "National Day 7"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-01-27",
			"name": "Lunar NY Eve 1"
		},
		{
			"date": "2017-01-30",
			"name": "Lunar New Year 3"
		},
		{
			"date": "2017-01-31",
			"name": "Lunar New Year 4"
		},
		{
			"date": "2017-02-01",
			"name": "Lunar New Year 5"
		},
		{
			"date": "2017-02-02",
			"name": "Lunar New Year 6"
		},
		{
			"date": "2017-04-03",
			"name": "Ching Ming Festival Eve"
		},
		{
			"date": "2017-04-04",
			"name": "Ching Ming Festival"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day 1"
		},
		{
			"date": "2017-05-29",
			"name": "Dragon Boat Festival Holiday"
		},
		{
			"date": "2017-05-30",
			"name": "Dragon Boat Festival (Tuen Ng Day)*"
		},
		{
			"date": "2017-10-02",
			"name": "National Day 2"
		},
		{
			"date": "2017-10-03",
			"name": "National Day 3"
		},
		{
			"date": "2017-10-04",
			"name": "National Day 4"
		},
		{
			"date": "2017-10-04",
			"name": "Mid-autumn Festival*"
		},
		{
			"date": "2017-10-05",
			"name": "National Day 5"
		},
		{
			"date": "2017-10-06",
			"name": "National Day 6"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-02-15",
			"name": "Lunar NY Eve 1"
		},
		{
			"date": "2018-02-16",
			"name": "Lunar New Year 1"
		},
		{
			"date": "2018-02-19",
			"name": "Lunar New Year 4"
		},
		{
			"date": "2018-02-20",
			"name": "Lunar New Year 5"
		},
		{
			"date": "2018-02-21",
			"name": "Lunar New Year 6"
		},
		{
			"date": "2018-04-05",
			"name": "Ching Ming Festival"
		},
		{
			"date": "2018-04-06",
			"name": "Ching Ming Festival Holiday"
		},
		{
			"date": "2018-04-30",
			"name": "Labour Day Holiday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day 1"
		},
		{
			"date": "2018-06-18",
			"name": "Dragon Boat Festival (Tuen Ng Day)*"
		},
		{
			"date": "2018-09-24",
			"name": "Mid-autumn Festival*"
		},
		{
			"date": "2018-10-01",
			"name": "National Day 1"
		},
		{
			"date": "2018-10-02",
			"name": "National Day 2"
		},
		{
			"date": "2018-10-03",
			"name": "National Day 3"
		},
		{
			"date": "2018-10-04",
			"name": "National Day 4"
		},
		{
			"date": "2018-10-05",
			"name": "National Day 5"
		},
		{
			"date": "2018-12-31",
			"name": "Additional New Year Holiday"
		}
	],
	"name": "Shanghai Stock Exchange B-shares",
	"hour_aligned": false
}

CIQ.Market.XSSC = {
	"market_tz": "Asia/Hong_Kong",
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:30",
			"close": "11:30"
		},
		{
			"dayofweek": 1,
			"open": "13:00",
			"close": "15:00"
		},
		{
			"dayofweek": 2,
			"open": "09:30",
			"close": "11:30"
		},
		{
			"dayofweek": 2,
			"open": "13:00",
			"close": "15:00"
		},
		{
			"dayofweek": 3,
			"open": "09:30",
			"close": "11:30"
		},
		{
			"dayofweek": 3,
			"open": "13:00",
			"close": "15:00"
		},
		{
			"dayofweek": 4,
			"open": "09:30",
			"close": "11:30"
		},
		{
			"dayofweek": 4,
			"open": "13:00",
			"close": "15:00"
		},
		{
			"dayofweek": 5,
			"open": "09:30",
			"close": "11:30"
		},
		{
			"dayofweek": 5,
			"open": "13:00",
			"close": "15:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-02-08",
			"name": "Lunar New Year 2"
		},
		{
			"date": "2016-02-09",
			"name": "Lunar New Year 3"
		},
		{
			"date": "2016-02-10",
			"name": "Lunar New Year 4"
		},
		{
			"date": "2016-02-11",
			"name": "Lunar New Year 5"
		},
		{
			"date": "2016-02-12",
			"name": "Lunar New Year 6"
		},
		{
			"date": "2016-03-24",
			"name": "Day before HK Good Friday"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-04-04",
			"name": "Ching Ming Festival"
		},
		{
			"date": "2016-05-02",
			"name": "Labour Day Holiday 2"
		},
		{
			"date": "2016-05-02",
			"name": "Labour Day OBS"
		},
		{
			"date": "2016-06-09",
			"name": "Tuen Ng Day*"
		},
		{
			"date": "2016-06-09",
			"name": "Dragon Boat Festival (Tuen Ng Day)*"
		},
		{
			"date": "2016-06-10",
			"name": "Dragon Boat Festival Holiday"
		},
		{
			"date": "2016-06-30",
			"name": "Day before HK SAR Establishment Day"
		},
		{
			"date": "2016-07-01",
			"name": "SAR Establishment Day"
		},
		{
			"date": "2016-08-02",
			"name": "Bank/Market Closure"
		},
		{
			"date": "2016-09-15",
			"name": "Mid-autumn Festival*"
		},
		{
			"date": "2016-09-16",
			"name": "Day Following Mid-autumn Festival*"
		},
		{
			"date": "2016-09-16",
			"name": "Mid-autumn Festival Holiday"
		},
		{
			"date": "2016-09-30",
			"name": "Day before National Day"
		},
		{
			"date": "2016-10-03",
			"name": "National Day 3"
		},
		{
			"date": "2016-10-04",
			"name": "National Day 4"
		},
		{
			"date": "2016-10-05",
			"name": "National Day 5"
		},
		{
			"date": "2016-10-06",
			"name": "National Day 6"
		},
		{
			"date": "2016-10-07",
			"name": "National Day 7"
		},
		{
			"date": "2016-10-10",
			"name": "Chung Yeung Day*"
		},
		{
			"date": "2016-10-21",
			"name": "Bank/Market Closure 2"
		},
		{
			"date": "2016-12-23",
			"name": "Day before HK Christmas OBS"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2016-12-27",
			"name": "Christmas Day OBS"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-01-27",
			"name": "Lunar NY Eve 1"
		},
		{
			"date": "2017-01-30",
			"name": "Lunar New Year 3"
		},
		{
			"date": "2017-01-31",
			"name": "Lunar New Year 4"
		},
		{
			"date": "2017-02-01",
			"name": "Lunar New Year 5"
		},
		{
			"date": "2017-02-02",
			"name": "Lunar New Year 6"
		},
		{
			"date": "2017-04-03",
			"name": "Ching Ming Festival Eve"
		},
		{
			"date": "2017-04-04",
			"name": "Ching Ming Festival"
		},
		{
			"date": "2017-04-13",
			"name": "Day before HK Good Friday"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-05-02",
			"name": "Day Before Buddha's Birthday"
		},
		{
			"date": "2017-05-03",
			"name": "Buddha's Birthday*"
		},
		{
			"date": "2017-05-29",
			"name": "Dragon Boat Festival Holiday"
		},
		{
			"date": "2017-05-30",
			"name": "Tuen Ng Day*"
		},
		{
			"date": "2017-05-30",
			"name": "Dragon Boat Festival (Tuen Ng Day)*"
		},
		{
			"date": "2017-08-23",
			"name": "Bank/Market Closure"
		},
		{
			"date": "2017-10-02",
			"name": "National Day 2"
		},
		{
			"date": "2017-10-03",
			"name": "National Day 3"
		},
		{
			"date": "2017-10-04",
			"name": "National Day 4"
		},
		{
			"date": "2017-10-04",
			"name": "Mid-autumn Festival*"
		},
		{
			"date": "2017-10-05",
			"name": "National Day 5"
		},
		{
			"date": "2017-10-05",
			"name": "Day Following Mid-autumn Festival*"
		},
		{
			"date": "2017-10-06",
			"name": "National Day 6"
		},
		{
			"date": "2017-12-22",
			"name": "Day before HK Christmas OBS"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-02-15",
			"name": "Lunar NY Eve 1"
		},
		{
			"date": "2018-02-16",
			"name": "Lunar New Year 1"
		},
		{
			"date": "2018-02-19",
			"name": "Lunar New Year 4"
		},
		{
			"date": "2018-02-20",
			"name": "Lunar New Year 5"
		},
		{
			"date": "2018-02-21",
			"name": "Lunar New Year 6"
		},
		{
			"date": "2018-03-29",
			"name": "Day before HK Good Friday"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-04-05",
			"name": "Ching Ming Festival"
		},
		{
			"date": "2018-04-06",
			"name": "Ching Ming Festival Holiday"
		},
		{
			"date": "2018-04-30",
			"name": "Labour Day Holiday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-05-21",
			"name": "No trading 1"
		},
		{
			"date": "2018-05-22",
			"name": "Buddha's Birthday*"
		},
		{
			"date": "2018-06-18",
			"name": "Tuen Ng Day*"
		},
		{
			"date": "2018-06-18",
			"name": "Dragon Boat Festival (Tuen Ng Day)*"
		},
		{
			"date": "2018-06-29",
			"name": "No trading 2"
		},
		{
			"date": "2018-07-02",
			"name": "SAR Establishment Day OBS"
		},
		{
			"date": "2018-09-21",
			"name": "No trading 3"
		},
		{
			"date": "2018-09-24",
			"name": "Mid-autumn Festival*"
		},
		{
			"date": "2018-09-25",
			"name": "Day Following Mid-autumn Festival*"
		},
		{
			"date": "2018-10-01",
			"name": "National Day 1"
		},
		{
			"date": "2018-10-02",
			"name": "National Day 2"
		},
		{
			"date": "2018-10-03",
			"name": "National Day 3"
		},
		{
			"date": "2018-10-04",
			"name": "National Day 4"
		},
		{
			"date": "2018-10-05",
			"name": "National Day 5"
		},
		{
			"date": "2018-10-16",
			"name": "No trading 4"
		},
		{
			"date": "2018-10-17",
			"name": "Chung Yeung Day*"
		},
		{
			"date": "2018-12-24",
			"name": "Day before HK Christmas"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-12-31",
			"name": "Additional New Year Holiday"
		}
	],
	"name": "Shanghai-HK Stock Connect (Northbound Trading)",
	"hour_aligned": false
}

CIQ.Market.XSHE = {
	"market_tz": "Asia/Hong_Kong",
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:30",
			"close": "11:30"
		},
		{
			"dayofweek": 1,
			"open": "13:00",
			"close": "15:00"
		},
		{
			"dayofweek": 2,
			"open": "09:30",
			"close": "11:30"
		},
		{
			"dayofweek": 2,
			"open": "13:00",
			"close": "15:00"
		},
		{
			"dayofweek": 3,
			"open": "09:30",
			"close": "11:30"
		},
		{
			"dayofweek": 3,
			"open": "13:00",
			"close": "15:00"
		},
		{
			"dayofweek": 4,
			"open": "09:30",
			"close": "11:30"
		},
		{
			"dayofweek": 4,
			"open": "13:00",
			"close": "15:00"
		},
		{
			"dayofweek": 5,
			"open": "09:30",
			"close": "11:30"
		},
		{
			"dayofweek": 5,
			"open": "13:00",
			"close": "15:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-02-08",
			"name": "Lunar New Year 2"
		},
		{
			"date": "2016-02-09",
			"name": "Lunar New Year 3"
		},
		{
			"date": "2016-02-10",
			"name": "Lunar New Year 4"
		},
		{
			"date": "2016-02-11",
			"name": "Lunar New Year 5"
		},
		{
			"date": "2016-02-12",
			"name": "Lunar New Year 6"
		},
		{
			"date": "2016-04-04",
			"name": "Ching Ming Festival"
		},
		{
			"date": "2016-05-02",
			"name": "Labour Day Holiday 2"
		},
		{
			"date": "2016-06-09",
			"name": "Dragon Boat Festival (Tuen Ng Day)*"
		},
		{
			"date": "2016-06-10",
			"name": "Dragon Boat Festival Holiday"
		},
		{
			"date": "2016-09-15",
			"name": "Mid-autumn Festival*"
		},
		{
			"date": "2016-09-16",
			"name": "Mid-autumn Festival Holiday"
		},
		{
			"date": "2016-10-03",
			"name": "National Day 3"
		},
		{
			"date": "2016-10-04",
			"name": "National Day 4"
		},
		{
			"date": "2016-10-05",
			"name": "National Day 5"
		},
		{
			"date": "2016-10-06",
			"name": "National Day 6"
		},
		{
			"date": "2016-10-07",
			"name": "National Day 7"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-01-27",
			"name": "Lunar NY Eve 1"
		},
		{
			"date": "2017-01-30",
			"name": "Lunar New Year 3"
		},
		{
			"date": "2017-01-31",
			"name": "Lunar New Year 4"
		},
		{
			"date": "2017-02-01",
			"name": "Lunar New Year 5"
		},
		{
			"date": "2017-02-02",
			"name": "Lunar New Year 6"
		},
		{
			"date": "2017-04-03",
			"name": "Ching Ming Festival Eve"
		},
		{
			"date": "2017-04-04",
			"name": "Ching Ming Festival"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day 1"
		},
		{
			"date": "2017-05-29",
			"name": "Dragon Boat Festival Holiday"
		},
		{
			"date": "2017-05-30",
			"name": "Dragon Boat Festival (Tuen Ng Day)*"
		},
		{
			"date": "2017-10-02",
			"name": "National Day 2"
		},
		{
			"date": "2017-10-03",
			"name": "National Day 3"
		},
		{
			"date": "2017-10-04",
			"name": "National Day 4"
		},
		{
			"date": "2017-10-04",
			"name": "Mid-autumn Festival*"
		},
		{
			"date": "2017-10-05",
			"name": "National Day 5"
		},
		{
			"date": "2017-10-06",
			"name": "National Day 6"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-02-15",
			"name": "Lunar NY Eve 1"
		},
		{
			"date": "2018-02-16",
			"name": "Lunar New Year 1"
		},
		{
			"date": "2018-02-19",
			"name": "Lunar New Year 4"
		},
		{
			"date": "2018-02-20",
			"name": "Lunar New Year 5"
		},
		{
			"date": "2018-02-21",
			"name": "Lunar New Year 6"
		},
		{
			"date": "2018-04-05",
			"name": "Ching Ming Festival"
		},
		{
			"date": "2018-04-06",
			"name": "Ching Ming Festival Holiday"
		},
		{
			"date": "2018-04-30",
			"name": "Labour Day Holiday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day 1"
		},
		{
			"date": "2018-06-18",
			"name": "Dragon Boat Festival (Tuen Ng Day)*"
		},
		{
			"date": "2018-09-24",
			"name": "Mid-autumn Festival*"
		},
		{
			"date": "2018-10-01",
			"name": "National Day 1"
		},
		{
			"date": "2018-10-02",
			"name": "National Day 2"
		},
		{
			"date": "2018-10-03",
			"name": "National Day 3"
		},
		{
			"date": "2018-10-04",
			"name": "National Day 4"
		},
		{
			"date": "2018-10-05",
			"name": "National Day 5"
		},
		{
			"date": "2018-12-31",
			"name": "Additional New Year Holiday"
		}
	],
	"name": "Shenzhen Stock Exchange A-shares",
	"hour_aligned": false
}

CIQ.Market.XSSE = {
	"market_tz": "Europe/Sarajevo",
	"name": "Sarajevo Stock Exchange",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "10:00",
			"close": "13:30"
		},
		{
			"dayofweek": 2,
			"open": "10:00",
			"close": "13:30"
		},
		{
			"dayofweek": 3,
			"open": "10:00",
			"close": "13:30"
		},
		{
			"dayofweek": 4,
			"open": "10:00",
			"close": "13:30"
		},
		{
			"dayofweek": 5,
			"open": "10:00",
			"close": "13:30"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-02-29",
			"name": "Independence Day Holiday"
		},
		{
			"date": "2016-03-01",
			"name": "Independence Day"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-05-02",
			"name": "Labour Day Holiday"
		},
		{
			"date": "2016-05-03",
			"name": "Labour Day OBS"
		},
		{
			"date": "2016-07-04",
			"name": "Bajram Ramadan"
		},
		{
			"date": "2016-07-05",
			"name": "Bajram Ramadan Holiday"
		},
		{
			"date": "2016-09-12",
			"name": "Bajram Kurban"
		},
		{
			"date": "2016-11-25",
			"name": "Statehood Day"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas OBS"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Holiday"
		},
		{
			"date": "2017-01-03",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-03-01",
			"name": "Independence Day"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-05-02",
			"name": "Labour Day Holiday"
		},
		{
			"date": "2017-06-26",
			"name": "Bajram Ramadan"
		},
		{
			"date": "2017-09-01",
			"name": "Bajram Kurban"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-01-02",
			"name": "New Year's Holiday"
		},
		{
			"date": "2018-03-01",
			"name": "Independence Day"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-04-30",
			"name": "Non-trading day"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-05-02",
			"name": "Labour Day Holiday"
		},
		{
			"date": "2018-06-15",
			"name": "Bajram Ramadan"
		},
		{
			"date": "2018-08-20",
			"name": "Bajram Kurban Holiday"
		},
		{
			"date": "2018-08-21",
			"name": "Bajram Kurban"
		},
		{
			"date": "2018-11-26",
			"name": "Statehood Day OBS"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas"
		}
	]
}

CIQ.Market.XTAI = {
	"market_tz": "Asia/Taipei",
	"name": "Taiwan Stock Exchange",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:00",
			"close": "13:30"
		},
		{
			"dayofweek": 2,
			"open": "09:00",
			"close": "13:30"
		},
		{
			"dayofweek": 3,
			"open": "09:00",
			"close": "13:30"
		},
		{
			"dayofweek": 4,
			"open": "09:00",
			"close": "13:30"
		},
		{
			"dayofweek": 5,
			"open": "09:00",
			"close": "13:30"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-02-04",
			"name": "LNY - No Trading 1"
		},
		{
			"date": "2016-02-05",
			"name": "LNY - No Trading 2"
		},
		{
			"date": "2016-02-08",
			"name": "Lunar New Year 1"
		},
		{
			"date": "2016-02-09",
			"name": "Lunar New Year 2"
		},
		{
			"date": "2016-02-10",
			"name": "Lunar New Year 3"
		},
		{
			"date": "2016-02-11",
			"name": "Additional LNY Holiday"
		},
		{
			"date": "2016-02-12",
			"name": "Additional LNY Holiday 2"
		},
		{
			"date": "2016-02-29",
			"name": "Peace Memorial Day OBS"
		},
		{
			"date": "2016-04-04",
			"name": "Children's Day"
		},
		{
			"date": "2016-04-05",
			"name": "Ching Ming Festival"
		},
		{
			"date": "2016-05-02",
			"name": "Labour Day OBS"
		},
		{
			"date": "2016-06-09",
			"name": "Dragon Boat Festival"
		},
		{
			"date": "2016-06-10",
			"name": "Adjusted Holiday 1"
		},
		{
			"date": "2016-07-08",
			"name": "Closure due to Typhoon"
		},
		{
			"date": "2016-09-15",
			"name": "Mid-Autumn Festival"
		},
		{
			"date": "2016-09-16",
			"name": "Adjusted Holiday 2"
		},
		{
			"date": "2016-09-27",
			"name": "Market Closure due to Typhoon"
		},
		{
			"date": "2016-09-28",
			"name": "Closure due to Typhoon 3"
		},
		{
			"date": "2016-10-10",
			"name": "National Day"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-01-25",
			"name": "LNY - No Trading 1"
		},
		{
			"date": "2017-01-26",
			"name": "LNY - No Trading 2"
		},
		{
			"date": "2017-01-27",
			"name": "Lunar New Year's Eve"
		},
		{
			"date": "2017-01-30",
			"name": "Lunar New Year 3"
		},
		{
			"date": "2017-01-31",
			"name": "Additional LNY Holiday"
		},
		{
			"date": "2017-02-01",
			"name": "Additional LNY Holiday 2"
		},
		{
			"date": "2017-02-27",
			"name": "Adjusted Holiday 1"
		},
		{
			"date": "2017-02-28",
			"name": "Peace Memorial Day"
		},
		{
			"date": "2017-04-03",
			"name": "Ching Ming Festival"
		},
		{
			"date": "2017-04-04",
			"name": "Children's Day"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-05-29",
			"name": "Adjusted Holiday 2"
		},
		{
			"date": "2017-05-30",
			"name": "Dragon Boat Festival"
		},
		{
			"date": "2017-10-04",
			"name": "Mid-Autumn Festival"
		},
		{
			"date": "2017-10-09",
			"name": "Adjusted Holiday 3"
		},
		{
			"date": "2017-10-10",
			"name": "National Day"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-02-13",
			"name": "LNY - No Trading 1"
		},
		{
			"date": "2018-02-14",
			"name": "LNY - No Trading 2"
		},
		{
			"date": "2018-02-15",
			"name": "Lunar New Year's Eve"
		},
		{
			"date": "2018-02-16",
			"name": "Lunar New Year 1"
		},
		{
			"date": "2018-02-19",
			"name": "Additional LNY Holiday"
		},
		{
			"date": "2018-02-20",
			"name": "Additional LNY Holiday 2"
		},
		{
			"date": "2018-02-28",
			"name": "Peace Memorial Day"
		},
		{
			"date": "2018-04-04",
			"name": "Children's Day"
		},
		{
			"date": "2018-04-05",
			"name": "Ching Ming Festival"
		},
		{
			"date": "2018-04-06",
			"name": "Adjusted Holiday 2"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-06-18",
			"name": "Dragon Boat Festival"
		},
		{
			"date": "2018-09-24",
			"name": "Mid-Autumn Festival"
		},
		{
			"date": "2018-10-10",
			"name": "National Day"
		},
		{
			"date": "2018-12-31",
			"name": "Adjusted Holiday 1"
		}
	]
}

CIQ.Market.XTK1 = {
	"market_tz": "Asia/Tokyo",
	"name": "Tokyo Stock Exchange ToSTNeT Trading",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "08:20",
			"close": "17:30"
		},
		{
			"dayofweek": 2,
			"open": "08:20",
			"close": "17:30"
		},
		{
			"dayofweek": 3,
			"open": "08:20",
			"close": "17:30"
		},
		{
			"dayofweek": 4,
			"open": "08:20",
			"close": "17:30"
		},
		{
			"dayofweek": 5,
			"open": "08:20",
			"close": "17:30"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-01-11",
			"name": "Coming of Age  (Adults') Day"
		},
		{
			"date": "2016-02-11",
			"name": "National Founding Day"
		},
		{
			"date": "2016-03-21",
			"name": "Vernal Equinox OBS"
		},
		{
			"date": "2016-04-29",
			"name": "Showa Day (formerly Greenery Day)"
		},
		{
			"date": "2016-05-03",
			"name": "Constitution Day"
		},
		{
			"date": "2016-05-04",
			"name": "Greenery Day (formerly National Holiday)"
		},
		{
			"date": "2016-05-05",
			"name": "Children's Day"
		},
		{
			"date": "2016-07-18",
			"name": "Marine Day"
		},
		{
			"date": "2016-08-11",
			"name": "Mountain Day"
		},
		{
			"date": "2016-09-19",
			"name": "Respect for the Aged Day"
		},
		{
			"date": "2016-09-22",
			"name": "Autumn Equinox"
		},
		{
			"date": "2016-10-10",
			"name": "Health-Sports Day"
		},
		{
			"date": "2016-11-03",
			"name": "Culture Day"
		},
		{
			"date": "2016-11-23",
			"name": "Labour Thanksgiving Day"
		},
		{
			"date": "2016-12-23",
			"name": "Emperor's Birthday"
		},
		{
			"date": "2017-01-02",
			"name": "Bank Holiday 2"
		},
		{
			"date": "2017-01-03",
			"name": "Bank Holiday 3"
		},
		{
			"date": "2017-01-09",
			"name": "Coming of Age  (Adults') Day"
		},
		{
			"date": "2017-03-20",
			"name": "Vernal Equinox"
		},
		{
			"date": "2017-05-03",
			"name": "Constitution Day"
		},
		{
			"date": "2017-05-04",
			"name": "Greenery Day (formerly National Holiday)"
		},
		{
			"date": "2017-05-05",
			"name": "Children's Day"
		},
		{
			"date": "2017-07-17",
			"name": "Marine Day"
		},
		{
			"date": "2017-08-11",
			"name": "Mountain Day"
		},
		{
			"date": "2017-09-18",
			"name": "Respect for the Aged Day"
		},
		{
			"date": "2017-10-09",
			"name": "Health-Sports Day"
		},
		{
			"date": "2017-11-03",
			"name": "Culture Day"
		},
		{
			"date": "2017-11-23",
			"name": "Labour Thanksgiving Day"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-01-02",
			"name": "Bank Holiday 2"
		},
		{
			"date": "2018-01-03",
			"name": "Bank Holiday 3"
		},
		{
			"date": "2018-01-08",
			"name": "Coming of Age  (Adults') Day"
		},
		{
			"date": "2018-02-12",
			"name": "National Founding Day OBS"
		},
		{
			"date": "2018-03-21",
			"name": "Vernal Equinox"
		},
		{
			"date": "2018-04-30",
			"name": "Showa Day (formerly Greenery Day) OBS"
		},
		{
			"date": "2018-05-03",
			"name": "Constitution Day"
		},
		{
			"date": "2018-05-04",
			"name": "Greenery Day (formerly National Holiday)"
		},
		{
			"date": "2018-07-16",
			"name": "Marine Day"
		},
		{
			"date": "2018-09-17",
			"name": "Respect for the Aged Day"
		},
		{
			"date": "2018-09-24",
			"name": "Autumn Equinox OBS"
		},
		{
			"date": "2018-10-08",
			"name": "Health-Sports Day"
		},
		{
			"date": "2018-11-23",
			"name": "Labour Thanksgiving Day"
		},
		{
			"date": "2018-12-24",
			"name": "Emperor's Birthday OBS"
		},
		{
			"date": "2018-12-31",
			"name": "New Year's Eve"
		}
	]
}

CIQ.Market.XNAS = {
	"market_tz": "America/New_York",
	"name": "NASDAQ",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 2,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 3,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 4,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"dayofweek": 5,
			"open": "09:30",
			"close": "16:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-01-18",
			"name": "Martin Luther King Jr. Day"
		},
		{
			"date": "2016-02-15",
			"name": "Presidents' Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-05-30",
			"name": "Memorial Day"
		},
		{
			"date": "2016-07-04",
			"name": "Independence Day"
		},
		{
			"date": "2016-09-05",
			"name": "Labor Day"
		},
		{
			"date": "2016-11-24",
			"name": "Thanksgiving"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas OBS"
		},
		{
			"date": "2017-01-02",
			"name": "New Year's Day OBS"
		},
		{
			"date": "2017-01-16",
			"name": "Martin Luther King Jr. Day"
		},
		{
			"date": "2017-02-20",
			"name": "Presidents' Day"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-05-29",
			"name": "Memorial Day"
		},
		{
			"date": "2017-07-04",
			"name": "Independence Day"
		},
		{
			"date": "2017-09-04",
			"name": "Labor Day"
		},
		{
			"date": "2017-11-23",
			"name": "Thanksgiving"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-01-15",
			"name": "Martin Luther King Jr. Day"
		},
		{
			"date": "2018-02-19",
			"name": "Presidents' Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-05-28",
			"name": "Memorial Day"
		},
		{
			"date": "2018-07-04",
			"name": "Independence Day"
		},
		{
			"date": "2018-09-03",
			"name": "Labor Day"
		},
		{
			"date": "2018-11-22",
			"name": "Thanksgiving"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas"
		},
		{
			"date": "2018-07-03",
			"open": "09:30",
			"close": "13:00"
		},
		{
			"date": "2018-11-23",
			"open": "09:30",
			"close": "13:00"
		},
		{
			"date": "2018-12-24",
			"open": "09:30",
			"close": "13:00"
		}
	]
}

CIQ.Market.XSTU = {
	"market_tz": "Europe/Berlin",
	"name": "Stuttgart Stock Exchange",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "08:00",
			"close": "22:00"
		},
		{
			"dayofweek": 2,
			"open": "08:00",
			"close": "22:00"
		},
		{
			"dayofweek": 3,
			"open": "08:00",
			"close": "22:00"
		},
		{
			"dayofweek": 4,
			"open": "08:00",
			"close": "22:00"
		},
		{
			"dayofweek": 5,
			"open": "08:00",
			"close": "22:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-05-16",
			"name": "Whitmonday"
		},
		{
			"date": "2016-10-03",
			"name": "National Day"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-06-05",
			"name": "Whitmonday"
		},
		{
			"date": "2017-10-03",
			"name": "National Day"
		},
		{
			"date": "2017-10-31",
			"name": "Reformation Day 500th Anniversary"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-05-21",
			"name": "Whitmonday"
		},
		{
			"date": "2018-12-24",
			"name": "Christmas Eve"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-12-31",
			"name": "New Year's Eve"
		},
		{
			"date": "2018-12-28",
			"open": "08:00",
			"close": "14:00"
		}
	]
}

CIQ.Market.XMCE = {
	"market_tz": "Europe/Madrid",
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 2,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 3,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 4,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"dayofweek": 5,
			"open": "09:00",
			"close": "17:30"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-03-25",
			"name": "Good Friday"
		},
		{
			"date": "2016-03-28",
			"name": "Easter Monday"
		},
		{
			"date": "2016-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2017-04-14",
			"name": "Good Friday"
		},
		{
			"date": "2017-04-17",
			"name": "Easter Monday"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2017-12-26",
			"name": "Christmas Holiday"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-03-30",
			"name": "Good Friday"
		},
		{
			"date": "2018-04-02",
			"name": "Easter Monday"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-12-25",
			"name": "Christmas Day"
		},
		{
			"date": "2018-12-26",
			"name": "Christmas Holiday"
		}
	],
	"name": "Continuous Market (SIBE)",
	"hour_aligned": false
}

CIQ.Market.XTKS = {
	"market_tz": "Asia/Tokyo",
	"rules": [
		{
			"dayofweek": 1,
			"open": "09:30",
			"close": "11:30"
		},
		{
			"dayofweek": 1,
			"open": "12:30",
			"close": "15:00"
		},
		{
			"dayofweek": 2,
			"open": "09:30",
			"close": "11:30"
		},
		{
			"dayofweek": 2,
			"open": "12:30",
			"close": "15:00"
		},
		{
			"dayofweek": 3,
			"open": "09:30",
			"close": "11:30"
		},
		{
			"dayofweek": 3,
			"open": "12:30",
			"close": "15:00"
		},
		{
			"dayofweek": 4,
			"open": "09:30",
			"close": "11:30"
		},
		{
			"dayofweek": 4,
			"open": "12:30",
			"close": "15:00"
		},
		{
			"dayofweek": 5,
			"open": "09:30",
			"close": "11:30"
		},
		{
			"dayofweek": 5,
			"open": "12:30",
			"close": "15:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-01-11",
			"name": "Coming of Age  (Adults') Day"
		},
		{
			"date": "2016-02-11",
			"name": "National Founding Day"
		},
		{
			"date": "2016-03-21",
			"name": "Vernal Equinox OBS"
		},
		{
			"date": "2016-04-29",
			"name": "Showa Day (formerly Greenery Day)"
		},
		{
			"date": "2016-05-03",
			"name": "Constitution Day"
		},
		{
			"date": "2016-05-04",
			"name": "Greenery Day (formerly National Holiday)"
		},
		{
			"date": "2016-05-05",
			"name": "Children's Day"
		},
		{
			"date": "2016-07-18",
			"name": "Marine Day"
		},
		{
			"date": "2016-08-11",
			"name": "Mountain Day"
		},
		{
			"date": "2016-09-19",
			"name": "Respect for the Aged Day"
		},
		{
			"date": "2016-09-22",
			"name": "Autumn Equinox"
		},
		{
			"date": "2016-10-10",
			"name": "Health-Sports Day"
		},
		{
			"date": "2016-11-03",
			"name": "Culture Day"
		},
		{
			"date": "2016-11-23",
			"name": "Labour Thanksgiving Day"
		},
		{
			"date": "2016-12-23",
			"name": "Emperor's Birthday"
		},
		{
			"date": "2017-01-02",
			"name": "Bank Holiday 2"
		},
		{
			"date": "2017-01-03",
			"name": "Bank Holiday 3"
		},
		{
			"date": "2017-01-09",
			"name": "Coming of Age  (Adults') Day"
		},
		{
			"date": "2017-03-20",
			"name": "Vernal Equinox"
		},
		{
			"date": "2017-05-03",
			"name": "Constitution Day"
		},
		{
			"date": "2017-05-04",
			"name": "Greenery Day (formerly National Holiday)"
		},
		{
			"date": "2017-05-05",
			"name": "Children's Day"
		},
		{
			"date": "2017-07-17",
			"name": "Marine Day"
		},
		{
			"date": "2017-08-11",
			"name": "Mountain Day"
		},
		{
			"date": "2017-09-18",
			"name": "Respect for the Aged Day"
		},
		{
			"date": "2017-10-09",
			"name": "Health-Sports Day"
		},
		{
			"date": "2017-11-03",
			"name": "Culture Day"
		},
		{
			"date": "2017-11-23",
			"name": "Labour Thanksgiving Day"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-01-02",
			"name": "Bank Holiday 2"
		},
		{
			"date": "2018-01-03",
			"name": "Bank Holiday 3"
		},
		{
			"date": "2018-01-08",
			"name": "Coming of Age  (Adults') Day"
		},
		{
			"date": "2018-02-12",
			"name": "National Founding Day OBS"
		},
		{
			"date": "2018-03-21",
			"name": "Vernal Equinox"
		},
		{
			"date": "2018-04-30",
			"name": "Showa Day (formerly Greenery Day) OBS"
		},
		{
			"date": "2018-05-03",
			"name": "Constitution Day"
		},
		{
			"date": "2018-05-04",
			"name": "Greenery Day (formerly National Holiday)"
		},
		{
			"date": "2018-07-16",
			"name": "Marine Day"
		},
		{
			"date": "2018-09-17",
			"name": "Respect for the Aged Day"
		},
		{
			"date": "2018-09-24",
			"name": "Autumn Equinox OBS"
		},
		{
			"date": "2018-10-08",
			"name": "Health-Sports Day"
		},
		{
			"date": "2018-11-23",
			"name": "Labour Thanksgiving Day"
		},
		{
			"date": "2018-12-24",
			"name": "Emperor's Birthday OBS"
		},
		{
			"date": "2018-12-31",
			"name": "New Year's Eve"
		}
	],
	"name": "Tokyo Stock Exchange",
	"hour_aligned": false
}

CIQ.Market.XTUN = {
	"market_tz": "Africa/Tunis",
	"name": "Tunis Bourse",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "10:00",
			"close": "14:00"
		},
		{
			"dayofweek": 2,
			"open": "10:00",
			"close": "14:00"
		},
		{
			"dayofweek": 3,
			"open": "10:00",
			"close": "14:00"
		},
		{
			"dayofweek": 4,
			"open": "10:00",
			"close": "14:00"
		},
		{
			"dayofweek": 5,
			"open": "10:00",
			"close": "14:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-01-14",
			"name": "Revolution Day"
		},
		{
			"date": "2016-07-05",
			"name": "Eid al-Fitr 1*"
		},
		{
			"date": "2016-07-06",
			"name": "Eid al-Fitr 2*"
		},
		{
			"date": "2016-07-07",
			"name": "Eid al-Fitr 3"
		},
		{
			"date": "2016-07-25",
			"name": "Republic Day"
		},
		{
			"date": "2016-09-12",
			"name": "Eid al-Adha 1*"
		},
		{
			"date": "2016-09-13",
			"name": "Eid al-Adha 2*"
		},
		{
			"date": "2016-10-03",
			"name": "Trading Holiday"
		},
		{
			"date": "2016-12-12",
			"name": "Prophet's Birthday*"
		},
		{
			"date": "2017-03-20",
			"name": "Independence Day"
		},
		{
			"date": "2017-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2017-06-26",
			"name": "Eid al-Fitr 2*"
		},
		{
			"date": "2017-06-27",
			"name": "Eid al-Fitr 3"
		},
		{
			"date": "2017-07-25",
			"name": "Republic Day"
		},
		{
			"date": "2017-09-01",
			"name": "Eid al-Adha 1*"
		},
		{
			"date": "2017-09-21",
			"name": "Islamic (Hijri) New Year*"
		},
		{
			"date": "2017-12-01",
			"name": "Prophet's Birthday*"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-03-20",
			"name": "Independence Day"
		},
		{
			"date": "2018-04-09",
			"name": "Martyrs Day"
		},
		{
			"date": "2018-05-01",
			"name": "Labour Day"
		},
		{
			"date": "2018-06-15",
			"name": "Eid al-Fitr 1*"
		},
		{
			"date": "2018-07-25",
			"name": "Republic Day"
		},
		{
			"date": "2018-08-13",
			"name": "Women's Day"
		},
		{
			"date": "2018-08-21",
			"name": "Eid al-Adha 1*"
		},
		{
			"date": "2018-08-22",
			"name": "Eid al-Adha 2*"
		},
		{
			"date": "2018-09-12",
			"name": "Islamic (Hijri) New Year*"
		},
		{
			"date": "2018-10-15",
			"name": "Anniversary of Evacuation"
		},
		{
			"date": "2018-11-20",
			"name": "Prophet's Birthday*"
		}
	]
}

CIQ.Market.XULA = {
	"market_tz": "Asia/Ulaanbaatar",
	"name": "Mongolian Stock Exchange",
	"hour_aligned": false,
	"rules": [
		{
			"dayofweek": 1,
			"open": "10:00",
			"close": "13:00"
		},
		{
			"dayofweek": 2,
			"open": "10:00",
			"close": "13:00"
		},
		{
			"dayofweek": 3,
			"open": "10:00",
			"close": "13:00"
		},
		{
			"dayofweek": 4,
			"open": "10:00",
			"close": "13:00"
		},
		{
			"dayofweek": 5,
			"open": "10:00",
			"close": "13:00"
		},
		{
			"date": "2016-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2016-02-09",
			"name": "Mongolian New Year"
		},
		{
			"date": "2016-02-10",
			"name": "Mongolian New Year 2"
		},
		{
			"date": "2016-02-11",
			"name": "Mongolian New Year 3"
		},
		{
			"date": "2016-03-08",
			"name": "Women's Day"
		},
		{
			"date": "2016-06-01",
			"name": "Mother and Child Day"
		},
		{
			"date": "2016-06-29",
			"name": "Election Holiday"
		},
		{
			"date": "2016-07-11",
			"name": "Naadam"
		},
		{
			"date": "2016-07-12",
			"name": "Naadam 2"
		},
		{
			"date": "2016-07-13",
			"name": "Naadam 3"
		},
		{
			"date": "2016-07-14",
			"name": "Naadam 4"
		},
		{
			"date": "2016-07-15",
			"name": "Naadam 5"
		},
		{
			"date": "2016-10-19",
			"name": "Election Holiday 2"
		},
		{
			"date": "2016-10-31",
			"name": "Great Emperor Chinggis Khan Day"
		},
		{
			"date": "2016-12-29",
			"name": "Restoration of National Liberty and Independence Day"
		},
		{
			"date": "2017-02-27",
			"name": "Mongolian New Year"
		},
		{
			"date": "2017-02-28",
			"name": "Mongolian New Year 2"
		},
		{
			"date": "2017-03-01",
			"name": "Mongolian New Year 3"
		},
		{
			"date": "2017-03-08",
			"name": "Women's Day"
		},
		{
			"date": "2017-06-01",
			"name": "Mother and Child Day"
		},
		{
			"date": "2017-06-26",
			"name": "Election Holiday"
		},
		{
			"date": "2017-07-11",
			"name": "Naadam"
		},
		{
			"date": "2017-07-12",
			"name": "Naadam 2"
		},
		{
			"date": "2017-07-13",
			"name": "Naadam 3"
		},
		{
			"date": "2017-07-14",
			"name": "Naadam 4"
		},
		{
			"date": "2017-12-29",
			"name": "Restoration of National Liberty and Independence Day"
		},
		{
			"date": "2018-01-01",
			"name": "New Year's Day"
		},
		{
			"date": "2018-02-16",
			"name": "Mongolian New Year"
		},
		{
			"date": "2018-03-08",
			"name": "Women's Day"
		},
		{
			"date": "2018-06-01",
			"name": "Mother and Child Day"
		},
		{
			"date": "2018-07-11",
			"name": "Naadam"
		},
		{
			"date": "2018-07-12",
			"name": "Naadam 2"
		},
		{
			"date": "2018-07-13",
			"name": "Naadam 3"
		}
	]
}

