import { User } from 'rt-types'

const LOG_NAME = 'FakeUserRepository: '

const fakeUserDetails: User[] = [
  {
    code: 'LMO',
    firstName: 'Lorretta',
    lastName: 'Moe',
  },
  {
    code: 'WMO',
    firstName: 'Wenona',
    lastName: 'Moshier',
  },
  {
    code: 'NGA',
    firstName: 'Nita',
    lastName: 'Garica',
  },
  {
    code: 'HHA',
    firstName: 'Hyun',
    lastName: 'Havlik',
  },
  {
    code: 'EDO',
    firstName: 'Elizebeth',
    lastName: 'Doverspike',
  },
  {
    code: 'MDA',
    firstName: 'Magali',
    lastName: 'Dash',
  },
  {
    code: 'DGR',
    firstName: 'Dorinda',
    lastName: 'Granillo',
  },
  {
    code: 'JMC',
    firstName: 'Jade',
    lastName: 'Mccollister',
  },
  {
    code: 'MPE',
    firstName: 'Michiko',
    lastName: 'Perl',
  },
  {
    code: 'CZA',
    firstName: 'Chanda',
    lastName: 'Zager',
  },
  {
    code: 'JED',
    firstName: 'Jarrett',
    lastName: 'Eddings',
  },
  {
    code: 'HLU',
    firstName: 'Harley',
    lastName: 'Luther',
  },
  {
    code: 'DOR',
    firstName: 'Dong',
    lastName: 'Ortega',
  },
  {
    code: 'KLA',
    firstName: 'King',
    lastName: 'Lamb',
  },
  {
    code: 'AZE',
    firstName: 'Andres',
    lastName: 'Zebrowski',
  },
  {
    code: 'RNI',
    firstName: 'Rufus',
    lastName: 'Nilges',
  },
  {
    code: 'FAP',
    firstName: 'Fritz',
    lastName: 'Aparicio',
  },
  {
    code: 'DNA',
    firstName: 'Don',
    lastName: 'Nason',
  },
  {
    code: 'ESP',
    firstName: 'Eldridge',
    lastName: 'Spoor',
  },
  {
    code: 'AGE',
    firstName: 'Ambrose',
    lastName: 'Gerdts',
  },
]

const userDetails = fakeUserDetails[Math.floor(Math.random() * fakeUserDetails.length)]

const currentUser: User = {
  firstName: userDetails.firstName,
  lastName: userDetails.lastName,
  code: userDetails.code,
}

console.info(
  LOG_NAME,
  `Will use user ${currentUser.firstName} ${currentUser.lastName} (${currentUser.code}) for this session`,
)

export default class FakeUserRepository {
  /**
   * A hardcoded current users that gets set on app start up. There is no concept of sessions or users on the backend.
   */
  static get currentUser() {
    return currentUser
  }
}
