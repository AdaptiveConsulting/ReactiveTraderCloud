import React from 'react'
import { rules } from 'rt-styleguide'
import { styled, Styled } from 'rt-theme'
import {
  ColorProps,
  curryProps,
  extendProps,
  mapColorProps,
  mapTextProps,
  mergeProps,
  Text,
  TextProps,
} from '../StyleguideRoute/styled'

export interface TextFieldProps {
  name: string
  value?: string
  onChange: (value: any) => void
}

export interface TextFieldState {
  focused: boolean
  value: null | string
}

export class TextField extends React.PureComponent<TextFieldProps, TextFieldState> {
  static getDerivedStateFromProps(props: TextFieldProps, state: TextFieldState) {
    let next: TextFieldState | null = null

    // Receive default value
    if (state.value == null) {
      next = { ...next, value: props.value }
    }
    // Receive updates
    else if (Object.keys(props).includes('value') && props.onChange) {
      next = { ...next, value: !props.value ? null : props.value }
    }

    return next
  }

  state: TextFieldState = {
    focused: false,
    value: null,
  }

  onFocus = (event: any) => {
    this.setState({ focused: true })
  }

  onBlur = (event: any) => {
    this.setState({ focused: false })
  }

  onChange = (event: any) => {
    this.setState({ value: event.target.value })

    if (this.props.onChange) {
      this.props.onChange(event)
    }
  }

  render() {
    const { name, value: __, onChange: ___, ...props } = this.props
    const { value, focused } = this.state

    return (
      <LabelLayout htmlFor={name} area={name} focused={focused} filled={focused || value} {...props}>
        <LabelText textTransform="capitalize">{name}</LabelText>
        <Input
          id={name}
          name={name}
          value={value || ''}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChange={this.onChange}
        />
      </LabelLayout>
    )
  }
}

export const LabelText: Styled<TextProps> = styled(Text)`
  margin-top: 0.25rem;
  line-height: 0.75rem;
  font-size: 0.6875rem;
  font-size: 0.625rem;
  ${mapTextProps};
  ${mergeProps([curryProps(mapColorProps, { textColor: 'secondary.3' })])};
`

export const Input = styled.input`
  min-height: 1.5rem;
  font-size: 0.875rem;
  line-height: 1rem;

  outline: none;
  text-indent: 0px;
  text-shadow: none;
  display: block;
  border: none;
  width: 100%;
  max-width: 100%;
`

export const LabelLayout: Styled<{ area?: string; focused?: boolean; filled?: boolean } & ColorProps> = styled.label`
  height: 2.5rem;
  padding: 0 0.5rem;

  grid-area: ${p => p.area};

  position: relative;

  display: grid;
  grid-gap: 0;
  grid-template-rows: auto 1fr;
  grid-template-columns: auto;

  ${rules.userSelectNone}

  /* border-radius: 0.125rem; */

  transition: box-shadow ease 200ms, background-color ease 200ms;

  ${({ focused, filled, theme }) => {
    const { backgroundColor } = mapColorProps({
      theme,
      fg: filled ? 'primary.3' : focused ? 'primary.1' : 'primary.base',
      backgroundColor: filled && !focused ? 'transparent' : 'primary.base',
    })

    const boxShadow = mapColorProps({
      theme,
      fg: filled ? 'primary.3' : focused ? 'primary.1' : 'primary.base',
      bg: filled && !focused ? 'primary.1' : 'primary.base',
    })

    return {
      backgroundColor,
      boxShadow: `0 0.125rem 0 ${boxShadow.backgroundColor}, 0 0.25rem 0 ${boxShadow.color}`,
    }
  }};

  /* ${extendProps(
    curryProps(mapColorProps, ({ focused }: any) => ({
      textColor: focused ? 'transparent' : 'primary.base',
      backgroundColor: focused ? 'primary.base' : 'transparent',
    })),
    ([{ textColor, backgroundColor }]) => {
      return {
        backgroundColor,
      }
    },
  )}; */

  &::after {
    /* content: ''; */
    position: absolute;
    left: 0;
    right: 0;
    bottom: -0.125rem;
    display: block;
    width: 100%;
    margin-top: -1px;
    height: 2px;

    ${
      // Employing a WeakMap<Theme, Result> would effeciently memoize the result

      extendProps(
        curryProps(mapColorProps, ({ focused }: any) => ({
          bg: focused ? 'transparent' : 'primary.base',
        })),
        ([{ backgroundColor }]) => {
          return {
            backgroundColor,
          }
        },
      )
    };
  }
`
