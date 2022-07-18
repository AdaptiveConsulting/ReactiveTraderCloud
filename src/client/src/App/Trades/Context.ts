import React, { useContext } from "react"

export const CreditContext = React.createContext(false)

export const useIsCredit = () => useContext(CreditContext)
