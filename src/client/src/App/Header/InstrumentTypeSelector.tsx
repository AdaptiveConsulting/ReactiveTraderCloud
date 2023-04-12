import { useLocation, useNavigate } from "react-router"

import { DropdownMenu } from "@/components/DropdownMenu"
import { ROUTES_CONFIG } from "@/constants"
import { isMobileDevice } from "@/utils"

enum InstrumentType {
  FX = "FX",
  CREDIT = "Credit",
}

const InstrumentTypeSelector = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const handleInstrumentTypeSelection = (instrumentType: InstrumentType) => {
    navigate(
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
