import { SectionLayout } from "@/client/components/layout/SectionLayout"

import { Title } from "../styled"
import { BubbleChart } from "./BubbleChart"
import { data$ } from "./data"

export const Positions = () => {
  return (
    <SectionLayout Header={<Title>Positions</Title>} Body={<BubbleChart />} />
  )
}

export const positions$ = data$
