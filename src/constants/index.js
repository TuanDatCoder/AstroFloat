export const TABLES = {
  ZODIAC_SIGNS: 'zodiac_signs',
  ZODIAC_DETAILS: 'zodiac_details',
  NUMEROLOGIES: 'numerologies',
  NUMEROLOGY_DETAILS: 'numerology_details',
  PROFILES: 'profiles',
  DAILY_HOROSCOPES: 'daily_horoscopes',
  COMPATIBILITY: 'compatibility',
  ZODIAC_MATCHES: 'zodiac_matches',
  NAME_NUMEROLOGIES: 'name_numerology',
  NAME_NUMEROLOGY_DETAILS: 'name_numerology_details',
  LETTER_MAPPING: 'numerology_letter_mapping',
  NAME_ADVANCED_METRICS: 'name_advanced_metrics'
};

export const ROUTES = {
  HOME: '/',
  ZODIAC: '/zodiac',
  ZODIAC_DETAIL: (id) => `/zodiac/${id}`,
  NUMEROLOGY: '/numerology',
  NUMEROLOGY_DETAIL: (number) => `/numerology/${number}`,
  ZODIAC_MATCH: '/zodiac-match',
  NAME_NUMEROLOGY: '/name-numerology'
};
