import { bind } from '@react-rxjs/core'
import { Observable } from 'rxjs'
import { shareReplay } from 'rxjs/operators'

interface User {
  code: string
  firstName: string
  lastName: string
  avatar: string
}

export const fakeUsers: User[] = [
  {
    code: 'LMO',
    firstName: 'Lorretta',
    lastName: 'Moe',
    avatar: `${window.location.origin}/static/media/mockedAvatars/one.png`,
  },
  {
    code: 'WMO',
    firstName: 'Wenona',
    lastName: 'Moshier',
    avatar: `${window.location.origin}/static/media/mockedAvatars/two.png`,
  },
  {
    code: 'NGA',
    firstName: 'Nita',
    lastName: 'Garica',
    avatar: `${window.location.origin}/static/media/mockedAvatars/three.png`,
  },
  {
    code: 'HHA',
    firstName: 'Hyun',
    lastName: 'Havlik',
    avatar: `${window.location.origin}/static/media/mockedAvatars/four.png`,
  },
  {
    code: 'EDO',
    firstName: 'Elizebeth',
    lastName: 'Doverspike',
    avatar: `${window.location.origin}/static/media/mockedAvatars/five.png`,
  },
]

const _currentUser$ = new Observable<User>(observer => {
  const currentUser = fakeUsers[Math.floor(Math.random() * fakeUsers.length)]
  console.info(
    'FakeUserRepository',
    `Will use user ${currentUser.firstName} ${currentUser.lastName} (${currentUser.code}) for this session`
  )
  observer.next(currentUser)
}).pipe(shareReplay(1))

export const [useUser, currentUser$] = bind(_currentUser$)
