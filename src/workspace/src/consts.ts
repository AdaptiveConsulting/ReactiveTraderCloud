export const BASE_URL =
  import.meta.env.BASE_URL === '/' ? window.location.origin : import.meta.env.BASE_URL
export const { VITE_RT_URL, VITE_RA_URL } = import.meta.env as Record<string, string>
