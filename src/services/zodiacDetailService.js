import { supabase } from './supabase';
import { TABLES, FIELD_ZODIAC_DETAILS } from '../constants';

export const zodiacDetailService = {
 async getDetailsByZodiacId(zodiacId) {
 const { data, error } = await supabase.from(TABLES.ZODIAC_DETAILS).select('*').eq(FIELD_ZODIAC_DETAILS.ZODIAC_ID, zodiacId);
 if (error) throw error;
 return data;
 }
};
