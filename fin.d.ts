// ref https://github.com/built-on-openfin/container-starter/blob/main/how-to/common/types/fin.d.ts
import type { fin as FinApi } from "@openfin/core"

declare global {
  const fin: typeof FinApi
}
