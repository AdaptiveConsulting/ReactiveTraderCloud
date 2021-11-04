import styled from "styled-components"
import {
  DownloadIcon,
  FilterIcon,
  PopoutIcon,
  PopInIcon,
  CrossIcon,
  MaximizeIcon,
  MinimizeIcon,
  ChevronIcon,
  UndockIcon,
  ChartIcon,
  MailIcon,
} from "../icons"

import { H2, H3, H5 } from "../elements"
import { Paragraph, SectionBlock, Text, TextProps } from "../styled"

const icons = [
  { name: "Download", icon: DownloadIcon },
  { name: "Filter", icon: FilterIcon },
  { name: "Pop Out", icon: PopoutIcon },
  { name: "Pop In", icon: PopInIcon },
  { name: "Cross", icon: CrossIcon },
  { name: "Minimize-Screen", icon: MinimizeIcon },
  { name: "Maximize-Screen", icon: MaximizeIcon },
  { name: "Chevron", icon: ChevronIcon },
]

export const FontFamilies: React.FC = () => (
  <>
    <SectionBlock colorScheme="secondary" py={0} pt={2} mh={0}>
      <H2 pt={4}>Iconography</H2>

      <Paragraph>
        With icons we aim to create a consistent style of weight, colour, size
        and usage throughout this platform. All icons can be represented at
        different sizes and should scale accordingly to their container size.
      </Paragraph>
    </SectionBlock>
    <SectionBlock colorScheme="secondary" py={2} pt={2} mh={0}>
      <H3>Generic</H3>
      <IconGrid>
        <div></div>
        <H5>Normal</H5>
        <H5>Hover</H5>
        <H5>Active</H5>
        <H5>Disabled</H5>

        {icons.map((element) => {
          return (
            <>
              <H5>{element.name}</H5>
              <div>{element.icon}</div>
              <ActiveIcon>{element.icon}</ActiveIcon>
              <ActiveIcon>{element.icon}</ActiveIcon>
              <DisabledIcon>{element.icon}</DisabledIcon>
            </>
          )
        })}

        <H5>Undock</H5>
        <div>
          <UndockIcon width={24} height={24} />
        </div>
        <ActiveIconInverse>
          <UndockIcon width={24} height={24} />
        </ActiveIconInverse>
        <ActiveIconInverse>
          <UndockIcon width={24} height={24} />
        </ActiveIconInverse>
        <DisabledIcon>
          <UndockIcon width={24} height={24} />
        </DisabledIcon>

        <H5>Chart</H5>
        <div>
          <ChartIcon height={20} width={20} />
        </div>
        <ActiveIcon>
          <ChartIcon height={20} width={20} />
        </ActiveIcon>
        <ActiveIcon>
          <ChartIcon height={20} width={20} />
        </ActiveIcon>
        <DisabledIcon>
          <ChartIcon height={20} width={20} />
        </DisabledIcon>

        <H5>Mail</H5>
        <div>
          <MailIcon size={1} />
        </div>
        <ActiveIcon>
          <MailIcon size={1} />
        </ActiveIcon>
        <ActiveIcon>
          <MailIcon size={1} />
        </ActiveIcon>
        <DisabledIcon>
          <MailIcon size={1} />
        </DisabledIcon>
      </IconGrid>
    </SectionBlock>
  </>
)

const IconGrid = styled(Text)<TextProps>`
  display: grid;
  grid-template-columns: 120px repeat(4, 100px);
  grid-column-gap: 0.5rem;
  grid-row-gap: 0.7rem;
  margin: 3rem 0;
`

const ActiveIcon = styled.div`
  svg path:last-child {
    fill: #5f94f5;
  }
`
const ActiveIconInverse = styled.div`
  svg path:nth-child(3) {
    fill: #5f94f5;
  }
`

const DisabledWholeIcon = styled.div`
  svg path {
    fill: #535760;
  }
`

const DisabledIcon = styled.div`
  svg path:not(:first-child) {
    fill: #535760;
  }
`

export default FontFamilies
