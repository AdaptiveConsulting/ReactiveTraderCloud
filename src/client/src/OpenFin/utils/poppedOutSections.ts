export let tilesPoppedOut = false
export let blotterPoppedOut = false
export let analyticsPoppedOut = false
export let numPoppedOutSections = 3 // start at 3 because view attached gets called 3 times on initialization
export const setTilesPoppedOut = (val: boolean) => {
  tilesPoppedOut = val
}
export const setBlotterPoppedOut = (val: boolean) => {
  blotterPoppedOut = val
}
export const setAnalyticsPoppedOut = (val: boolean) => {
  analyticsPoppedOut = val
}
export const setNumPoppedOutSections = (val: number) => {
  numPoppedOutSections = val
}
