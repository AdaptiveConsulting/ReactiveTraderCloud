import {
  BinIcon,
  ChartIcon,
  CheckCircleIcon,
  ChevronIcon,
  DarkThemeIcon,
  DownloadIcon,
  FilterEditIcon,
  FilterIcon,
  ForbiddenIcon,
  LightThemeIcon,
  PopInIcon,
  PopOutIcon,
  SearchIcon,
} from "@/client/components/icons"
import { RefreshIcon } from "@/client/components/icons/RefreshIcon"
import { Stack } from "@/client/components/Stack"

import { H2, P } from "../elements"
import { SectionBlock } from "../styled"
import {
  DisabledContainer,
  HoverContainer,
  NormalContainer,
  Table,
} from "./Iconography.styled"

const icons = [
  { name: "Bin", Element: <BinIcon /> },
  { name: "Chart", Element: <ChartIcon /> },
  { name: "Check", Element: <CheckCircleIcon /> },
  { name: "Chevron", Element: <ChevronIcon /> },
  { name: "Dark Mode", Element: <DarkThemeIcon height={16} /> },
  { name: "Light Mode", Element: <LightThemeIcon height={16} /> },
  { name: "Download", Element: <DownloadIcon /> },
  { name: "Filter", Element: <FilterIcon /> },
  { name: "Edit Filter", Element: <FilterEditIcon /> },
  { name: "Pop Out", Element: <PopOutIcon /> },
  { name: "Pop In", Element: <PopInIcon /> },
  { name: "Search", Element: <SearchIcon /> },
  { name: "Refresh", Element: <RefreshIcon /> },
  { name: "Forbidden", Element: <ForbiddenIcon /> },
]

const states = [
  { name: "Normal", Container: NormalContainer },
  { name: "Hover", Container: HoverContainer },
  { name: "Disabled", Container: DisabledContainer },
]

export const Iconography = () => (
  <>
    <SectionBlock colorScheme="secondary" mh={0}>
      <H2>Iconography</H2>

      <Stack direction="column" paddingBottom="4xl">
        <P paddingBottom="4xl" paddingTop="2xl">
          With icons we aim to create a consistent style of weight, colour, size
          and usage throughout this platform. All icons can be represented at
          different sizes and should scale accordingly to their container size.
        </P>

        <Table>
          <thead>
            <th />
            {states.map(({ name }) => (
              <th key={name} scope="col">
                {name}
              </th>
            ))}
          </thead>
          <tbody>
            {icons.map(({ name, Element }) => (
              <tr key={name}>
                <th scope="row">{name}</th>
                {states.map(({ name, Container }) => (
                  <Container key={name}>{Element}</Container>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Stack>
    </SectionBlock>
  </>
)
