import { FC } from "react"
import styled from "styled-components"

import { RfqsTab, useSelectedRfqsTab } from "../../selectedRfqsTab"
import { NoCancelledRfqsIcon } from "./svgs/NoCancelledRfqsIcon"
import { NoDoneRfqsIcon } from "./svgs/NoDoneRfqsIcon"
import { NoExpiredRfqsIcon } from "./svgs/NoExpiredRfqsIcon"
import { NoLiveRfqsIcon } from "./svgs/NoLiveRfqsIcon"
import { NoRfqsIcon } from "./svgs/NoRfqsIcon"
import { IconProps } from "./svgs/types"

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.textColor};
`

const IconWrapper = styled.div`
  color: ${({ theme }) => theme.textColor};
`

const Title = styled.div`
  font-size: 15px;
  line-height: 16px;
  font-weight: 400;
  margin-bottom: 3px;
`

const Description = styled.div`
  font-size: 13px;
  line-height: 13px;
  font-weight: 300;
`

function getTitleForTab(tab: RfqsTab) {
  switch (tab) {
    case RfqsTab.All:
      return "You have no RFQs"
    case RfqsTab.Live:
      return "You have no live RFQs"
    case RfqsTab.Expired:
      return "You have no expired RFQs"
    case RfqsTab.Cancelled:
      return "You have no cancelled RFQs"
    case RfqsTab.Done:
      return "You have no executed RFQs"
    default:
      throw new Error("Unsupported tab type")
  }
}

function getDescriptionForTab(tab: RfqsTab) {
  switch (tab) {
    case RfqsTab.All:
    case RfqsTab.Live:
      return "Generate a new request using the trade ticket shown to the right"
    case RfqsTab.Expired:
      return "Any RFQ that has past its RFQ duration will show here"
    case RfqsTab.Cancelled:
      return "Any RFQ you cancel will show here for you to re-use if needed"
    case RfqsTab.Done:
      return "Any RFQ you have accepted will show here"
    default:
      throw new Error("Unsupported tab type")
  }
}

function getIconComponent(tab: RfqsTab): FC<IconProps> {
  switch (tab) {
    case RfqsTab.All:
      return NoRfqsIcon
    case RfqsTab.Live:
      return NoLiveRfqsIcon
    case RfqsTab.Expired:
      return NoExpiredRfqsIcon
    case RfqsTab.Cancelled:
      return NoCancelledRfqsIcon
    case RfqsTab.Done:
      return NoDoneRfqsIcon
    default:
      throw new Error("Unsupported tab type")
  }
}

export const NoRfqsScreen = () => {
  const selectedRfqsTab = useSelectedRfqsTab()
  const IconComponent = getIconComponent(selectedRfqsTab)

  return (
    <Wrapper>
      <IconWrapper>
        <IconComponent />
      </IconWrapper>
      <Title>{getTitleForTab(selectedRfqsTab)}</Title>
      <Description>{getDescriptionForTab(selectedRfqsTab)}</Description>
    </Wrapper>
  )
}
