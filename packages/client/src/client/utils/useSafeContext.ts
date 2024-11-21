import { useContext } from "react"

export const useSafeContext = <T>(
  context: React.Context<T>,
  message: string,
) => {
  const _context = useContext(context)

  if (!_context) throw Error(message)

  return _context
}
