export const USER_WORLDWIDE = 'Worldwide'
export const USER_EUROPE = 'Europe'

const USER_STORAGE_KEY = 'workspace-user'
export const USER_RESULT_KEY = 'switch-user'

export const getCurrentUser = () => localStorage.getItem(USER_STORAGE_KEY) || USER_WORLDWIDE

export const setCurrentUser = (user: string) => localStorage.setItem(USER_STORAGE_KEY, user)

export const getUserToSwitch = () => {
  const currentUser = getCurrentUser()
  return currentUser === USER_WORLDWIDE ? USER_EUROPE : USER_WORLDWIDE
}

export const switchUser = () => {
  const userToSwitch = getUserToSwitch()
  setCurrentUser(userToSwitch)
}

export const getUserResult = (user: string) => ({
  key: USER_RESULT_KEY,
  title: `Switch User - ${user}`,
  data: {
    manifestType: 'switch-user'
  },
  actions: []
})
