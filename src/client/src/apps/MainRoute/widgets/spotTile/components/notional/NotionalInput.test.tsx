import React from 'react'
import NotionalInput from './NotionalInput'
import { ValidationMessage } from './types'
import { renderWithProviders } from '../../../../../../../__tests__/helpers'

const notional = 1000000
const currencyPairBase = 'EUR'
const currencyPairSymbol = 'EURUSD'
const updateNotional = jest.fn()
const resetNotional = jest.fn()
const inputValidationMessageError: ValidationMessage = {
  type: 'error',
  content: 'Some error',
}
const inputValidationMessageWarning: ValidationMessage = {
  type: 'warning',
  content: 'Some warning',
}
const inputValidationMessageInfo: ValidationMessage = {
  type: 'info',
  content: 'Some information',
}

// Dark theme version
test('NotionalInput default', () => {
  const component = renderWithProviders(
    <NotionalInput
      notional={notional}
      currencyPairBase={currencyPairBase}
      currencyPairSymbol={currencyPairSymbol}
      updateNotional={updateNotional}
      resetNotional={resetNotional}
      validationMessage={null}
      showResetButton={false}
      disabled={false}
    />,
  )
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('NotionalInput with error', () => {
  const component = renderWithProviders(
    <NotionalInput
      notional={notional}
      currencyPairBase={currencyPairBase}
      currencyPairSymbol={currencyPairSymbol}
      updateNotional={updateNotional}
      resetNotional={resetNotional}
      validationMessage={inputValidationMessageError}
      showResetButton={false}
      disabled={false}
    />,
  )
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('NotionalInput with warning', () => {
  const component = renderWithProviders(
    <NotionalInput
      notional={notional}
      currencyPairBase={currencyPairBase}
      currencyPairSymbol={currencyPairSymbol}
      updateNotional={updateNotional}
      resetNotional={resetNotional}
      validationMessage={inputValidationMessageWarning}
      showResetButton={false}
      disabled={false}
    />,
  )
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('NotionalInput with info', () => {
  const component = renderWithProviders(
    <NotionalInput
      notional={notional}
      currencyPairBase={currencyPairBase}
      currencyPairSymbol={currencyPairSymbol}
      updateNotional={updateNotional}
      resetNotional={resetNotional}
      validationMessage={inputValidationMessageInfo}
      showResetButton={false}
      disabled={false}
    />,
  )
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('NotionalInput disabled', () => {
  const component = renderWithProviders(
    <NotionalInput
      notional={notional}
      currencyPairBase={currencyPairBase}
      currencyPairSymbol={currencyPairSymbol}
      updateNotional={updateNotional}
      resetNotional={resetNotional}
      validationMessage={null}
      showResetButton={false}
      disabled={true}
    />,
  )
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('NotionalInput show reset button', () => {
  const component = renderWithProviders(
    <NotionalInput
      notional={notional}
      currencyPairBase={currencyPairBase}
      currencyPairSymbol={currencyPairSymbol}
      updateNotional={updateNotional}
      resetNotional={resetNotional}
      validationMessage={null}
      showResetButton={true}
      disabled={false}
    />,
  )
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

// Light theme version
test('NotionalInput default', () => {
  const component = renderWithProviders(
    <NotionalInput
      notional={notional}
      currencyPairBase={currencyPairBase}
      currencyPairSymbol={currencyPairSymbol}
      updateNotional={updateNotional}
      resetNotional={resetNotional}
      validationMessage={null}
      showResetButton={false}
      disabled={false}
    />,
    'light',
  )
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('NotionalInput with error', () => {
  const component = renderWithProviders(
    <NotionalInput
      notional={notional}
      currencyPairBase={currencyPairBase}
      currencyPairSymbol={currencyPairSymbol}
      updateNotional={updateNotional}
      resetNotional={resetNotional}
      validationMessage={inputValidationMessageError}
      showResetButton={false}
      disabled={false}
    />,
    'light',
  )
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('NotionalInput with warning', () => {
  const component = renderWithProviders(
    <NotionalInput
      notional={notional}
      currencyPairBase={currencyPairBase}
      currencyPairSymbol={currencyPairSymbol}
      updateNotional={updateNotional}
      resetNotional={resetNotional}
      validationMessage={inputValidationMessageWarning}
      showResetButton={false}
      disabled={false}
    />,
    'light',
  )
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('NotionalInput with info', () => {
  const component = renderWithProviders(
    <NotionalInput
      notional={notional}
      currencyPairBase={currencyPairBase}
      currencyPairSymbol={currencyPairSymbol}
      updateNotional={updateNotional}
      resetNotional={resetNotional}
      validationMessage={inputValidationMessageInfo}
      showResetButton={false}
      disabled={false}
    />,
    'light',
  )
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('NotionalInput disabled', () => {
  const component = renderWithProviders(
    <NotionalInput
      notional={notional}
      currencyPairBase={currencyPairBase}
      currencyPairSymbol={currencyPairSymbol}
      updateNotional={updateNotional}
      resetNotional={resetNotional}
      validationMessage={null}
      showResetButton={false}
      disabled={true}
    />,
    'light',
  )
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('NotionalInput show reset button', () => {
  const component = renderWithProviders(
    <NotionalInput
      notional={notional}
      currencyPairBase={currencyPairBase}
      currencyPairSymbol={currencyPairSymbol}
      updateNotional={updateNotional}
      resetNotional={resetNotional}
      validationMessage={null}
      showResetButton={true}
      disabled={false}
    />,
    'light',
  )
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
