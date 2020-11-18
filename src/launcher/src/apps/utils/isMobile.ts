export const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
  navigator.userAgent
)

export const isiOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)

export const isAndroid = /Android/i.test(navigator.userAgent)
