import { useLocation, useNavigate } from "react-router-dom"

import { DropdownMenu } from "@/client/components/DropdownMenu"
import { ROUTES_CONFIG } from "@/client/constants"
import { isMobileDevice } from "@/client/utils"

import { InstrumentTypeSelectorWrapper } from "./Header.styles"

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
    <InstrumentTypeSelectorWrapper>
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
    </InstrumentTypeSelectorWrapper>
  )
}

export default InstrumentTypeSelector
