export const constructUrl = (
  path: string,
  base = window.location.origin,
): string => {
  if (base.endsWith("/") && path.startsWith("/")) {
    return `${base}${path.slice(1)}`
  }
  return `${base}${path}`
}
