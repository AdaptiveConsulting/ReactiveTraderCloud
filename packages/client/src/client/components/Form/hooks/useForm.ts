import { useSafeContext } from "@/client/utils/useSafeContext"

import { FormContext } from "../Form"

export const useForm = () =>
  useSafeContext(FormContext, "No form signal provided")
