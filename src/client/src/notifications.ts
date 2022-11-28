export function registerFxNotifications(): Promise<void> {
  return Promise.reject("Function should be implemented at platform level")
}

export function registerCreditQuoteNotifications(): Promise<void> {
  return Promise.reject("Function should be implemented at platform level")
}

export function unregisterCreditQuoteNotifications() {
  new Error("Function should be implemented at platform level")
}

export function registerCreditBlotterUpdates() {
  // no-op by default; implemented for OpenFin
}
