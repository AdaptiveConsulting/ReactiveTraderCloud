import { Loader } from "@/components/Loader"
import { ThemeName, themes, useTheme } from "@/theme"
import { Subscribe } from "@react-rxjs/core"
import { FC, useEffect } from "react"
import { ThemeProvider } from "styled-components"
import { CreditSellSideTicketCore } from "./CreditSellSideTicketCore"

interface CreditSellSideTicketProps {
  rfqId: number
  dealerId: number
}

export const CreditSellSideTicket: FC<CreditSellSideTicketProps> = (props) => {
  const { themeName } = useTheme()
  const invertedThemeName =
    themeName === ThemeName.Dark ? ThemeName.Light : ThemeName.Dark

  useEffect(() => {
    document.title = "RFQ from Adaptive Asset Management"
  }, [])

  return (
    <Subscribe fallback={<Loader ariaLabel="Loading RFQ" />}>
      <ThemeProvider theme={themes[invertedThemeName]}>
        <CreditSellSideTicketCore {...props} />
      </ThemeProvider>
    </Subscribe>
  )
}
