# This could be imported from a list / database /etc
COMPANY = {
  'label': 'COMPANY',
  'values': (
    'netflix',
    'verizon',
    'apple',
    'snap',
    'tesla',
  ),
}

BOND_PATTERNS = [
  [['COMPANY'], ['NUM'], ['NUM']], 
  [['COMPANY'], ['NUM']],
]

def capitalize(wordList, spacer):
  return spacer.join(wordList).capitalize()


# This does nothing right now, but could be used to validate that
# a corporate bond actually exists
def validate(entity):
  return True


ENTITY_DEFINITION = {
  'patterns': BOND_PATTERNS,
  'extraTokens': (COMPANY,),
  'spacing': {
    'default': ' ',
  },
  'extraCleaning': {
    'COMPANY': capitalize,
  },
  'entityValidation': validate
}
