const CURRENCY_INTENT = 'rt.currency.info';

export const mapIntent = (response: any) => {
  let result = '??';
  if (response[0].queryResult.intent.displayName === CURRENCY_INTENT) {
    result = response[0].queryResult.fulfillmentText;
  }

  return result;
}
