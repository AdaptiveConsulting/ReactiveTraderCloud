NON_ABBREVIATED_NAMES = ('jeffries', 'barclays')

CLIENT_NAME = {
  'label': 'CLIENT_NAME',
  'values': ('JP', 'RBC', 'BNY') + NON_ABBREVIATED_NAMES
}


CLIENT_ABBREVIATIONS = (
  ('j p', 'JP'),
  ('r b c', 'RBC'),
  ('b n y', 'BNY'),
)

def capitalize(entity):
  return entity.capitalize() if entity in NON_ABBREVIATED_NAMES else entity

ENTITY_DEFINITION = {
  'patterns': [
     [['CLIENT_NAME']],
  ],
  'extraTokens': (CLIENT_NAME,),
  'entityCleaning': capitalize,
  'collapsiblePatterns': CLIENT_ABBREVIATIONS,
}