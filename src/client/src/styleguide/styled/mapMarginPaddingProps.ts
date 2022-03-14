/* An implementation of Styled System m*, p* for maring padding props
 * https://jxnblk.com/styled-system/getting-started#margin--padding
 */

const STANDARD_MARGIN_RULES = {
  m: {
    0: 'margin-left: 0rem;margin-right: 0rem;margin-top: 0rem;margin-bottom: 0rem;',
    1: 'margin-left: 0.5rem;margin-right: 0.5rem;margin-top: 0.5rem;margin-bottom: 0.5rem;',
    2: 'margin-left: 1rem;margin-right: 1rem;margin-top: 1rem;margin-bottom: 1rem;',
    3: 'margin-left: 2rem;margin-right: 2rem;margin-top: 2rem;margin-bottom: 2rem;',
    4: 'margin-left: 3rem;margin-right: 3rem;margin-top: 3rem;margin-bottom: 3rem;',
    5: 'margin-left: 4rem;margin-right: 4rem;margin-top: 4rem;margin-bottom: 4rem;',
  },
  mx: {
    0: 'margin-left: 0rem;margin-right: 0rem;',
    1: 'margin-left: 0.5rem;margin-right: 0.5rem;',
    2: 'margin-left: 1rem;margin-right: 1rem;',
    3: 'margin-left: 2rem;margin-right: 2rem;',
    4: 'margin-left: 3rem;margin-right: 3rem;',
    5: 'margin-left: 4rem;margin-right: 4rem;',
    auto: 'margin-left: auto;margin-right: auto;',
  },
  ml: {
    0: 'margin-left: 0rem;',
    1: 'margin-left: 0.5rem;',
    2: 'margin-left: 1rem;',
    3: 'margin-left: 2rem;',
    4: 'margin-left: 3rem;',
    5: 'margin-left: 4rem;',
    auto: 'margin-left: auto;',
  },
  mr: {
    0: 'margin-right: 0rem;',
    1: 'margin-right: 0.5rem;',
    2: 'margin-right: 1rem;',
    3: 'margin-right: 2rem;',
    4: 'margin-right: 3rem;',
    5: 'margin-right: 4rem;',
    auto: 'margin-right: auto;',
  },
  my: {
    0: 'margin-top: 0rem;margin-bottom: 0rem;',
    1: 'margin-top: 0.5rem;margin-bottom: 0.5rem;',
    2: 'margin-top: 1rem;margin-bottom: 1rem;',
    3: 'margin-top: 2rem;margin-bottom: 2rem;',
    4: 'margin-top: 3rem;margin-bottom: 3rem;',
    5: 'margin-top: 4rem;margin-bottom: 4rem;',
  },
  mt: {
    0: 'margin-top: 0rem;',
    1: 'margin-top: 0.5rem;',
    2: 'margin-top: 1rem;',
    3: 'margin-top: 2rem;',
    4: 'margin-top: 3rem;',
    5: 'margin-top: 4rem;',
  },
  mb: {
    0: 'margin-bottom: 0rem;',
    1: 'margin-bottom: 0.5rem;',
    2: 'margin-bottom: 1rem;',
    3: 'margin-bottom: 2rem;',
    4: 'margin-bottom: 3rem;',
    5: 'margin-bottom: 4rem;',
  },
}
const STANDARD_PADDING_RULES = {
  p: {
    0: 'padding-left: 0rem;padding-right: 0rem;padding-top: 0rem;padding-bottom: 0rem;',
    1: 'padding-left: 0.5rem;padding-right: 0.5rem;padding-top: 0.5rem;padding-bottom: 0.5rem;',
    2: 'padding-left: 1rem;padding-right: 1rem;padding-top: 1rem;padding-bottom: 1rem;',
    3: 'padding-left: 2rem;padding-right: 2rem;padding-top: 2rem;padding-bottom: 2rem;',
    4: 'padding-left: 3rem;padding-right: 3rem;padding-top: 3rem;padding-bottom: 3rem;',
    5: 'padding-left: 4rem;padding-right: 4rem;padding-top: 4rem;padding-bottom: 4rem;',
  },
  px: {
    0: 'padding-left: 0rem;padding-right: 0rem;',
    1: 'padding-left: 0.5rem;padding-right: 0.5rem;',
    2: 'padding-left: 1rem;padding-right: 1rem;',
    3: 'padding-left: 2rem;padding-right: 2rem;',
    4: 'padding-left: 3rem;padding-right: 3rem;',
    5: 'padding-left: 4rem;padding-right: 4rem;',
    viewport: `padding-left: 1rem;padding-right: 1rem;
    @media all and (min-width: 375px) {padding-left: 1.5rem;padding-right: 1.5rem;}
    @media all and (min-width: 420px) {padding-left: 2rem;padding-right: 2rem;}`,
  },
  pl: {
    0: 'padding-left: 0rem;',
    1: 'padding-left: 0.5rem;',
    2: 'padding-left: 1rem;',
    3: 'padding-left: 2rem;',
    4: 'padding-left: 3rem;',
    5: 'padding-left: 4rem;',
  },
  pr: {
    0: 'padding-right: 0rem;',
    1: 'padding-right: 0.5rem;',
    2: 'padding-right: 1rem;',
    3: 'padding-right: 2rem;',
    4: 'padding-right: 3rem;',
    5: 'padding-right: 4rem;',
  },
  py: {
    0: 'padding-top: 0rem;padding-bottom: 0rem;',
    1: 'padding-top: 0.5rem;padding-bottom: 0.5rem;',
    2: 'padding-top: 1rem;padding-bottom: 1rem;',
    3: 'padding-top: 2rem;padding-bottom: 2rem;',
    4: 'padding-top: 3rem;padding-bottom: 3rem;',
    5: 'padding-top: 4rem;padding-bottom: 4rem;',
  },
  pt: {
    0: 'padding-top: 0rem;',
    1: 'padding-top: 0.5rem;',
    2: 'padding-top: 1rem;',
    3: 'padding-top: 2rem;',
    4: 'padding-top: 3rem;',
    5: 'padding-top: 4rem;',
  },
  pb: {
    0: 'padding-bottom: 0rem;',
    1: 'padding-bottom: 0.5rem;',
    2: 'padding-bottom: 1rem;',
    3: 'padding-bottom: 2rem;',
    4: 'padding-bottom: 3rem;',
    5: 'padding-bottom: 4rem;',
  },
}

type AllMarginRules = typeof STANDARD_MARGIN_RULES
type AllPaddingRules = typeof STANDARD_PADDING_RULES
export type MarginProps = { [P in keyof AllMarginRules]?: keyof AllMarginRules[P] }
export type PaddingProps = { [P in keyof AllPaddingRules]?: keyof AllPaddingRules[P] }
export type MarginPaddingProps = MarginProps & PaddingProps
type MarginPaddingRuleType = keyof MarginPaddingProps

const marginPaddingProps: AllMarginRules & AllPaddingRules = {
  ...STANDARD_MARGIN_RULES,
  ...STANDARD_PADDING_RULES,
}

function isMarginPaddingRuleType(rule: string): rule is MarginPaddingRuleType {
  // @ts-ignore
  return marginPaddingProps[rule] !== undefined
}

export const mapMarginPaddingProps = (props: MarginPaddingProps | { [key: string]: any }) => {
  return Object.keys(props)
    .filter(isMarginPaddingRuleType)
    .map(key => {
      const marginPaddingProp = marginPaddingProps[key]
      // @ts-ignore
      return marginPaddingProp && marginPaddingProp[props[key]]
    })
    .filter(Boolean)
    .join(';')
}

export default mapMarginPaddingProps
