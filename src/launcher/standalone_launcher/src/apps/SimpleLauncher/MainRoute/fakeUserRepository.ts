import { User } from 'rt-types'

const LOG_NAME = 'FakeUserRepository: '

export const fakeUserDetails: User[] = [
  {
    code: 'LMO',
    firstName: 'Lorretta',
    lastName: 'Moe',
    avatar: `${window.location.origin}/static/media/mockedAvatars/one.png`
  },
  {
    code: 'WMO',
    firstName: 'Wenona',
    lastName: 'Moshier',
    avatar: `${window.location.origin}/static/media/mockedAvatars/two.png`
  },
  {
    code: 'NGA',
    firstName: 'Nita',
    lastName: 'Garica',
    avatar: `${window.location.origin}/static/media/mockedAvatars/three.png`
  },
  {
    code: 'HHA',
    firstName: 'Hyun',
    lastName: 'Havlik',
    avatar: `${window.location.origin}/static/media/mockedAvatars/four.png`
  },
  {
    code: 'EDO',
    firstName: 'Elizebeth',
    lastName: 'Doverspike',
    avatar: `${window.location.origin}/static/media/mockedAvatars/five.png`
  }
]

const userDetails = fakeUserDetails[Math.floor(Math.random() * fakeUserDetails.length)]

const currentUser: User = {
  firstName: userDetails.firstName,
  lastName: userDetails.lastName,
  code: userDetails.code,
  avatar: userDetails.avatar
}

console.info(
  LOG_NAME,
  `Will use user ${currentUser.firstName} ${currentUser.lastName} (${currentUser.code}) for this session`
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
