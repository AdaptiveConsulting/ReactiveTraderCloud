MILLION = {
  'label': 'MILLION',
  'values': (
    'million',
  ),
}

MILLION_PATTERNS = [
  [['MILLION']], 
]

def shorten(entity):
  return entity.capitalize()[0]

ENTITY_DEFINITION = {
  'patterns': MILLION_PATTERNS,
  'extraTokens': (MILLION,),
  'spacing': {
    'default': '',
  },
  'entityCleaning': shorten
}
