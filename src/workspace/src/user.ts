export const USER_TRADER = "Trader"
export const USER_OPS = "Operations"

const USER_STORAGE_KEY = "workspace-user"
export const USER_RESULT_KEY = "switch-user"

export const getCurrentUser = () =>
  localStorage.getItem(USER_STORAGE_KEY) || USER_TRADER

export const setCurrentUser = (user: string) =>
  localStorage.setItem(USER_STORAGE_KEY, user)

export const getUserToSwitch = () => {
  const currentUser = getCurrentUser()
  return currentUser === USER_TRADER ? USER_OPS : USER_TRADER
}

export const switchUser = () => {
  const userToSwitch = getUserToSwitch()
  setCurrentUser(userToSwitch)
}

export const getUserResult = (user: string) => ({
  key: USER_RESULT_KEY,
  title: `Switch User - ${user}`,
  data: {
    manifestType: "switch-user",
  },
  actions: [],
})
