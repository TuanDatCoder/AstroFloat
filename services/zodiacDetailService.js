import { supabase } from './supabase';
import { TABLES, FIELD_ZODIAC_DETAILS } from '../constants';

export const zodiacDetailService = {
  async getDetailsByZodiacId(zodiacId) {
    const { data, error } = await supabase.from(TABLES.ZODIAC_DETAILS).select('*').eq(FIELD_ZODIAC_DETAILS.ZODIAC_ID, zodiacId);
    if (error) throw error;
    return data;
  },

  async createDetail(detailData) {
    const { data, error } = await supabase.from(TABLES.ZODIAC_DETAILS).insert([detailData]).select().single();
    if (error) throw error;
    return data;
  },

  async updateDetail(id, detailData) {
    const { data, error } = await supabase.from(TABLES.ZODIAC_DETAILS).update(detailData).eq(FIELD_ZODIAC_DETAILS.ID, id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteDetail(id) {
    const { error } = await supabase.from(TABLES.ZODIAC_DETAILS).delete().eq(FIELD_ZODIAC_DETAILS.ID, id);
    if (error) throw error;
    return true;
  }
};
