import { User } from 'rt-types'

const LOG_NAME = 'FakeUserRepository: '

export const fakeUserDetails = [
  {
    shortCode: 'LMO',
    firstName: 'Lorretta',
    lastName: 'Moe',
    avatar: './static/media/mockedAvatars/account-one-32-x-32-active.png',
  },
  {
    shortCode: 'WMO',
    firstName: 'Wenona',
    lastName: 'Moshier',
    avatar: './static/media/mockedAvatars/account-two-32-x-32-active.png',
  },
  {
    shortCode: 'NGA',
    firstName: 'Nita',
    lastName: 'Garica',
    avatar: './static/media/mockedAvatars/account-three-32-x-32-active.png',
  },
  {
    shortCode: 'HHA',
    firstName: 'Hyun',
    lastName: 'Havlik',
    avatar: './static/media/mockedAvatars/account-four-32-x-32-active.png',
  },
  {
    shortCode: 'EDO',
    firstName: 'Elizebeth',
    lastName: 'Doverspike',
    avatar: './static/media/mockedAvatars/account-five-32-x-32-active.png',
  },
  {
    shortCode: 'MDA',
    firstName: 'Magali',
    lastName: 'Dash',
    avatar: './static/media/mockedAvatars/account-one-32-x-32-active.png',
  },
  {
    shortCode: 'DGR',
    firstName: 'Dorinda',
    lastName: 'Granillo',
    avatar: './static/media/mockedAvatars/account-two-32-x-32-active.png',
  },
  {
    shortCode: 'JMC',
    firstName: 'Jade',
    lastName: 'Mccollister',
    avatar: './static/media/mockedAvatars/account-three-32-x-32-active.png',
  },
  {
    shortCode: 'MPE',
    firstName: 'Michiko',
    lastName: 'Perl',
    avatar: './static/media/mockedAvatars/account-four-32-x-32-active.png',
  },
  {
    shortCode: 'CZA',
    firstName: 'Chanda',
    lastName: 'Zager',
    avatar: './static/media/mockedAvatars/account-five-32-x-32-active.png',
  },
  {
    shortCode: 'JED',
    firstName: 'Jarrett',
    lastName: 'Eddings',
    avatar: './static/media/mockedAvatars/account-one-32-x-32-active.png',
  },
  {
    shortCode: 'HLU',
    firstName: 'Harley',
    lastName: 'Luther',
    avatar: './static/media/mockedAvatars/account-two-32-x-32-active.png',
  },
  {
    shortCode: 'DOR',
    firstName: 'Dong',
    lastName: 'Ortega',
    avatar: './static/media/mockedAvatars/account-three-32-x-32-active.png',
  },
  {
    shortCode: 'KLA',
    firstName: 'King',
    lastName: 'Lamb',
    avatar: './static/media/mockedAvatars/account-four-32-x-32-active.png',
  },
  {
    shortCode: 'AZE',
    firstName: 'Andres',
    lastName: 'Zebrowski',
    avatar: './static/media/mockedAvatars/account-five-32-x-32-active.png',
  },
  {
    shortCode: 'RNI',
    firstName: 'Rufus',
    lastName: 'Nilges',
    avatar: './static/media/mockedAvatars/account-one-32-x-32-active.png',
  },
  {
    shortCode: 'FAP',
    firstName: 'Fritz',
    lastName: 'Aparicio',
    avatar: './static/media/mockedAvatars/account-two-32-x-32-active.png',
  },
  {
    shortCode: 'DNA',
    firstName: 'Don',
    lastName: 'Nason',
    avatar: './static/media/mockedAvatars/account-three-32-x-32-active.png',
  },
  {
    shortCode: 'ESP',
    firstName: 'Eldridge',
    lastName: 'Spoor',
    avatar: './static/media/mockedAvatars/account-four-32-x-32-active.png',
  },
  {
    shortCode: 'AGE',
    firstName: 'Ambrose',
    lastName: 'Gerdts',
    avatar: './static/media/mockedAvatars/account-five-32-x-32-active.png',
  },
]

const userDetails = fakeUserDetails[Math.floor(Math.random() * fakeUserDetails.length)]

const currentUser: User = {
  firstName: userDetails.firstName,
  lastName: userDetails.lastName,
  code: userDetails.shortCode,
  avatar: userDetails.avatar,
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
  static get userList() {
    return fakeUserDetails
  }
}
