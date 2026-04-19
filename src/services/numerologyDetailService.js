import { supabase } from './supabase';
import { TABLES, FIELD_NUMEROLOGY_DETAILS } from '../constants';

export const numerologyDetailService = {
  async getDetailsByNumber(number) {
    const { data, error } = await supabase.from(TABLES.NUMEROLOGY_DETAILS).select('*').eq(FIELD_NUMEROLOGY_DETAILS.NUMBER, number);
    if (error) throw error;
    return data;
  },

  async createDetail(data) {
    const { data: result, error } = await supabase.from(TABLES.NUMEROLOGY_DETAILS).insert([data]).select().single();
    if (error) throw error;
    return result;
  },

  async updateDetail(id, data) {
    const { data: result, error } = await supabase.from(TABLES.NUMEROLOGY_DETAILS).update(data).eq(FIELD_NUMEROLOGY_DETAILS.ID, id).select().single();
    if (error) throw error;
    return result;
  },

  async deleteDetail(id) {
    const { error } = await supabase.from(TABLES.NUMEROLOGY_DETAILS).delete().eq(FIELD_NUMEROLOGY_DETAILS.ID, id);
    if (error) throw error;
    return true;
  }
};
