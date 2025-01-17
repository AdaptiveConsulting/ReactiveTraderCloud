import { useNavigate } from "react-router-dom"

import { DropdownMenu } from "@/client/components/DropdownMenu"
import { EQUITIES, ROUTES_CONFIG } from "@/client/constants"
import { isMobileDevice } from "@/client/utils"

import { InstrumentTypeSelectorWrapper } from "./Header.styles"

enum InstrumentType {
  FX = "FX",
  CREDIT = "Credit",
  EQUITIES = "Equities",
}

const InstrumentTypeSelector = () => {
  const navigate = useNavigate()

  const handleInstrumentTypeSelection = (instrumentType: InstrumentType) => {
    if (instrumentType === InstrumentType.EQUITIES) {
      window.location.href = EQUITIES
    } else {
      navigate(
        instrumentType === InstrumentType.CREDIT ? ROUTES_CONFIG.credit : "/",
      )
    }
  }

  const instruments = Object.values(InstrumentType)

  if (isMobileDevice) return null

  return (
    <InstrumentTypeSelectorWrapper>
      <DropdownMenu
        options={instruments}
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
