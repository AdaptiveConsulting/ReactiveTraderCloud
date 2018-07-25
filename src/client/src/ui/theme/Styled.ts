import { Theme } from './theme'
export type Styled<P extends {}> = P & {
  theme?: Theme
}
