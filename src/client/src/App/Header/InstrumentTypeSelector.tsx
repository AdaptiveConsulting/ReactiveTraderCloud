import { useHistory, useLocation } from "react-router"

import { DropdownMenu } from "@/components/DropdownMenu"
import { ROUTES_CONFIG } from "@/constants"
import { isMobileDevice } from "@/utils"

enum InstrumentType {
  FX = "FX",
  CREDIT = "Credit",
}

const InstrumentTypeSelector = () => {
  const location = useLocation()
  const history = useHistory()
  const handleInstrumentTypeSelection = (instrumentType: InstrumentType) => {
    history.push(
      instrumentType === InstrumentType.CREDIT ? ROUTES_CONFIG.credit : "/",
    )
  }

  if (isMobileDevice) return null
  return (
    <DropdownMenu
      options={[InstrumentType.FX, InstrumentType.CREDIT]}
      onSelectionChange={(selection) => {
        handleInstrumentTypeSelection(selection as InstrumentType)
      }}
      selectedOption={
        location.pathname === ROUTES_CONFIG.credit
          ? InstrumentType.CREDIT
          : InstrumentType.FX
      }
    />
  )
}

export default InstrumentTypeSelector
