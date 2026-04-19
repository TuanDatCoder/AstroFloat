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
 PINNACLE_NUMEROLOGY: 'pinnacle_numerology',
 PINNACLE_DETAILS: 'pinnacle_details',
 PROFILE_PINNACLES: 'profile_pinnacles',
 ZODIAC_CRITERIA: 'zodiac_criteria',
 ZODIAC_ATTRIBUTES: 'zodiac_attributes'
};

// ==========================================
// CÁC TRƯỜNG DỮ LIỆU CỦA DATABASE (FIELDS)
// ==========================================

export const FIELD_NUMEROLOGIES = {
 NUMBER: 'number',
 TITLE: 'title',
 TRAITS: 'traits',
 STRENGTHS: 'strengths',
 WEAKNESSES: 'weaknesses',
 CAREER_PATHS: 'career_paths',
 ADVICE: 'advice',
};

export const FIELD_ZODIAC_SIGNS = {
 ID: 'id',
 NAME: 'name',
 ENGLISH_NAME: 'english_name',
 DATE_RANGE: 'date_range',
 ELEMENT: 'element',
 MODALITY: 'modality',
 RULING_PLANET: 'ruling_planet',
 LUCKY_COLORS: 'lucky_colors',
 DESCRIPTION: 'description',
 IMAGE_URL: 'image_url',
 START_MONTH: 'start_month',
 START_DAY: 'start_day',
 END_MONTH: 'end_month',
 END_DAY: 'end_day',
};

export const FIELD_DAILY_HOROSCOPES = {
 ID: 'id',
 ZODIAC_ID: 'zodiac_id',
 DATE: 'date',
 LUCKY_NUMBER: 'lucky_number',
 LUCKY_TIME: 'lucky_time',
 CONTENT: 'content',
};

export const FIELD_PROFILES = {
 ID: 'id',
 EMAIL: 'email',
 NICKNAME: 'nickname',
 PHONE: 'phone',
 AVATAR_URL: 'avatar_url',
 GENDER: 'gender',
 BIRTH_NAME: 'birth_name',
 BIRTH_DATE: 'birth_date',
 BIRTH_TIME: 'birth_time',
 BIRTH_PLACE: 'birth_place',
 BIRTH_LAT: 'birth_lat',
 BIRTH_LNG: 'birth_lng',
 TIMEZONE: 'timezone',
 LIFE_PATH_NUMBER: 'life_path_number',
 ATTITUDE_NUMBER: 'attitude_number',
 DESTINY_NUMBER: 'destiny_number',
 SOUL_URGE_NUMBER: 'soul_urge_number',
 PERSONALITY_NUMBER: 'personality_number',
 BALANCE_NUMBER: 'balance_number',
 MATURITY_NUMBER: 'maturity_number',
 SUN_SIGN_ID: 'sun_sign_id',
 MOON_SIGN_ID: 'moon_sign_id',
 RISING_SIGN_ID: 'rising_sign_id',
 ROLE: 'role',
 TIER: 'tier',
 CREATED_AT: 'created_at',
 UPDATED_AT: 'updated_at',
};

export const FIELD_NAME_NUMEROLOGY = {
 ID: 'id',
 NUMBER: 'number',
 TITLE: 'title',
 TRAITS: 'traits',
 STRENGTHS: 'strengths',
 WEAKNESSES: 'weaknesses',
 CAREER_PATHS: 'career_paths',
 LOVE_STYLE: 'love_style',
 ADVICE: 'advice',
};

export const FIELD_NAME_NUMEROLOGY_DETAILS = {
 ID: 'id',
 NUMBER: 'number',
 TOPIC: 'topic',
 TITLE: 'title',
 CONTENT: 'content',
 ICON_NAME: 'icon_name',
};

export const FIELD_NUMEROLOGY_LETTER_MAPPING = {
 LETTER: 'letter',
 VALUE: 'value',
};

export const FIELD_NAME_ADVANCED_METRICS = {
 ID: 'id',
 METRIC_TYPE: 'metric_type',
 NUMBER: 'number',
 TITLE: 'title',
 CONTENT: 'content',
 ADVICE: 'advice',
};

export const FIELD_PINNACLE_NUMEROLOGY = {
 ID: 'id',
 NUMBER: 'number',
 TITLE: 'title',
 CONTENT: 'content',
 ADVICE: 'advice',
};

export const FIELD_ZODIAC_CRITERIA = {
 ID: 'id',
 CRITERIA_NAME: 'criteria_name',
 CATEGORY: 'category',
 ICON_URL: 'icon_url',
};

export const FIELD_ZODIAC_ATTRIBUTES = {
 ID: 'id',
 ZODIAC_ID: 'zodiac_id',
 CRITERIA_ID: 'criteria_id',
 SCORE: 'score',
 DESCRIPTION: 'description',
};

export const FIELD_PROFILE_PINNACLES = {
 ID: 'id',
 PROFILE_ID: 'profile_id',
 PINNACLE_LEVEL: 'pinnacle_level',
 START_AGE: 'start_age',
 END_AGE: 'end_age',
 START_YEAR: 'start_year',
 END_YEAR: 'end_year',
 PINNACLE_NUMBER: 'pinnacle_number',
};

export const FIELD_PINNACLE_DETAILS = {
 ID: 'id',
 PINNACLE_NUMBER: 'pinnacle_number',
 TOPIC: 'topic',
 TITLE: 'title',
 CONTENT: 'content',
 IS_PREMIUM: 'is_premium',
};

export const FIELD_NUMEROLOGY_DETAILS = {
 ID: 'id',
 NUMBER: 'number',
 TOPIC: 'topic',
 TITLE: 'title',
 CONTENT: 'content',
 ICON_NAME: 'icon_name',
};

export const FIELD_ZODIAC_DETAILS = {
 ID: 'id',
 ZODIAC_ID: 'zodiac_id',
 TOPIC: 'topic',
 TITLE: 'title',
 CONTENT: 'content',
 IS_PREMIUM: 'is_premium',
};

export const FIELD_ZODIAC_MATCHES = {
 ID: 'id',
 ZODIAC_SIGN_1_ID: 'zodiac_sign_1_id',
 ZODIAC_SIGN_2_ID: 'zodiac_sign_2_id',
 MATCH_SCORE: 'match_score',
 LOVE_ANALYSIS: 'love_analysis',
 FRIENDSHIP_ANALYSIS: 'friendship_analysis',
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
 ZODIAC_ALL_MATCHES: '/zodiac-all-matches',
 FORGOT_PASSWORD: '/forgot-password'
};

export const ZODIAC_CATEGORIES = [
 { id: 'love', name: 'Tình Yêu', dbCats: ['Tình yêu'] },
 { id: 'friend', name: 'Tình Bạn', dbCats: ['Xã hội'] },
 { id: 'work', name: 'Sự Nghiệp', dbCats: ['Sự nghiệp', 'Tiền bạc', 'Sự nghiệp & Tiền bạc'] },
 { id: 'personality', name: 'Tính Cách', dbCats: ['Tính cách', 'Góc tối', 'Góc khuất'] },
];
