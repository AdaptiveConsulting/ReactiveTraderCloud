export const enum FEATURE_FLAG {
  ADMIN = "admin",
}

export const useFeature = (flag: FEATURE_FLAG) => {
  const url = new URL(window.location.href)
  return url.searchParams.has(flag.toString())
}
