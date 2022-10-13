export function registerNotifications(): Promise<void> {
  return Promise.reject("Function should be implemented at platform level")
}

export function registerCreditNotifications(): Promise<void> {
  return Promise.reject("Function should be implemented at platform level")
}

export function unregisterCreditNotifications() {
  new Error("Function should be implemented at platform level")
}
