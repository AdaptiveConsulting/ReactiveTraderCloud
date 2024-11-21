import { useSafeContext } from "@/client/utils/useSafeContext"

import { FormControlContext } from "./FormControl"

export const useFormControl = () =>
  useSafeContext(FormControlContext, "No form control update function provided")
