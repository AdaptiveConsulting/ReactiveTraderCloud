import sys
sys.path.append('../../nlp')
from cleanText import clean_fractions


ONE_THROUGH_SEVEN = {
  'label': 'ONE_THROUGH_SEVEN',
  'values': (
    'a',
    'an',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
  ),
}

DENOMINATOR = {
  'label': 'DENOMINATOR',
  'values': (
    'quarter',
    'fourth',
    'half',
    'eighth',
    'eight',
  ),
}

FRACTION_PATTERNS = [
  [['ONE_THROUGH_SEVEN'], ['DENOMINATOR']],
]


def fraction_cleanup(transcript):
  return clean_fractions(transcript)


ENTITY_DEFINITION = {
  'patterns': FRACTION_PATTERNS,
  'extraTokens': (ONE_THROUGH_SEVEN, DENOMINATOR),
  'entityCleaning': fraction_cleanup,
}
