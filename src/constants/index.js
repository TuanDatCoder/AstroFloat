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
  NAME_ADVANCED_METRICS: 'name_advanced_metrics',
  PINNACLE_DETAILS: 'pinnacle_details',
  PROFILE_PINNACLES: 'profile_pinnacles',
  ZODIAC_CRITERIA: 'zodiac_criteria',
  ZODIAC_ATTRIBUTES: 'zodiac_attributes'
};

export const ROUTES = {
  HOME: '/',
  ZODIAC: '/zodiac',
  ZODIAC_DETAIL: (id) => `/zodiac/${id}`,
  NUMEROLOGY: '/numerology',
  NUMEROLOGY_DETAIL: (number) => `/numerology/${number}`,
  ZODIAC_MATCH: '/zodiac-match',
  NAME_NUMEROLOGY: '/name-numerology',
  DISCOVER: '/discover',
  PINNACLE_DETAIL: (number) => `/pinnacle/${number}`,
  PINNACLE_ANALYSIS: '/pinnacle-analysis',
  PROFILE: '/profile',
  PROFILE_EDIT: '/profile/edit',
  CHANGE_PASSWORD: '/change-password',
  LOGIN: '/login',
  REGISTER: '/register',
  NAME_NUMEROLOGY_RESULT: '/name-numerology/result',
  ZODIAC_BEST_MATCHES: '/zodiac-best-matches',
  ZODIAC_ALL_MATCHES: '/zodiac-all-matches'
};
