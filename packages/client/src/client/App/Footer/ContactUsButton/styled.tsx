import styled from "styled-components"

import Popup from "@/client/components/Popup"

const buttonHeight = "2rem"

export const ContactUsPopup = styled(Popup)`
  box-shadow: 0 7px 26px 0 rgba(23, 24, 25, 0.5);
  bottom: calc(${buttonHeight} + 0.25rem);
  right: 0;
  border-radius: 0.5rem;
`

const ContactUsContent = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`

export const LogoWrapper = styled.div`
  padding: 1rem 0.5rem 0 0.5rem;
`
export const ContactUsContentResolver = ContactUsContent
